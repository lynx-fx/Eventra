import React from 'react';
import SectionHeading from './SectionHeading';
import { MousePointerClick, Ticket, CheckCircle } from 'lucide-react';

const steps = [
    {
        icon: <MousePointerClick className="w-8 h-8 text-purple-400" />,
        title: "Pick Your Event",
        desc: "Browse through thousands of events and choose the one that excites you."
    },
    {
        icon: <Ticket className="w-8 h-8 text-purple-400" />,
        title: "Select Your Tickets",
        desc: "Choose your preferred seats or ticket tier. We have options for every budget."
    },
    {
        icon: <CheckCircle className="w-8 h-8 text-purple-400" />,
        title: "Confirm & Enjoy",
        desc: "Secure checkout and receive your tickets instantly. Get ready for the experience!"
    }
];

const BookingSteps = () => {
    return (
        <section className="py-24 bg-[#0f0f11]">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-16">
                    Booking made as easy as <span className="text-purple-500">1-2-3</span>.
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connector Line (Desktop) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-800 -z-10 border-t border-dashed border-gray-600"></div>

                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-24 h-24 bg-[#1c1c1e] rounded-3xl flex items-center justify-center border border-gray-800 shadow-xl mb-6 relative z-10">
                                {step.icon}
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white text-sm border-4 border-[#0f0f11]">
                                    {index + 1}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                            <p className="text-gray-400 max-w-xs">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BookingSteps;
