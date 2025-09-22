import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import TransferFunds from './TransferFunds';
import apiService from '../services/apiService';

// Mock dependencies
vi.mock('../services/apiService');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

// Mock Redux store
const mockStore = configureStore({
    reducer: {
        account: () => ({
            accountList: [
                { accountId: 123, amount: '1000', createdAt: '2024-01-01T00:00:00Z' },
                { accountId: 456, amount: '2000', createdAt: '2024-01-02T00:00:00Z' }
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

describe('TransferFunds Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows validation errors for empty required fields', async () => {
        renderWithProviders(<TransferFunds />);

        const transferButton = screen.getByRole('button', { name: /transfer funds/i });
        fireEvent.click(transferButton);

        expect(screen.getByText('Source AccountId is required.')).toBeInTheDocument();
        expect(screen.getByText('Destination AccountId is required.')).toBeInTheDocument();
        expect(screen.getByText('Amount is required')).toBeInTheDocument();
    });

    it('shows validation error when source and destination accounts are the same', async () => {
        renderWithProviders(<TransferFunds />);

        const sourceInput = screen.getByPlaceholderText('Enter Source Account Id');
        const destinationInput = screen.getByPlaceholderText('Ender Destination Account Id');
        const amountInput = screen.getByLabelText(/transfer amount/i);

        fireEvent.change(sourceInput, { target: { value: '123' } });
        fireEvent.change(destinationInput, { target: { value: '123' } });
        fireEvent.change(amountInput, { target: { value: '100' } });

        const transferButton = screen.getByRole('button', { name: /transfer funds/i });
        fireEvent.click(transferButton);

        expect(screen.getByText('Source and destination accounts must be different')).toBeInTheDocument();
    });

    it('shows validation error for invalid amount', async () => {
        renderWithProviders(<TransferFunds />);

        const amountInput = screen.getByLabelText(/transfer amount/i);
        fireEvent.change(amountInput, { target: { value: '-50' } });

        const transferButton = screen.getByRole('button', { name: /transfer funds/i });
        fireEvent.click(transferButton);

        expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
    });

    it('successfully transfers funds and shows success modal', async () => {
        const mockApiResponse = {
            success: true,
            data: {},
            status: 200
        };
        vi.mocked(apiService.post).mockResolvedValue(mockApiResponse);

        renderWithProviders(<TransferFunds />);


        const sourceInput = screen.getByPlaceholderText('Enter Source Account Id');
        const destinationInput = screen.getByPlaceholderText('Ender Destination Account Id');
        const amountInput = screen.getByLabelText(/transfer amount/i);

        fireEvent.change(sourceInput, { target: { value: '123' } });
        fireEvent.change(destinationInput, { target: { value: '456' } });
        fireEvent.change(amountInput, { target: { value: '100' } });

        const transferButton = screen.getByRole('button', { name: /transfer funds/i });
        fireEvent.click(transferButton);

        await waitFor(() => {
            expect(screen.getByText('Transfer Successful')).toBeInTheDocument();
            expect(screen.getByText('Your fund transfer has been completed successfully!')).toBeInTheDocument();
        });

        expect(apiService.post).toHaveBeenCalledWith('/transactions', {
            source_account_id: 123,
            destination_account_id: 456,
            amount: '100'
        });
    });

    it('shows error message when transfer fails', async () => {
        const mockApiResponse = {
            success: false,
            data: null,
            message: 'Insufficient funds',
            status: 400
        };
        vi.mocked(apiService.post).mockResolvedValue(mockApiResponse);

        renderWithProviders(<TransferFunds />);

        const sourceInput = screen.getByPlaceholderText('Enter Source Account Id');
        const destinationInput = screen.getByPlaceholderText('Ender Destination Account Id');
        const amountInput = screen.getByLabelText(/transfer amount/i);

        fireEvent.change(sourceInput, { target: { value: '123' } });
        fireEvent.change(destinationInput, { target: { value: '456' } });
        fireEvent.change(amountInput, { target: { value: '5000' } });

        const transferButton = screen.getByRole('button', { name: /transfer funds/i });
        fireEvent.click(transferButton);

        await waitFor(() => {
            expect(screen.getByText('Insufficient funds')).toBeInTheDocument();
        });
    });

    it('clears errors when user types in source account field', async () => {
        renderWithProviders(<TransferFunds />);

        const transferButton = screen.getByRole('button', { name: /transfer funds/i });
        fireEvent.click(transferButton);

        expect(screen.getByText('Source AccountId is required.')).toBeInTheDocument();

        const sourceInput = screen.getByPlaceholderText('Enter Source Account Id');
        fireEvent.change(sourceInput, { target: { value: '123' } });

        expect(screen.queryByText('Source AccountId is required.')).not.toBeInTheDocument();
    });

    it('clears errors when user types in destination account field', async () => {
        renderWithProviders(<TransferFunds />);

        // First trigger validation error
        const transferButton = screen.getByRole('button', { name: /transfer funds/i });
        fireEvent.click(transferButton);

        expect(screen.getByText('Destination AccountId is required.')).toBeInTheDocument();

        // Then clear error by typing
        const destinationInput = screen.getByPlaceholderText('Ender Destination Account Id');
        fireEvent.change(destinationInput, { target: { value: '456' } });

        expect(screen.queryByText('Destination AccountId is required.')).not.toBeInTheDocument();
    });


    it('capitalizes first letter of error message from API', async () => {
        const mockApiResponse = {
            success: false,
            data: null,
            message: 'insufficient balance',
            status: 400
        };
        vi.mocked(apiService.post).mockResolvedValue(mockApiResponse);

        renderWithProviders(<TransferFunds />);

        const sourceInput = screen.getByPlaceholderText('Enter Source Account Id');
        const destinationInput = screen.getByPlaceholderText('Ender Destination Account Id');
        const amountInput = screen.getByLabelText(/transfer amount/i);

        fireEvent.change(sourceInput, { target: { value: '123' } });
        fireEvent.change(destinationInput, { target: { value: '456' } });
        fireEvent.change(amountInput, { target: { value: '100' } });

        const transferButton = screen.getByRole('button', { name: /transfer funds/i });
        fireEvent.click(transferButton);

        await waitFor(() => {
            expect(screen.getByText('Insufficient balance')).toBeInTheDocument();
        });
    });
});