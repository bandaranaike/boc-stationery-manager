// src/components/SuccessTick.tsx

import React from 'react';

const SuccessTick: React.FC = () => {
    return (
        <div className="flex items-center justify-center">
            <div className="relative w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                    className="absolute w-7 h-7 text-white opacity-0 transform scale-50 animate-ping-once"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <svg
                    className="absolute w-6 h-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        </div>
    );
};

export default SuccessTick;
