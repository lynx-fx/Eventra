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
                if (event.soldTickets[ticketType] > 0) {
                    event.soldTickets[ticketType] -= 1;
                    await event.save();
                }
            }
            // Delete the expired pending ticket
            await Ticket.findByIdAndDelete(ticket._id);
        }

        console.log(`Automatically deleted ${expiredTickets.length} expired pending payment tickets.`);
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

            // Send email to each user
            for (const ticket of tickets) {
                if (ticket.userId && ticket.userId.email) {
                    const dateString = new Date(event.startDate).toLocaleString();
                    const location = event.venue + (event.city ? `, ${event.city}` : '');
                    await eventReminderMail(
                        ticket.userId.name,
                        ticket.userId.email,
                        event.title,
                        dateString,
                        location
                    );
                }
            }
        }

        console.log(`Sent reminder emails for ${tomorrowEvents.length} events happening tomorrow.`);
    } catch (err) {
        console.error("Event Reminder Cron Error:", err.message);
    }
});