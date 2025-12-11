import React from 'react';

const Card = ({ children, className = '', hoverEffect = true }) => {
    return (
        <div className={`p-6 rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 transition-all duration-300 ${hoverEffect ? 'hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(31,107,255,0.15)] group' : ''
            } ${className}`}>
            {children}
        </div>
    );
};

export default Card;
