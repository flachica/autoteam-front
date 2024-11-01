import React from 'react';
import './LoadingSpinner.css';

interface LoadingSpinnerProps {
  message: string | undefined;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="spinner"></div>
      <p className="ml-4 text-black">{message}</p>
    </div>
  );
};

export default LoadingSpinner;