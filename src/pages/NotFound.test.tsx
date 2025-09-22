import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NotFound from './NotFound';

describe('NotFound Component', () => {
  it('renders the "Page not found" message', () => {
    render(<NotFound />);
    
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });
});