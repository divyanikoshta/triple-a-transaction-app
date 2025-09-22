import React from 'react';

interface InputProps {
    id: string;
    label: string;
    value: string;
    type?: string;
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    error?: string;
    pattern?: string;
}

const Input = ({
    id,
    label,
    value,
    type = 'text',
    placeholder,
    onChange,
    required = true,
    error,
    pattern
}: InputProps) => {
    return (
        <div className="mb-4">
            <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                pattern={pattern}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-0.5 focus:ring-blue-500 focus:border-blue-500 ${error ? 'border-red-500' : 'border-gray-300'
                    }`}
            />
            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default Input;