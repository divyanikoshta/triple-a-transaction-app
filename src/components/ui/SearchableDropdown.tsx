import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, X } from 'lucide-react';

interface Option {
    value: string | number;
    label: string;
    subtitle?: string;
}

interface SearchableDropdownProps {
    label: string;
    value: string;
    options: Option[];
    onChange: (value: string) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    allowCustomValue?: boolean;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
    label,
    value,
    options,
    onChange,
    placeholder = "",
    error,
    required = true,
    allowCustomValue = true,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [inputValue, setInputValue] = useState(value);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredOptions = options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        option.value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value.replace(/\D/g, '');
        setInputValue(newValue);
        setSearchTerm(newValue);
        setIsOpen(true);

        if (allowCustomValue) {
            onChange(newValue);
        }
    };

    const handleOptionSelect = (option: Option) => {
        const selectedValue = option.value.toString();
        setInputValue(selectedValue);
        onChange(selectedValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const handleInputFocus = () => {
        setIsOpen(true);
        setSearchTerm(inputValue);
    };

    const handleClearValue = () => {
        setInputValue('');
        onChange('');
        setSearchTerm('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
            setSearchTerm('');
        } else if (e.key === 'Enter' && filteredOptions.length === 1) {
            e.preventDefault();
            handleOptionSelect(filteredOptions[0]);
        } else if (e.key === 'ArrowDown' && !isOpen) {
            setIsOpen(true);
        }
    };

    return (
        <div className="mb-4" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <div className="relative">
                <div className={`relative flex items-center border rounded-md ${error ? 'border-red-500' : 'border-gray-300 focus-within:border-blue-500'
                    }`}>
                    <Search size={18} className="absolute left-3 text-gray-400" />

                    <input
                        ref={inputRef}
                        type="number"
                        value={isOpen ? searchTerm : inputValue}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        pattern="^[0-9]+$"
                        className="w-full pl-10 pr-16 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-md"
                    />

                    <div className="absolute right-2 flex items-center gap-1">
                        {inputValue && (
                            <button
                                onClick={handleClearValue}
                                className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        )}

                        <button
                            type="button"
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                        >
                            <ChevronDown
                                size={16}
                                className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                    </div>
                </div>

                {isOpen && filteredOptions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                        {filteredOptions.map((option) => (
                            <div key={option.value} onClick={() => handleOptionSelect(option)} className="px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0">
                                <div className="font-medium text-gray-900">{option.label}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {error && (
                <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
        </div>
    );
};

export default SearchableDropdown;