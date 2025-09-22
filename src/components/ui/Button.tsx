import React from 'react';

interface ButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, disabled = false, children = 'Click me', className = '' }) => {
    return (
        <button
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-primary/90'
                } ${className}`}
        >
            {children}
        </button>
    );
};

export default Button;