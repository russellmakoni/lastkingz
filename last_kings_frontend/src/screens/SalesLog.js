import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { debounce } from 'lodash';


const SalesLog = () => {
     const {  isAdmin, isLoading: isAuthLoading } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
   
    const itemsPerPage = 10; // Number of logs per page

    const [searchTerm, setSearchTerm] = useState(''); // Search by item name or username
  

    
    const fetchSalesLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/logs/sales'); // Call specific endpoint
            setLogs(response.data);
        } catch (err) {
            console.error("Error fetching sales logs:", err);
            if (err.response) {
                if (err.response.status === 403) {
                    setError('Access Denied: You do not have permission to view sales audit logs.');
                } else {
                    setError(err.response.data.message || `Failed to fetch sales audit logs: ${err.response.status}`);
                }
            } else {
                setError(err.message || 'Failed to fetch sales audit logs due to a network error.');
            }
        } finally {
            setLoading(false);
        }
    },[]);

     useEffect(() => { fetchSalesLogs(); }, [fetchSalesLogs]);

   const filtereddata = logs.filter(log =>{
        const name = log.username.toLowerCase();
        const event = log.eventDetails.toLowerCase();
       return name.includes(searchTerm)||event.includes(searchTerm);
    });


    const indexofLastTerm =currentPage* itemsPerPage;
    const indexofFirstTerm = indexofLastTerm - itemsPerPage;
    const currentItems = filtereddata.slice(indexofFirstTerm,indexofLastTerm)

    const totalPages = Math.ceil(filtereddata.length/itemsPerPage);
    const debouncedSearch = useCallback(
        debounce((nextValue) => {
            setSearchTerm(nextValue); // Update the search term state
            setCurrentPage(1); // Reset to the first page for new search results
        }, 50),
        [] // Empty dependency array means this debounced function is created only once
    );

    const handleSearch = (e)=> {
       debouncedSearch(e.target.value);
        
    }
const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page state, which triggers fetchItems
    };
    if (error) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    
    
    return (  
<div className="p-6 backdrop-filter backdrop-blur-lg bg-opacity-30 rounded-lg shadow-xl">
            
<div className='space-y-3'>
            <div className='w-full md:w-1/3 '>
             <input
            type='text'
            placeholder='search by user or event type(created,..)'
            onChange={handleSearch}
            value={searchTerm}
            className='p-4 border border-gray-100 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"  backdrop-filter backdrop-blur-lg bg-opacity-30'
                    />
        </div>
            {logs.length === 0 ? (
                <p className="text-gray-100">No sales audit logs found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full  border border-gray-500 rounded-lg">
                        <thead className="backdrop-filter backdrop-blur-lg bg-opacity-30 border-gray-500">
                            <tr>
                             <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider border-b">Timestamp</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider border-b">User</th>
                               
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider border-b">Details</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-300 uppercase tracking-wider border-b">Event</th>
             
                               
                            </tr>
                        </thead>
<tbody>
                            {currentItems.map((log) => {
                                // Parse eventDetails to extract specific sale info if needed,
                                // or rely on the backend to provide more structured data if

                                return (
                                    <tr key={log.id} className="hover:bg-gray-500 border-b border-gray-500  last:border-b-0">
                                        <td className="py-3 px-4 text-sm text-gray-300">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="py-3 px-4 text-sm text-gray-300">{log.username || 'N/A'} [ID: {log.userId || 'N/A'}]</td>
                                        <td className="py-3 px-4 text-sm text-gray-300">{log.eventDetails}</td>
                                        <td className="py-3 px-4 text-sm text-gray-300">{(log.eventType)}</td>
                                        
                                        
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
        {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                    {[...Array(totalPages).keys()].map((page) => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page + 1)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                currentPage === page + 1
                                    ? 'bg-blue-600 text-white'
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

export default SalesLog;