import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: () => ({
            pathname: '/add-account'
        }),
    };
});

const renderWithRouter = (component: React.ReactElement) => {
    return render(
        <BrowserRouter>
            {component}
        </BrowserRouter>
    );
};

describe('Layout Component', () => {
    it('renders the main navigation items', () => {
        renderWithRouter(
            <Layout>
                <div>Test Content</div>
            </Layout>
        );

        expect(screen.getByText('Add Account')).toBeInTheDocument();
        expect(screen.getByText('Account Details')).toBeInTheDocument();
        expect(screen.getByText('Transfer Funds')).toBeInTheDocument();
    });

    it('renders the brand name and tagline', () => {
        renderWithRouter(
            <Layout>
                <div>Test Content</div>
            </Layout>
        );

        expect(screen.getByText('FinanceFlow')).toBeInTheDocument();
        expect(screen.getByText('Internal Transfer System')).toBeInTheDocument();
    });

    it('renders children content correctly', () => {
        renderWithRouter(
            <Layout>
                <div data-testid="test-content">Test Page Content</div>
            </Layout>
        );

        expect(screen.getByTestId('test-content')).toBeInTheDocument();
        expect(screen.getByText('Test Page Content')).toBeInTheDocument();
    });

    it('opens mobile menu when menu button is clicked', () => {
        renderWithRouter(
            <Layout>
                <div>Test Content</div>
            </Layout>
        );

        // Click mobile menu button
        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        // Check for the mobile menu overlay instead
        const mobileOverlay = document.querySelector('.fixed.inset-0.z-40.bg-black.bg-opacity-50');
        expect(mobileOverlay).toBeInTheDocument();
    });

    it('closes mobile menu when overlay is clicked', () => {
        renderWithRouter(
            <Layout>
                <div>Test Content</div>
            </Layout>
        );

        const menuButton = screen.getByRole('button');
        fireEvent.click(menuButton);

        const overlay = document.querySelector('.bg-black.bg-opacity-50');
        if (overlay) {
            fireEvent.click(overlay);
        }

        expect(document.querySelector('.bg-black.bg-opacity-50')).not.toBeInTheDocument();
    });

    it('highlights active navigation item', () => {
        renderWithRouter(
            <Layout>
                <div>Test Content</div>
            </Layout>
        );
        const addAccountLink = screen.getByText('Add Account').closest('a');
        expect(addAccountLink).toHaveClass('bg-gray-100');
    });
});