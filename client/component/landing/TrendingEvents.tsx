import React from 'react';
import SectionHeading from './SectionHeading';
import { Calendar, MapPin, Star } from 'lucide-react';
import Link from 'next/link';

const events = [
    {
        id: 1,
        image: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=1000&auto=format&fit=crop",
        title: "Kathmandu Jazz Festival",
        location: "Patan Durbar Square",
        date: "Oct 24, 2026",
        price: "Rs. 2,500",
        rating: 4.8
    },
    {
        id: 2,
        image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
        title: "Pokhara Street Festival",
        location: "Lakeside, Pokhara",
        date: "Dec 30, 2026",
        price: "Rs. 1,000",
        rating: 4.7
    },
    {
        id: 3,
        image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=1000&auto=format&fit=crop",
        title: "Chitwan Tharu Culture Show",
        location: "Sauraha, Chitwan",
        date: "Weekly",
        price: "Rs. 500",
        rating: 4.6
    },
    {
        id: 4,
        image: "https://images.unsplash.com/photo-1541625602330-2277a4c46182?q=80&w=1000&auto=format&fit=crop",
        title: "Everest Marathon Fundraiser",
        location: "Namche Bazaar",
        date: "May 29, 2027",
        price: "Rs. 5,000",
        rating: 4.9
    }
];

const TrendingEvents = () => {
    return (
        <section className="py-20 bg-[#0f0f11]" id="events">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-12">
                    <SectionHeading
                        title="Trending in Nepal"
                        subtitle="Don't miss out on the most talked-about events happening across the country."
                    />
                    <div className="hidden md:flex gap-2 mb-12">
                        <button className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer text-white">
                            ←
                        </button>
                        <button className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer text-white">
                            →
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {events.map((event) => (
                        <div key={event.id} className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer">
                            <img
                                src={event.image}
                                alt={event.title}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-6 flex flex-col justify-end">
                                <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold text-white w-fit mb-2">
                                    Starts at {event.price}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple-400 transition-colors">
                                    {event.title}
                                </h3>
                                <div className="text-gray-300 text-sm flex items-center gap-2 mb-1">
                                    <MapPin className="w-3 h-3" /> {event.location}
                                </div>
                                <div className="text-gray-300 text-sm flex items-center gap-2 justify-between mt-2 pt-2 border-t border-white/10">
                                    <span className="flex items-center gap-1 text-yellow-400 text-xs">
                                        <Star className="w-3 h-3 fill-yellow-400" /> {event.rating}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs">
                                        <Calendar className="w-3 h-3" /> {event.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/events" className="inline-block bg-[#1c1c1e] text-white px-8 py-3 rounded-full font-semibold hover:bg-purple-600 transition-colors">
                        View All Nepal Events
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default TrendingEvents;
