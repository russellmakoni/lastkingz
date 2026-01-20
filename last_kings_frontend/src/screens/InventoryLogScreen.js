import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { debounce } from 'lodash'; // For search input

const InventoryLogScreen = () => {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10; // Number of logs per page

    const [searchTerm, setSearchTerm] = useState(''); // Search by item name or username
    const [selectedActionType, setSelectedActionType] = useState(''); // Filter by action type
    const [startDate, setStartDate] = useState(''); // Filter by date range
    const [endDate, setEndDate] = useState(''); // Filter by date range

    // Define all possible action types for the filter dropdown
    const actionTypes = ['All', 'ITEM_CREATED', 'ITEM_UPDATED', 'ITEM_DELETED', 'SALE_RECORDED'];

    const fetchLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/inventorylogs', {
                params: {
                    page: currentPage - 1,
                    size: itemsPerPage,
                    search: searchTerm,
                    actionType: selectedActionType === 'All' ? '' : selectedActionType,
                    startDate: startDate ? `${startDate}T00:00:00` : '', // Convert date to LocalDateTime format
                    endDate: endDate ? `${endDate}T23:59:59` : '',     // Convert date to LocalDateTime format
                }
            });
            setLogs(response.data.content);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error("Failed to fetch inventory logs:", err);
            setError("Failed to load inventory logs. Please try again.");
            setLogs([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, itemsPerPage, searchTerm, selectedActionType, startDate, endDate]);

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    const debouncedSearch = useCallback(
        debounce((nextValue) => {
            setSearchTerm(nextValue);
            setCurrentPage(1);
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const handleActionTypeChange = (e) => {
        setSelectedActionType(e.target.value);
        setCurrentPage(1);
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        setCurrentPage(1);
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return 'N/A';
        const date = new Date(dateTimeString);
        return date.toLocaleString(); // Formats to local date and time string
    };

    if (loading) {
        return <div className="text-center p-10 text-gray-500">Loading inventory logs...</div>;
    }

    if (error) {
        return <div className="text-center p-10 text-red-500">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6 backdrop-filter backdrop-blur-lg bg-opacity-30 rounded-xl shadow-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Activity Log</h1>

            {/* Filters and Search */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    placeholder="Search by item/user..."
                    onChange={handleSearchChange}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                />
                <select
                    onChange={handleActionTypeChange}
                    value={selectedActionType}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                >
                    {actionTypes.map(type => (
                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                    ))}
                </select>
                <input
                    type="date"
                    placeholder="Start Date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                />
            </div>

            {logs.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No activity logs found.</p>
            ) : (
                <div className="overflow-x-auto bg-gray-50 rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action Type</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log) => (
                                <tr key={log.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(log.timestamp)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.actionType.replace(/_/g, ' ')}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.itemName || 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{log.username || 'System'}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs overflow-hidden text-ellipsis">{log.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    {[...Array(totalPages).keys()].map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page + 1)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                currentPage === page + 1
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            {page + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default InventoryLogScreen;
