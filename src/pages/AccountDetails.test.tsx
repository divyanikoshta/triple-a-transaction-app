import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import AccountDetails from './AccountDetails';
import apiService from '../services/apiService';

// Mock dependencies
vi.mock('../services/apiService');
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: () => ({
            state: { accountId: 123 }
        }),
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

describe('AccountDetails Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('shows validation error when searching without account ID', async () => {
        renderWithProviders(<AccountDetails />);
        const input = screen.getByRole('spinbutton');
        fireEvent.change(input, { target: { value: '' } });

        const searchButton = screen.getByRole('button', { name: /search account/i });
        fireEvent.click(searchButton);

        expect(screen.getByText('Please enter Account ID')).toBeInTheDocument();
    });

    it('fetches and displays account balance successfully', async () => {
        const mockAccountData = { balance: '5000.50' };
        const mockApiResponse = {
            success: true,
            data: JSON.stringify(mockAccountData),
            status: 200
        };
        vi.mocked(apiService.get).mockResolvedValue(mockApiResponse);

        renderWithProviders(<AccountDetails />);

        // Account ID should be pre-filled from route state
        const searchButton = screen.getByRole('button', { name: /search account/i });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('Current Balance:')).toBeInTheDocument();
            expect(screen.getByText('$5,000.5')).toBeInTheDocument();
        });

        expect(apiService.get).toHaveBeenCalledWith('/accounts/123');
    });

    it('shows error message when API call fails', async () => {
        const mockApiResponse = {
            success: false,
            data: null,
            message: 'Account not found',
            status: 404
        };
        vi.mocked(apiService.get).mockResolvedValue(mockApiResponse);

        renderWithProviders(<AccountDetails />);

        const searchButton = screen.getByRole('button', { name: /search account/i });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('Account not found')).toBeInTheDocument();
        });

        expect(screen.queryByText('Current Balance:')).not.toBeInTheDocument();
    });

    it('handles API exceptions gracefully', async () => {
        vi.mocked(apiService.get).mockRejectedValue(new Error('Network error'));

        renderWithProviders(<AccountDetails />);

        const searchButton = screen.getByRole('button', { name: /search account/i });
        fireEvent.click(searchButton);

        await waitFor(() => {
            expect(screen.getByText('An error occurred while fetching account details')).toBeInTheDocument();
        });
    });
});