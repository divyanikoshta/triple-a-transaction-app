import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Input from './Input';


const mockOnChange = vi.fn();
describe('Input Component', () => {
    it('calls onChange when input value changes', () => {
        render(<Input id="testInput" label="Test Input" value="" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'new value' } });

        expect(mockOnChange).toHaveBeenCalledTimes(1);
        expect(mockOnChange).toHaveBeenCalled();
    });

    it('displays error message when error prop is provided', () => {
        const errorMessage = 'This field is required';
        render(<Input id="test" label="Test" value="" error={errorMessage} onChange={mockOnChange} />);

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('does not set required attribute when required is false', () => {
        render(<Input id="optionField" label="Optional Field" value="" required={false} onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        expect(input).not.toHaveAttribute('required');
    });

    it('applies error styling when error is present', () => {
        render(<Input id="test" label="Test" value="" error="Error message" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-red-500');
    });

    it('applies normal styling when no error', () => {
        render(<Input id="test" label="Test" value="" onChange={mockOnChange} />);

        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('border-gray-300');
        expect(input).not.toHaveClass('border-red-500');
    });

    it('associates label with input correctly', () => {
        render(<Input id="userName" label="Username" value="" onChange={mockOnChange} />);

        const input = screen.getByLabelText(/username/i);
        expect(input).toBeInTheDocument();
    });
});