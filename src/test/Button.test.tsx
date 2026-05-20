import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders children correctly', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(
      <Button 
        disabled 
        onClick={handleClick}
      >
        Disabled
      </Button>
    );

    const button = screen.getByText('Disabled').closest('button');
    expect(button).toBeDisabled();
    
    if (button) {
      fireEvent.click(button);
    }
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders loading indicator and disables button when isLoading is true', () => {
    render(<Button isLoading>Submit</Button>);
    const button = screen.getByText('Submit').closest('button');
    expect(button).toBeDisabled();
    expect(button?.querySelector('.animate-spin')).toBeInTheDocument();
  });

  it('renders left and right icons correctly', () => {
    render(
      <Button 
        leftIcon={<span data-testid="left-icon">←</span>}
        rightIcon={<span data-testid="right-icon">→</span>}
      >
        With Icons
      </Button>
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    expect(screen.getByText('With Icons')).toBeInTheDocument();
  });

  it('applies correct variant and intent classes', () => {
    render(
      <Button 
        intent="danger"
        variant="outline"
      >
        Delete
      </Button>
    );

    const button = screen.getByText('Delete').closest('button');
    expect(button).toHaveClass('border-rose-200');
    expect(button).toHaveClass('text-rose-700');
  });

  it('supports custom className styles', () => {
    render(<Button className="custom-class-123">Custom</Button>);
    const button = screen.getByText('Custom').closest('button');
    expect(button).toHaveClass('custom-class-123');
  });
});
