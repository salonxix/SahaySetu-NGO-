import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { FeedbackMessage } from '@/components/auth/FeedbackMessage';
import { AuthCard } from '@/components/auth/AuthCard';

describe('Auth UI Components', () => {
  describe('FeedbackMessage', () => {
    it('renders error alert correctly', () => {
      render(<FeedbackMessage type="error" message="Invalid email" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid email');
    });

    it('renders success alert correctly', () => {
      render(<FeedbackMessage type="success" message="Registration successful" />);
      expect(screen.getByRole('alert')).toHaveTextContent('Registration successful');
    });

    it('renders nothing when message is null', () => {
      const { container } = render(<FeedbackMessage type="error" message={null} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('PasswordInput', () => {
    it('toggles password visibility between text and password', () => {
      const handleChange = vi.fn();
      render(
        <PasswordInput
          id="test-password"
          name="password"
          value="MyPass123"
          onChange={handleChange}
        />
      );

      const input = screen.getByLabelText(/^Password \*/i) as HTMLInputElement;
      expect(input.type).toBe('password');

      const toggleButton = screen.getByRole('button', { name: /Show password/i });
      fireEvent.click(toggleButton);

      expect(input.type).toBe('text');
      expect(screen.getByRole('button', { name: /Hide password/i })).toBeInTheDocument();
    });

    it('renders strength indicator when showStrength is enabled', () => {
      const handleChange = vi.fn();
      render(
        <PasswordInput
          id="test-password"
          name="password"
          value="StrongPass123!"
          onChange={handleChange}
          showStrength
        />
      );

      expect(screen.getByText(/Strength:/i)).toBeInTheDocument();
    });
  });

  describe('AuthCard', () => {
    it('switches roles when tab is clicked', () => {
      const handleRoleChange = vi.fn();
      render(
        <AuthCard
          title="Sign In"
          subtitle="Test Subtitle"
          role="user"
          mode="login"
          onRoleChange={handleRoleChange}
        >
          <div>Form Content</div>
        </AuthCard>
      );

      const ngoTab = screen.getByRole('tab', { name: /NGO Organization/i });
      fireEvent.click(ngoTab);

      expect(handleRoleChange).toHaveBeenCalledWith('ngo');
    });
  });
});
