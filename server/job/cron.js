const cron = require("node-cron");
const Ticket = require("../model/Tickets");
const Event = require("../model/Events");

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