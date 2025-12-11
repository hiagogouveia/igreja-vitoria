import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    className = '',
    onClick,
    ...props
}) => {
    const baseStyles = "px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105 uppercase tracking-wider text-sm";

    const variants = {
        primary: "bg-neon-blue text-white shadow-neon-blue hover:shadow-[0_0_20px_rgba(31,107,255,0.7)] border border-neon-blue",
        secondary: "bg-transparent text-white border border-neon-purple shadow-neon-purple hover:bg-neon-purple/20 hover:shadow-[0_0_20px_rgba(139,47,255,0.7)]",
        outline: "bg-transparent text-white border border-white/20 hover:border-white hover:shadow-[0_0_10px_rgba(255,255,255,0.3)]",
        ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            onClick={onClick}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
