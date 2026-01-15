import React from 'react';
import { ShieldCheck, Zap, Headphones } from 'lucide-react';

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-white" />,
        title: "Secure Booking",
        description: "Our verified sellers and secure payment systems ensure your tickets are authentic and your money is safe."
    },
    {
        icon: <Zap className="w-8 h-8 text-white" />,
        title: "Instant Access",
        description: "Receive your digital tickets immediately after purchase. No waiting, no shipping fees."
    },
    {
        icon: <Headphones className="w-8 h-8 text-white" />,
        title: "24/7 Support",
        description: "Our dedicated support team is available around the clock to assist you with any questions or issues."
    }
];

const Features = () => {
    return (
        <section className="py-20 relative z-10 -mt-10" id="about">
            <div className="container mx-auto px-4">
                <div className="bg-[#1c1c1e] rounded-3xl p-8 shadow-2xl border border-white/5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">
                                Why Thousands of Fans Choose <span className="text-purple-500">Eventra</span>
                            </h2>
                            <p className="text-gray-400 text-sm md:text-base">
                                From sold-out concerts to exclusive theater shows, we make securing your spot easier, safer, and more exciting with our seamless platform.
                            </p>
                            <div className="flex gap-4 mt-6">
                                {/* Social icons could go here if needed, mimicking the reference */}
                            </div>
                            <div className="flex gap-8 mt-8 border-t border-gray-800 pt-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">50k+</div>
                                    <div className="text-xs text-gray-500 mt-1">Happy Fans</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">100%</div>
                                    <div className="text-xs text-gray-500 mt-1">Guaranteed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">5k+</div>
                                    <div className="text-xs text-gray-500 mt-1">Events</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-[#2c2c2e] p-4 rounded-xl flex items-start gap-4 hover:bg-[#3a3a3c] transition-colors">
                                    <div className="bg-purple-600/20 p-3 rounded-lg">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                                        <p className="text-gray-400 text-xs leading-relaxed">{feature.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Features;
