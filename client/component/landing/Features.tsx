import React from 'react';
import { ShieldCheck, Zap, Headphones } from 'lucide-react';

const features = [
    {
        icon: <ShieldCheck className="w-8 h-8 text-primary" />,
        title: "Secure Booking",
        description: "Our verified sellers and secure payment systems ensure your tickets are authentic and your money is safe."
    },
    {
        icon: <Zap className="w-8 h-8 text-primary" />,
        title: "Instant Access",
        description: "Receive your digital tickets immediately after purchase. No waiting, no shipping fees."
    },
    {
        icon: <Headphones className="w-8 h-8 text-primary" />,
        title: "24/7 Support",
        description: "Our dedicated support team is available around the clock to assist you with any questions or issues."
    }
];

const Features = () => {
    return (
        <section className="py-20 relative z-10 -mt-10" id="about">
            <div className="container mx-auto px-4">
                <div className="bg-card/30 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-12">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                                Why Thousands of Fans Choose <span className="text-purple-600 dark:text-purple-400">Eventra</span>
                            </h2>
                            <p className="text-muted-foreground text-sm md:text-base">
                                From sold-out concerts to exclusive theater shows, we make securing your spot easier, safer, and more exciting with our seamless platform.
                            </p>
                            <div className="flex gap-4 mt-6">
                                {/* Social icons could go here if needed, mimicking the reference */}
                            </div>
                            <div className="flex gap-8 mt-8 border-t border-border pt-8">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">50k+</div>
                                    <div className="text-xs text-muted-foreground mt-1">Happy Fans</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">100%</div>
                                    <div className="text-xs text-muted-foreground mt-1">Guaranteed</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-foreground">5k+</div>
                                    <div className="text-xs text-muted-foreground mt-1">Events</div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {features.map((feature, index) => (
                                <div key={index} className="bg-secondary/20 p-4 rounded-xl flex items-start gap-4 hover:bg-secondary/40 transition-colors border border-transparent hover:border-border/50">
                                    <div className="bg-purple-500/10 p-3 rounded-lg">
                                        {feature.icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                                        <p className="text-muted-foreground text-xs leading-relaxed">{feature.description}</p>
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
