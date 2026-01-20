import React from 'react';

const UserDeleteConfirmModal = ({ isOpen, onClose, user, onConfirmDelete }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-white backdrop-filter backdrop-blur-lg bg-opacity-80 rounded   flex items-center justify-center z-50 p-4">
            <div className=" rounded-lg shadow-xl w-full max-w-sm p-6 relative  ">
                <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h3>
                <p className="text-gray-700 mb-6 text-center">
                    Are you sure you want to delete user "<span className="font-semibold">{user.username}</span>"?
                    This action cannot be undone.
                </p>

                <div className="flex justify-center space-x-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmDelete}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserDeleteConfirmModal;