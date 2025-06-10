import React from 'react';

interface SubmitButtonProps {
  loading: boolean;
  disabled: boolean;
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ loading, disabled, children }) => (
  <button type="submit" disabled={disabled}>
    {loading ? 'Loading...' : children}
  </button>
);

export default SubmitButton;
