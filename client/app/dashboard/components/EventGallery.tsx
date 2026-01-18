import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import api from "../../utils/api";

interface EventData {
    _id: string;
    title: string;
    description: string;
    startDate: string;
    location: string;
}

interface ImageData {
    _id: string;
    imageUrl: string;
}

export default function EventGallery() {
    const [eventRooms, setEventRooms] = useState<EventData[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);
    const [galleryImages, setGalleryImages] = useState<ImageData[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(false);

    // Fetch Events for Rooms
    useEffect(() => {
        const fetchEventRooms = async () => {
            try {
                const response = await api.get("/events");
                setEventRooms(response.data.events);
            } catch (error) {
                console.error("Failed to fetch event rooms", error);
            } finally {
                setLoadingRooms(false);
            }
        };

        fetchEventRooms();
    }, []);

    // Fetch Gallery when event is selected
    useEffect(() => {
        if (selectedEvent) {
            const fetchGallery = async () => {
                setLoadingGallery(true);
                try {
                    const response = await api.get(`/images/gallery?eventId=${selectedEvent._id}`);
                    setGalleryImages(response.data.images);
                } catch (error) {
                    console.error("Failed to fetch gallery images", error);
                } finally {
                    setLoadingGallery(false);
                }
            };
            fetchGallery();
        }
    }, [selectedEvent]);

    // View: List of Events (Rooms)
    if (!selectedEvent) {
        if (loadingRooms) return <div className="text-gray-400">Loading Event Rooms...</div>;

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-serif text-white mb-6">Event Rooms</h2>
                {eventRooms.length === 0 ? (
                    <div className="text-gray-400">No events found.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {eventRooms.map((event) => (
                            <div
                                key={event._id}
                                onClick={() => setSelectedEvent(event)}
                                className="group bg-[#1C1C24] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#8B5CF6] transition-all cursor-pointer shadow-lg"
                            >
                                <div className="relative h-48 w-full overflow-hidden">
                                    <Image
                                        src={"https://placehold.co/400x300/1a1a1a/cccccc?text=" + encodeURIComponent(event.title)}
                                        alt={event.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-white font-bold text-lg mb-2">{event.title}</h3>
                                    <div className="flex flex-col gap-2 text-sm text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} />
                                            <span>{new Date(event.startDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} />
                                            <span>{event.location}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-[#8B5CF6] text-sm font-medium flex items-center gap-2">
                                        View Gallery &rarr;
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // View: Specific Event Gallery
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => setSelectedEvent(null)}
                    className="p-2 rounded-full bg-[#1C1C24] text-white border border-gray-800 hover:text-[#8B5CF6] transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-2xl font-serif text-white">{selectedEvent.title}</h2>
                    <p className="text-sm text-gray-400">Event Gallery</p>
                </div>
            </div>

            {loadingGallery ? (
                <div className="text-gray-400">Loading images...</div>
            ) : galleryImages.length === 0 ? (
                <div className="text-gray-400">No images available for this event yet.</div>
            ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                    {galleryImages.map((img, index) => (
                        <div key={img._id} className="break-inside-avoid relative group rounded-xl overflow-hidden border border-transparent hover:border-gray-800">
                            <img
                                src={img.imageUrl}
                                alt={`Gallery ${index}`}
                                className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className="text-white font-medium border border-white px-4 py-2 rounded-full backdrop-blur-sm">View Full</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
