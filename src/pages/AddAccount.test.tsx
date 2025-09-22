import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AddAccount from './AddAccount';
import apiService from '../services/apiService';


vi.mock('../services/apiService');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});


const mockStore = configureStore({
  reducer: {
    account: () => ({
      accountList: [
        { accountId: 1, amount: '1000', createdAt: '2024-01-01T00:00:00Z' }
      ]
    })
  }
});

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <Provider store={mockStore}>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </Provider>
  );
};

describe('AddAccount Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows validation errors when form is submitted with empty fields', async () => {
    renderWithProviders(<AddAccount />);

    const createButton = screen.getByText('Create Account');
    fireEvent.click(createButton);

    expect(screen.getByText('Account ID is required')).toBeInTheDocument();
    expect(screen.getByText('Initial Balance is required')).toBeInTheDocument();
  });

  it('shows validation error for negative initial balance', async () => {
    renderWithProviders(<AddAccount />);

    const balanceInput = screen.getByLabelText(/initial balance/i);
    fireEvent.change(balanceInput, { target: { value: '-100' } });

    const createButton = screen.getByText('Create Account');
    fireEvent.click(createButton);

    expect(screen.getByText('Initial Balance cannot be negative')).toBeInTheDocument();
  });

  it('creates account successfully and shows success message', async () => {
    const mockApiResponse = { success: true, data: {}, status: 200 };
    vi.mocked(apiService.post).mockResolvedValue(mockApiResponse);

    renderWithProviders(<AddAccount />);

    const accountIdInput = screen.getByLabelText(/account id/i);
    const balanceInput = screen.getByLabelText(/initial balance/i);

    fireEvent.change(accountIdInput, { target: { value: '12345' } });
    fireEvent.change(balanceInput, { target: { value: '1000' } });

    const createButton = screen.getByText('Create Account');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText(/Account 12345 created successfully!/)).toBeInTheDocument();
    });

    expect(apiService.post).toHaveBeenCalledWith('/accounts', {
      account_id: 12345,
      initial_balance: '1000'
    });
  });

  it('shows error message when API call fails', async () => {
    const mockApiResponse = { success: false, data: 'Account creation failed', status: 400 };
    vi.mocked(apiService.post).mockResolvedValue(mockApiResponse);

    renderWithProviders(<AddAccount />);

    const accountIdInput = screen.getByLabelText(/account id/i);
    const balanceInput = screen.getByLabelText(/initial balance/i);

    fireEvent.change(accountIdInput, { target: { value: '12345' } });
    fireEvent.change(balanceInput, { target: { value: '1000' } });

    const createButton = screen.getByText('Create Account');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Account creation failed')).toBeInTheDocument();
    });
  });
  it('shows validation error for account ID less than 3 digits', async () => {
    renderWithProviders(<AddAccount />);

    const accountIdInput = screen.getByLabelText(/account id/i);
    const balanceInput = screen.getByLabelText(/initial balance/i);

    fireEvent.change(accountIdInput, { target: { value: '12' } }); // Only 2 digits
    fireEvent.change(balanceInput, { target: { value: '1000' } });

    const createButton = screen.getByText('Create Account');
    fireEvent.click(createButton);

    expect(screen.getByText('Account ID should be greater then or equal to 3 digit')).toBeInTheDocument();
  });

  it('shows validation error for account ID greater than 12 digits', async () => {
    renderWithProviders(<AddAccount />);

    const accountIdInput = screen.getByLabelText(/account id/i);
    const balanceInput = screen.getByLabelText(/initial balance/i);

    fireEvent.change(accountIdInput, { target: { value: '1234567890123' } }); // 13 digits
    fireEvent.change(balanceInput, { target: { value: '1000' } });

    const createButton = screen.getByText('Create Account');
    fireEvent.click(createButton);

    expect(screen.getByText('Account ID should be less then or equal to 12 digit')).toBeInTheDocument();
  });

  it('clears field errors when user starts typing', async () => {
    renderWithProviders(<AddAccount />);
    const createButton = screen.getByText('Create Account');
    fireEvent.click(createButton);
    expect(screen.getByText('Account ID is required')).toBeInTheDocument();

    const accountIdInput = screen.getByLabelText(/account id/i);
    fireEvent.change(accountIdInput, { target: { value: '123' } });

    expect(screen.queryByText('Account ID is required')).not.toBeInTheDocument();
  });

});