import React, { useState, useEffect } from 'react';

const UserEditModal = ({ isOpen, onClose, user, onSave, allPossibleRoles }) => {
    const [email, setEmail] = useState('');
    const [selectedRoles, setSelectedRoles] = useState(new Set());
    const [formError, setFormError] = useState(null);

    useEffect(() => {
        if (user) {
            setEmail(user.username || '');
            setSelectedRoles(new Set(user.roles || []));
            setFormError(null);
        }
    }, [user]);

    if (!isOpen) return null;

    const handleRoleChange = (role) => {
        const newSelectedRoles = new Set(selectedRoles);
        if (newSelectedRoles.has(role)) {
            newSelectedRoles.delete(role);
        } else {
            newSelectedRoles.add(role);
        }
        setSelectedRoles(newSelectedRoles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError(null);

        if (!email.trim()) {
            setFormError('Email cannot be empty.');
            return;
        }
       // if (!/\S+@\S+\.\S+/.test(email)) {
          //  setFormError('Invalid email format.');
         //   return;
       // }
        if (selectedRoles.size === 0) {
            setFormError('A user must have at least one role.');
            return;
        }

        onSave({ email, roles: Array.from(selectedRoles) });
    };

    return (
        <div className=" rounded fixed inset-0  bg-opacity-70 flex items-center justify-center z-50 p-4">
            <div className=" bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                <h3 className="text-2xl font-bold text-gray-700 mb-6 text-center">Edit User: {user.username}</h3>

                {formError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <strong className="font-bold">Validation Error!</strong>
                        <span className="block sm:inline"> {formError}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                            Username:
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">
                            Roles:
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {allPossibleRoles.map((role) => (
                                <label key={role} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        className="form-checkbox h-5 w-5 text-blue-600 rounded"
                                        checked={selectedRoles.has(role)}
                                        onChange={() => handleRoleChange(role)}
                                    />
                                    <span className="ml-2 text-gray-700">{role.replace('ROLE_', '')}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-200 ease-in-out"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;