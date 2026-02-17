import React from 'react';
import SectionHeading from './SectionHeading';

const categories = [
    {
        title: "Concerts",
        image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop",
        desc: "Live music & performances"
    },
    {
        title: "Sports",
        image: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop",
        desc: "Match days & tournaments"
    },
    {
        title: "Theater & Arts",
        image: "https://images.unsplash.com/photo-1507676184212-d0370b9df6f0?q=80&w=1000&auto=format&fit=crop",
        desc: "Plays, musicals & galleries"
    }
];

const EventCategories = () => {
    return (
        <section className="py-20 relative z-10">
            <div className="container mx-auto px-4">
                <SectionHeading
                    title="Browse by Category"
                    alignment="left"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((cat, index) => (
                        <div key={index} className="relative h-64 md:h-80 rounded-3xl overflow-hidden group cursor-pointer">
                            <img
                                src={cat.image}
                                alt={cat.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                            />
                            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors flex flex-col justify-end p-8">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mb-4 text-white group-hover:bg-purple-600 group-hover:scale-110 transition-all duration-300">
                                    →
                                </div>
                                <h3 className="text-2xl font-bold text-white">{cat.title}</h3>
                                <p className="text-gray-300 text-sm mt-1">{cat.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default EventCategories;
