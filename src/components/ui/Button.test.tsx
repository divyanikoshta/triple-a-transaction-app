import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick}>Test Button</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const mockOnClick = vi.fn();
    render(<Button onClick={mockOnClick} disabled={true}>Disabled Button</Button>);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
    expect(button).toBeDisabled();
  });

  it('renders children content correctly', () => {
    render(<Button>Custom Text</Button>);
    expect(screen.getByText('Custom Text')).toBeInTheDocument();
  });
});