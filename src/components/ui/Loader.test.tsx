import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader Component', () => {
    it('does not render when isVisible is false', () => {
        render(<Loader isVisible={false} />);

        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    it('renders with default message when isVisible is true', () => {
        render(<Loader isVisible={true} />);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders with custom message', () => {
        render(<Loader isVisible={true} message="Creating account..." />);

        expect(screen.getByText('Creating account...')).toBeInTheDocument();
        expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });


});