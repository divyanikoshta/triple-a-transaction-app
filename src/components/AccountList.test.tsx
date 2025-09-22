import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AccountList from './AccountList';

const mockAccounts = [
  {
    accountId: 1,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    accountId: 2,
    createdAt: '2024-01-16T14:45:00Z'
  }
];

describe('AccountList Component', () => {
  it('displays empty state when no accounts provided', () => {
    render(<AccountList accounts={[]} />);
    
    expect(screen.getByText('No accounts available')).toBeInTheDocument();
    expect(screen.getByText('Recent Accounts')).toBeInTheDocument();
  });

  it('renders accounts list when accounts are provided', () => {
    render(<AccountList accounts={mockAccounts} />);
    
    expect(screen.getByText('Account Id #1')).toBeInTheDocument();
    expect(screen.getByText('Account Id #2')).toBeInTheDocument();
    expect(screen.queryByText('No accounts available')).not.toBeInTheDocument();
  });

  it('calls onAccountClick when account is clicked', () => {
    const mockOnAccountClick = vi.fn();
    render(
      <AccountList 
        accounts={mockAccounts} 
        onAccountClick={mockOnAccountClick}
      />
    );
    
    const firstAccount = screen.getByText('Account Id #1');
    fireEvent.click(firstAccount);
    
    expect(mockOnAccountClick).toHaveBeenCalledTimes(1);
    expect(mockOnAccountClick).toHaveBeenCalledWith(mockAccounts[0]);
  });
});