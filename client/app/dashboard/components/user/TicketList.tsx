import React, { useEffect, useState } from "react";
import { Ticket, Calendar, MapPin, QrCode } from "lucide-react";
import api from "../../../utils/api";

interface TicketData {
    ticketId: string;
    eventId: {
        title: string;
        startDate: string;
        location: string;
    };
    status: string;
    purchaseDate: string;
}

export default function TicketList() {
    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await api.get("/tickets");
                setTickets(response.data.tickets);
            } catch (error) {
                console.error("Failed to fetch tickets", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return <div className="text-gray-400">Loading tickets...</div>;
    }

    if (tickets.length === 0) {
        return <div className="text-gray-400">You have no tickets yet.</div>;
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-white mb-6">My Tickets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tickets.map((ticket) => (
                    <div key={ticket.ticketId} className="bg-[#1C1C24] rounded-2xl p-6 border border-gray-800 flex flex-col md:flex-row gap-6 hover:border-[#8B5CF6] transition-colors relative overflow-hidden">

                        {/* Status Indicator */}
                        <div className={`absolute top-0 right-0 px-4 py-1 text-xs font-bold uppercase tracking-wider ${ticket.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                            }`}>
                            {ticket.status}
                        </div>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2">{ticket.eventId?.title || "Unknown Event"}</h3>
                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                    <Calendar size={16} />
                                    <span>{ticket.eventId?.startDate ? new Date(ticket.eventId.startDate).toLocaleDateString() : "TBA"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-400 text-sm mt-1">
                                    <MapPin size={16} />
                                    <span>{ticket.eventId?.location || "TBA"}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-700/50">
                                <p className="text-xs text-gray-500 mb-1">TICKET ID</p>
                                <p className="font-mono text-gray-300">#{ticket.ticketId.substring(0, 8)}</p>
                            </div>
                        </div>

                        {/* QR Code Section stub */}
                        <div className="border-l border-dashed border-gray-700 pl-6 flex flex-col items-center justify-center gap-2">
                            <div className="bg-white p-2 rounded-lg">
                                <QrCode size={64} color="black" />
                            </div>
                            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Scan to Enter</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
