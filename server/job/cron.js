const cron = require("node-cron");
const Ticket = require("../model/Tickets");
const Event = require("../model/Events");
const User = require("../model/Users");
const { eventReminderMail } = require("../util/mailtemplate");

// Run every minute to clean up abandoned pending tickets older than 15 minutes
cron.schedule('* * * * *', async () => {
    try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

        // Find tickets that are pending and older than 15 minutes
        const expiredTickets = await Ticket.find({
            status: "pending",
            createdAt: { $lt: fifteenMinutesAgo }
        });

        if (expiredTickets.length === 0) return;

        for (const ticket of expiredTickets) {
            const event = await Event.findById(ticket.eventId);
            if (event) {
                const ticketType = ticket.ticketType || 'standard';
                const count = ticket.seatCount || 1;
                if (event.soldTickets[ticketType] >= count) {
                    event.soldTickets[ticketType] -= count;
                    await event.save();
                }
            }
            // Mark the expired pending ticket as cancelled instead of deleting
            ticket.status = "cancelled";
            await ticket.save();
        }

        console.log(`Automatically cancelled ${expiredTickets.length} expired pending payment tickets and released seats.`);
    } catch (err) {
        console.error("Pending Tickets Cleanup Cron Error:", err.message);
    }
});

// sends mail if event date is tomorrow
// Runs every day at 5 PM
cron.schedule('01 17 * * *', async () => {
    try {
        const tomorrowStart = new Date();
        tomorrowStart.setDate(tomorrowStart.getDate() + 1);
        tomorrowStart.setHours(0, 0, 0, 0);
        const tomorrowEnd = new Date(tomorrowStart);
        tomorrowEnd.setHours(23, 59, 59, 999);

        // Find events that are tomorrow
        const tomorrowEvents = await Event.find({
            status: "approved",
            eventDate: { $gte: tomorrowStart, $lte: tomorrowEnd }
        });
        if (tomorrowEvents.length === 0) return;

        for (const event of tomorrowEvents) {
            // Find valid tickets for the event
            const tickets = await Ticket.find({
                eventId: event._id,
                status: "active"
            }).populate('userId');

            // De-duplicate users to avoid sending multiple emails for multiple tickets
            const uniqueUsers = new Map();
            for (const ticket of tickets) {
                if (ticket.userId && ticket.userId.email) {
                    uniqueUsers.set(ticket.userId.email, ticket.userId);
                }
            }

            // Send email to each unique user
            for (const user of uniqueUsers.values()) {
                const dateString = new Date(event.startDate).toLocaleString();
                const location = event.venue + (event.city ? `, ${event.city}` : '');
                await eventReminderMail(
                    user.name,
                    user.email,
                    event.title,
                    dateString,
                    location
                );
            }
        }

        console.log(`Sent reminder emails for ${tomorrowEvents.length} events happening tomorrow.`);
    } catch (err) {
        console.error("Event Reminder Cron Error:", err.message);
    }
});

// Run every day at midnight to mark tickets for past events as expired
cron.schedule('0 0 * * *', async () => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        // Find events that are in the past
        const pastEvents = await Event.find({
            eventDate: { $lt: todayStart }
        });

        if (pastEvents.length === 0) return;

        let expiredTicketsCount = 0;

        for (const event of pastEvents) {
            // Find active tickets for these past events
            const result = await Ticket.updateMany(
                { eventId: event._id, status: "active" },
                { $set: { status: "expired" } }
            );

            expiredTicketsCount += result.modifiedCount;
        }

        if (expiredTicketsCount > 0) {
            console.log(`Automatically marked ${expiredTicketsCount} active tickets as expired for past events.`);
        }
    } catch (err) {
        console.error("Ticket Expiration Cron Error:", err.message);
    }
});