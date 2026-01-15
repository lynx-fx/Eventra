import React from 'react';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    alignment?: 'left' | 'center';
}

const SectionHeading: React.FC<SectionHeadingProps> = ({ title, subtitle, alignment = 'left' }) => {
    return (
        <div className={`mb-12 ${alignment === 'center' ? 'text-center' : 'text-left'}`}>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
                {title}
            </h2>
            {subtitle && (
                <p className="text-gray-400 max-w-2xl mx-auto leading-relaxed">
                    {subtitle}
                </p>
            )}
        </div>
    );
};

export default SectionHeading;
