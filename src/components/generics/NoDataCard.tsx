import React from 'react';

const NoDataCard: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white shadow-md rounded-lg p-6 min-w-[275px] text-gray-500 text-center">
        <h2 className="text-xl font-semibold">
          {message}
        </h2>
      </div>
    </div>
  );
};

export default NoDataCard;