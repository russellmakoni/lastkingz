import {useEffect,useState,useCallback} from "react";
import { useAuth } from '../context/AuthContext';
import UserEditModal from "../components/UserEditModal";
import UserDeleteConfirmModal from "../components/deleteModal";
import api from "../api/api";

const UsersScreen =()=> {
 const { isAdmin } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [feedbackMessage, setFeedbackMessage] = useState(null);

    const fetchUsers = useCallback(async () => {
        if(!isAdmin){
            setError("you dont have permission to view this page");
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/users');
            setUsers(response.data);
        } catch (err) {
            console.error("Error fetching users:", err);
            setError(err.message);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    },[isAdmin]);

    useEffect(() => {
       
            fetchUsers();
    }, [fetchUsers]);

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user) => {
        setSelectedUser(user);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateUser = async (updatedUserData) => {
        setLoading(true);
        setError(null);
        setFeedbackMessage(null);
        try {
            const response = await api.put(`/users/${selectedUser.id}`,updatedUserData);

            await fetchUsers();
            setFeedbackMessage('User updated successfully!');
            setIsEditModalOpen(false);
            setSelectedUser(response.data);
        } catch (err) {
            console.error("Error updating user:", err);
            setError(err.message);
            setFeedbackMessage('Error updating user: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDeleteUser = async () => {
        setLoading(true);
        setError(null);
        setFeedbackMessage(null);
        try {
            const response = await api.delete(`/users/${selectedUser.id}`);

            

            await fetchUsers();
            setFeedbackMessage('User deleted successfully!');
            setIsDeleteModalOpen(false);
            setSelectedUser(response.data);
        } catch (err) {
            console.error("Error deleting user:", err);
            setError(err.message);
            setFeedbackMessage('Error deleting user: ' + err.message);
        } finally {
            setLoading(false);
        }
    };
     if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-700">Loading users...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }



return (  
<div className="p-6 backdrop-blur-lg bg-opacity-30 rounded-lg shadow-xl text-white">
            

            {feedbackMessage && (
                <div className={`mb-4 p-3 rounded-md ${feedbackMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                    {feedbackMessage}
                </div>
            )}

            {users.length === 0 ? (
                <p className="text-gray-100">No users found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full  border-gray-200 rounded-lg">
                        <thead className="">
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider ">ID</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider ">Username</th>
                               
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-100 uppercase tracking-wider ">Roles</th>
                                {isAdmin() && (
                                    <th className="py-3 px-4 text-center text-sm font-semibold text-gray-100 uppercase tracking-wider ">Actions</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-500  last:border-b-0">
                                    <td className="py-3 px-4 text-sm text-gray-100">{user.id}</td>
                                    <td className="py-3 px-4 text-sm text-gray-100">{user.username}</td>
                             
                                    <td className="py-3 px-4 text-sm text-gray-100">
                                        {user.roles && user.roles.length > 0 ? (
                                            user.roles.map((role, index) => (
                                                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
                                                    {role.replace('ROLE_', '')}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-gray-500">No roles</span>
                                        )}
                                    </td>
                                    {isAdmin() && (
                                        <td className="py-3 px-4 text-center text-sm">
                                            <button
                                                onClick={() => handleEditClick(user)}
                                                className="text-blue-600 hover:text-blue-800 mr-3 transition-colors duration-200"
                                                title="Edit User"
                                            >
                                                {/* Edit Icon (Pencil) */}
                                                <svg className="h-5 w-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                </svg>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(user)}
                                                className="text-red-600 hover:text-red-800 transition-colors duration-200"
                                                title="Delete User"
                                            >
                                                {/* Delete Icon (Trash) */}
                                                <svg className="h-5 w-5 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                </svg>
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* User Edit Modal */}
            {isEditModalOpen && selectedUser && (
                <UserEditModal
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    user={selectedUser}
                    onSave={handleUpdateUser}
                    allPossibleRoles={['ROLE_USER', 'ROLE_MODERATOR', 'ROLE_ADMIN']}
                />
            )}

            {/* User Delete Confirmation Modal */}
            {isDeleteModalOpen && selectedUser && (
                <UserDeleteConfirmModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    user={selectedUser}
                    onConfirmDelete={handleConfirmDeleteUser}
                />
            )}
        </div>


    );
}

export default UsersScreen;