import React from 'react';

const Loader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-row gap-2">
                <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.7s]"></div>
                <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.3s]"></div>
                <div className="w-4 h-4 rounded-full bg-primary animate-bounce [animation-delay:.7s]"></div>
            </div>
        </div>
    );
};

export default Loader;
