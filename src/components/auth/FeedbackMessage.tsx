'use client';

import React from 'react';

interface FeedbackMessageProps {
  type: 'error' | 'success' | 'warning';
  message: string | null;
}

export const FeedbackMessage: React.FC<FeedbackMessageProps> = ({
  type,
  message,
}) => {
  if (!message) return null;

  const alertClass =
    type === 'error'
      ? 'alert-error'
      : type === 'success'
        ? 'alert-success'
        : 'alert-warning';

  return (
    <div className={`alert-box ${alertClass}`} role="alert">
      <span>{message}</span>
    </div>
  );
};
