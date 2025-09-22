import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchableDropdown from './SearchableDropdown';

const mockOptions = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Apple' }
];

describe('SearchableDropdown Component', () => {
  it('calls onChange when an option is selected', () => {
    const mockOnChange = vi.fn();
    render(
      <SearchableDropdown
        label="Test Dropdown"
        value=""
        options={mockOptions}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);

    const option = screen.getByText('Option 1');
    fireEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith('1');
  });

  it('filters options based on search input', () => {
    const mockOnChange = vi.fn();
    const numericOptions = [
      { value: '123', label: 'Account 123' },
      { value: '456', label: 'Account 456' },
      { value: '789', label: 'Account 789' }
    ];

    render(
      <SearchableDropdown
        label="Test Dropdown"
        value=""
        options={numericOptions}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: '123' } });

    expect(screen.getByText('Account 123')).toBeInTheDocument();
    expect(screen.queryByText('Account 456')).not.toBeInTheDocument();
    expect(screen.queryByText('Account 789')).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    const mockOnChange = vi.fn();
    render(
      <div>
        <SearchableDropdown
          label="Test Dropdown"
          value=""
          options={mockOptions}
          onChange={mockOnChange}
        />
        <div data-testid="outside">Outside element</div>
      </div>
    );

    const input = screen.getByRole('spinbutton');
    fireEvent.focus(input);

    expect(screen.getByText('Option 1')).toBeInTheDocument();
    const outsideElement = screen.getByTestId('outside');
    fireEvent.mouseDown(outsideElement);

    expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
  });
});