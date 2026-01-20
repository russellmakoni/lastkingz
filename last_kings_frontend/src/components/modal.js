import React from 'react';

const Modal = ({ children, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 animate-fade-in ">
        <div className="backdrop-filter backdrop-blur-lg bg-opacity-10 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-md relative animate-fade-in-up">
            <button onClick={onClose} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors">
                
            </button>
            {children}
        </div>
    </div>
);

export default Modal;

