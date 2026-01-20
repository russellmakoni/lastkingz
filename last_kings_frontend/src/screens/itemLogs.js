import React,{ useState,useCallback,useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { debounce } from 'lodash';



const ItemsLog=()=> {

     const {isAdmin } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
      
        const itemsPerPage = 10; 
    
        const [searchTerm, setSearchTerm] = useState(''); 
        

    const fetchItemAuditLogs = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get('/logs/items'); 
            setLogs(response.data);
        } catch (err) {
            console.error("Error fetching item audit logs:", err);
            if (err.response) {
                if (err.response.status === 403) {
                    setError('Access Denied: You do not have permission to view item audit logs.');
                } else {
                    setError(err.response.data.message || `Failed to fetch item audit logs: ${err.response.status}`);
                }
            } else {
                setError(err.message || 'Failed to fetch item audit logs due to a network error.');
            }
        } finally {
            setLoading(false);
        }
    },[]);

useEffect(() => {

          
                fetchItemAuditLogs();
         
        
    }, [fetchItemAuditLogs]);

    const filtereddata = logs.filter(log =>{
        const name = log.username.toLowerCase();
        const event = log.eventType.toLowerCase();
       return name.includes(searchTerm)||event.includes(searchTerm);
    });


    const indexofLastTerm =currentPage* itemsPerPage;
    const indexofFirstTerm = indexofLastTerm - itemsPerPage;
    const currentItems = filtereddata.slice(indexofFirstTerm,indexofLastTerm);
    const totalPages = Math.ceil(filtereddata.length/itemsPerPage);

    const debouncedSearch = useCallback(
        debounce((nextValue) => {
            setSearchTerm(nextValue); 
            setCurrentPage(1); 
        }, 50),
        [] 
    );

    const handleSeaarch = (e)=> {
       debouncedSearch(e.target.value);
    
    }

     const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page state, which triggers fetchItems
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[200px]">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="ml-4 text-gray-700">Loading item audit logs...</p>
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
        <div className="p-6 backdrop-filter backdrop-blur-lg bg-opacity-30 rounded-lg shadow-xl">
           <div className='space-y-3'>
          <div className='w-full md:w-1/3 '>
             <input
            type='text'
            placeholder='search by user or event type(created,..)'
            onChange={handleSeaarch}
            value={searchTerm}
            className='p-4 border border-gray-100 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"  backdrop-filter backdrop-blur-lg bg-opacity-30'
                    />
        </div>
            {logs.length === 0 ? (
                <p className="text-gray-100">No items audit logs found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border  rounded-lg">
                        <thead >
                            <tr>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider border-b">Timestamp</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider border-b">Event Type</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider border-b">User</th>
                                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-200 uppercase tracking-wider border-b">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-600 border-b last:border-b-0">
                                    <td className="py-3 px-4 text-sm text-gray-200">{new Date(log.timestamp).toLocaleString()}</td>
                                    <td className="py-3 px-4 text-sm ">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold
                                            ${log.eventType === 'Item_Created' ? 'bg-green-100 text-green-800' : ''}
                                            ${log.eventType === 'ItemUpdated'||'Item_Updated' ? 'bg-blue-100 text-blue-800' : ''}
                                            ${log.eventType === 'Item_Deleted' ? 'bg-red-100 text-red-800' : ''}
                                        `}>
                                            {log.eventType}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-sm text-gray-200">{log.username || 'N/A'} (ID: {log.userId || 'N/A'})</td>
                                    <td className="py-3 px-4 text-sm text-gray-200">{log.eventDetails}</td>
                                </tr>
                            ))}
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
}

export default ItemsLog;