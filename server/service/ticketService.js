const Ticket = require("../model/Tickets.js");
const Event = require("../model/Events.js");

const crypto = require("crypto");
const { v4: uuidv4 } = require("uuid");

const frontend = process.env.NODE_ENV == "production" ? process.env.FRONT_END_HOSTED : process.env.FRONT_END_LOCAL;

exports.getUserTickets = async (userId) => {
    return await Ticket.find({ userId }).populate('eventId');
};

exports.buyTicket = async (userId, eventId, ticketType = "standard") => {
    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    const now = new Date();

    if (now < event.startDate) throw new Error("Ticket sales have not started yet");
    if (now > event.endDate) throw new Error("Ticket sales have ended for this event");
    if (ticketType !== "standard" && ticketType !== "premium" && ticketType !== "economy") throw new Error("Invalid ticket type");

    const capacity = event.capacity[ticketType] || 0;
    const sold = event.soldTickets[ticketType] || 0;

    if (sold >= capacity) {
        throw new Error(`${ticketType} tickets are sold out`);
    }

    // Find all active or pending tickets for this user
    const userTickets = await Ticket.find({
        userId,
        status: { $in: ["pending", "active"] }
    }).populate('eventId');

    for (const t of userTickets) {
        const existingEvent = t.eventId;
        if (!existingEvent) continue;

        // Check if it's the exact same event
        if (existingEvent._id.toString() === eventId.toString()) {
            throw new Error("You have already registered for this event.");
        }

        // Check for time overlap
        // Overlap happens if Max(start1, start2) < Min(end1, end2)
        const maxStart = Math.max(existingEvent.startDate.getTime(), event.startDate.getTime());
        const minEnd = Math.min(existingEvent.endDate.getTime(), event.endDate.getTime());

        if (maxStart < minEnd) {
            throw new Error(`Time conflict: You are already registered for an overlapping event '${existingEvent.title}'.`);
        }
    }

    const finalPrice = event.price[ticketType] || 0;

    // Generate transaction UUID
    const transaction_uuid = uuidv4();

    // Create ticket (pending)
    const ticket = new Ticket({
        userId,
        eventId,
        ticketType,
        price: finalPrice,
        transaction_uuid,
        status: "pending",
    });

    // Update sold count
    event.soldTickets[ticketType] += 1;

    await Promise.all([ticket.save(), event.save()]);

    // eSewa fields
    const amount = finalPrice;
    const tax_amount = 0;
    const product_service_charge = 0;
    const product_delivery_charge = 0;

    const total_amount =
        amount + tax_amount + product_service_charge + product_delivery_charge;

    const product_code = process.env.ESEWA_PRODUCT_CODE;
    const secretKey = process.env.ESEWA_SECRET_KEY;

    const success_url = `${frontend}/payment/success`;
    const failure_url = `${frontend}/payment/failure`;

    const signed_field_names = "total_amount,transaction_uuid,product_code";

    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;

    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(message)
        .digest("base64");

    const paymentData = {
        amount: amount.toString(),
        tax_amount: tax_amount.toString(),
        total_amount: total_amount.toString(),
        transaction_uuid,
        product_code,
        product_service_charge: product_service_charge.toString(),
        product_delivery_charge: product_delivery_charge.toString(),
        success_url,
        failure_url,
        signed_field_names,
        signature,
    };

    return {
        paymentData,
    };
};

exports.verifyTicket = async (data) => {
    // convert into json
    const decoded = JSON.parse(Buffer.from(data, "base64").toString());

    // verify payment from esewa
    const fields = decoded.signed_field_names.split(",");

    const message = fields
        .map(f => `${f}=${decoded[f]}`)
        .join(",");

    const expectedSignature = crypto
        .createHmac("sha256", process.env.ESEWA_SECRET_KEY)
        .update(message)
        .digest("base64");

    if (decoded.signature !== expectedSignature) {
        throw new Error("Invalid signature");
    }

    if (decoded.status !== "COMPLETE") throw new Error("Payment not completed");

    // handling ticket
    const ticket = await Ticket.findOne({ transaction_uuid: decoded.transaction_uuid });
    if (!ticket) throw new Error("Ticket not found");

    if (Number(decoded.total_amount) !== ticket.price)
        throw new Error("Amount mismatch");

    if (decoded.product_code !== process.env.ESEWA_PRODUCT_CODE)
        throw new Error("Invalid product code");

    ticket.status = "active";
    ticket.transaction_code = decoded.transaction_code;
    await ticket.save();
};

exports.cancelTicket = async (ticketId, userId) => {
    const ticket = await Ticket.findOne({ _id: ticketId, userId });
    if (!ticket) {
        throw new Error("Ticket not found or unauthorized");
    }

    if (ticket.status === 'cancelled') {
        throw new Error("Ticket is already cancelled");
    }

    const event = await Event.findById(ticket.eventId);
    if (event) {
        // Decrease sold tickets count
        const ticketType = ticket.ticketType || 'standard';
        if (event.soldTickets[ticketType] > 0) {
            event.soldTickets[ticketType] -= 1;
        }
        await event.save();
    }

    ticket.status = 'cancelled';
    await ticket.save();
    return ticket;
}

exports.getTicketsBySeller = async (sellerId) => {
    // 1. Find all events created by this seller
    const events = await Event.find({ seller: sellerId });
    const eventIds = events.map(event => event._id);

    // 2. Find all tickets for these events
    const tickets = await Ticket.find({ eventId: { $in: eventIds } })
        .populate('userId', 'name email profileUrl') // Get buyer details
        .populate('eventId', 'title eventDate price'); // Get event details

    return tickets;
};

exports.completePurchase = async (ticketId, userId) => {
    const ticket = await Ticket.findOne({ _id: ticketId, userId });
    if (!ticket) {
        throw new Error("Ticket not found or unauthorized");
    }

    if (ticket.status !== 'pending') {
        throw new Error("Only pending tickets can be completed");
    }

    // Generate new transaction UUID for the retry attempt
    const new_transaction_uuid = uuidv4();
    ticket.transaction_uuid = new_transaction_uuid;
    await ticket.save();

    // eSewa fields
    const amount = ticket.price;
    const tax_amount = 0;
    const product_service_charge = 0;
    const product_delivery_charge = 0;

    const total_amount =
        amount + tax_amount + product_service_charge + product_delivery_charge;

    const product_code = process.env.ESEWA_PRODUCT_CODE;
    const secretKey = process.env.ESEWA_SECRET_KEY;

    const success_url = `${frontend}/payment/success`;
    const failure_url = `${frontend}/payment/failure`;

    const signed_field_names = "total_amount,transaction_uuid,product_code";

    const message = `total_amount=${total_amount},transaction_uuid=${new_transaction_uuid},product_code=${product_code}`;

    const signature = crypto
        .createHmac("sha256", secretKey)
        .update(message)
        .digest("base64");

    const paymentData = {
        amount: amount.toString(),
        tax_amount: tax_amount.toString(),
        total_amount: total_amount.toString(),
        transaction_uuid: new_transaction_uuid,
        product_code,
        product_service_charge: product_service_charge.toString(),
        product_delivery_charge: product_delivery_charge.toString(),
        success_url,
        failure_url,
        signed_field_names,
        signature,
    };

    return { paymentData };
}

exports.getTicketById = async (ticketId) => {
    return await Ticket.findById(ticketId)
        .populate('eventId')
        .populate('userId', 'name email profileUrl');
};

exports.useTicket = async (ticketId, userId, userRole) => {
    const ticket = await Ticket.findById(ticketId).populate('eventId');
    if (!ticket) {
        throw new Error("Ticket not found");
    }

    if (ticket.status !== 'active') {
        throw new Error(`Ticket is already ${ticket.status}`);
    }

    // Check if user is the seller of this event
    if (ticket.eventId.seller.toString() !== userId) {
        throw new Error("Unauthorized: Only the event seller can mark this ticket as used");
    }

    const now = new Date();
    const eventDate = new Date(ticket.eventId.eventDate);

    // Normalize to compare dates only (ignore time)
    const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const normalizedEventDate = new Date(eventDate.getFullYear(), eventDate.getMonth(), eventDate.getDate());

    if (currentDate.getTime() !== normalizedEventDate.getTime()) {
        throw new Error("Cannot use ticket: Event date does not match current date");
    }

    ticket.status = 'used';
    await ticket.save();
    return ticket;
};
