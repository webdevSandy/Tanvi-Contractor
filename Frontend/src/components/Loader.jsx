import React from 'react';

const Loader = () => {
    return (
        <div className="flex items-center justify-center min-h-[200px] w-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#002D5B]"></div>
        </div>
    );
};

export default Loader;
