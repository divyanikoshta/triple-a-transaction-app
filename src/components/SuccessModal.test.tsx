import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuccessModal from './SuccessModal';

describe('SuccessModal Component', () => {
  it('does not render when isOpen is false', () => {
    render(
      <SuccessModal
        isOpen={false}
        onClose={vi.fn()}
        message="Test message"
      />
    );

    expect(screen.queryByText('Transfer Successful')).not.toBeInTheDocument();
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('renders modal content when isOpen is true', () => {
    render(
      <SuccessModal
        isOpen={true}
        onClose={vi.fn()}
        message="Transaction completed successfully"
        title="Success!"
      />
    );

    expect(screen.getByText('Success!')).toBeInTheDocument();
    expect(screen.getByText('Transaction completed successfully')).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const mockOnClose = vi.fn();
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockOnClose}
        message="Test message"
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);

  });
});