import { useState, useEffect, useCallback } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import Modal from '../components/modal';
import ItemForm from '../components/itemForm';
import SaleForm from '../components/salesForm';
import {debounce} from 'lodash';
//import{} from "../App.css"

const InventoryScreen = () => {
    const { isAdmin } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ type: null, data: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1); // Total number of pages
    const itemsPerPage = 10; 
 // --- Search and Filter States ---
 const Low_Stock_threshHold= 5;
    const [searchTerm, setSearchTerm] = useState(''); // State for the text entered in the search bar
    const [selectedCategory, setSelectedCategory] = useState(''); // State for the selected category filter
    const [categories, setCategories] = useState([]); // List of unique categories fetched from items
    
    const fetchItems = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/items',{
                params: {
                    page: currentPage - 1, // Spring Data JPA uses 0-indexed pages, so subtract 1
                    size: itemsPerPage,
                    search: searchTerm,     // Pass the current search term
                    category: selectedCategory // Pass the selected category
                }
            });
            setItems(response.data.content);
            setTotalPages(response.data.totalPages);
            extractCategories(response.data.content);

        } catch (error) { console.error("Failed to fetch items:", error); alert("Could not load inventory.");
            setItems([]);

         }finally {
             setLoading(false); 
            }
    }, [currentPage, itemsPerPage, searchTerm, selectedCategory]);

    useEffect(() => { fetchItems(); }, [fetchItems]);

    // Function to extract unique categories from a list of items
    const extractCategories = (itemsData) => {
        // Map items to their categories, filter out null/empty categories, get unique values, and add 'All' option
        const uniqueCategories = [...new Set(itemsData.map(item => item.itemCategory).filter(Boolean))];
        setCategories(['All', ...uniqueCategories]);
    };
 const debouncedSearch = useCallback(
        debounce((nextValue) => {
            setSearchTerm(nextValue); // Update the search term state
            setCurrentPage(1); // Reset to the first page for new search results
        }, 500),
        [] // Empty dependency array means this debounced function is created only once
    );

    // Handler for changes in the search input field
    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value); // Call the debounced function
    };

     // Handler for changes in the category filter dropdown
    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value === 'All' ? '' : e.target.value); // Set empty string if 'All' is selected
        setCurrentPage(1); // Reset to the first page when category filter changes
    };


    const handleSaveItem = async (itemData) => {
        try {
            const dataToSave = {itemName:(itemData.itemName),itemBarcode: (itemData.itemBarcode), itemDescription:(itemData.itemDescription), itemCategory: (itemData.itemCategory) , itemPrice: parseFloat(itemData.itemPrice), itemQuantity: parseInt(itemData.itemQuantity) };
            if (modal.type === 'edit') {
                await api.put(`/items/${modal.data.itemID}`, dataToSave);
            } else {
                await api.post('/items', dataToSave);
            }
           
            fetchItems();
            closeModal();
        } catch (error) { console.error("Failed to save item:", error); alert("Error saving item. You may not have permission."); }
    };

    const handleDeleteItem = async (id) => {
        if (window.confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
            try { await api.delete(`/items/${id}`); fetchItems(); } 
            catch (error) { console.error("Failed to delete item:", error); alert("Error deleting item. You may not have permission."); }
        }
    };

    const handleRecordSale = async (itemID, itemQuantity) => {
        try {
            await api.post(`/sales?itemID=${itemID}&itemQuantity=${itemQuantity}`);
            fetchItems();
            closeModal();
        } catch (error) { console.error("Failed to record sale:", error);
             alert(`Failed to record sale: ${error.response?.data?.message || 'Check stock or connection.'}`); }
    };

    const closeModal = () => setModal({ type: null, data: null }); 

    const handlePageChange = (page) => {
        setCurrentPage(page); // Update current page state, which triggers fetchItems
    };



    return (<>
    
        <div className="bg-gray-200 p-6 rounded-xl shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-30 ">
       
            <div className="flex justify-between items-center mb-6 ">
                <h2 className="text-2xl font-bold text-gray-100  ">Inventory Items</h2>
                
                {isAdmin() && (
                    <button onClick={() => setModal({ type: 'add', data: null })} className=" text-white px-5 py-2 rounded-lg hover:bg-gray-800 shadow-md font-semibold transition-all flex items-center space-x-2 backdrop-filter backdrop-blur-lg bg-opacity-60">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                        <span>Add New Item</span>
                    </button>
                )}
            </div>
            <div className=" flex flex-col md:flex-row justify-between items-cnter mb-6 space-y-4 md:space-y-0 md:space-x-4" >
       <div className='w-full md:w-1/3'>
             <input
            type='text'
            placeholder='search by name or barcode'
            onChange={handleSearchChange}
            
            className='p-4 border border-gray-100 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"  backdrop-filter backdrop-blur-lg bg-opacity-30'
                    />
        </div>
            <div className="w-full md:w-1/4">
                    <select
                        onChange={handleCategoryChange}
                        value={selectedCategory === '' ? 'All' : selectedCategory}
                        className="p-3 border border-gray-300 rounded-lg w-full focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

       </div>
            <div className="overflow-x-auto ">
                <table className="w-full text-left  ">
                    <thead>
                        <tr className=" border-b-2  ">
                        <th className="p-4 font-semibold text-gray-900">ID</th>
                             <th className="p-4 font-semibold text-gray-900">Name</th>
                             <th className="p-4 font-semibold text-gray-900">Barcode</th>
                             <th className="p-4 font-semibold text-gray-900">Description</th>
                             <th className="p-4 font-semibold text-gray-900">Category</th> 
                             <th className="p-4 font-semibold text-gray-900">Unit Price</th> 
                             <th className="p-4 font-semibold text-gray-900">Quantity</th>
                             <th className="p-4 font-semibold text-gray-900 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (<tr><td colSpan="5" className="text-center p-10 text-gray-900  ">Loading items...</td></tr>) :
                         items.map(item => (
                            <tr key={item.itemID} className='divide-y divide-x divide-gray-600'>
                            <td className='p-4 text-gray-900'>{item.itemID}</td>
                                <td className="p-4 font-medium text-gray-900">{item.itemName}</td>
                                <td className="p-4 text-gray-900">{item.itemBarcode}</td>
                                <td className="p-4 text-gray-900">{item.itemDescription}</td>
                                <td className="p-4 text-gray-900">{item.itemCategory}</td>
                                <td className="p-4 text-gray-900">${parseFloat(item.itemPrice).toFixed(2)}</td>
                                <td className="p-4 text-gray-900"><span>{item.itemQuantity}</span>{item.itemQuantity<=Low_Stock_threshHold&& 
                                (<span className='inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500 text white blink-text'>Running Low on {item.itemName}!</span>)} </td>
                                <td className=" py-3 px-4 text-center text-sm  ">
                                    {isAdmin() ? (
        // ADMIN View: Button Group (Sell, Edit, Delete)
        <div className="inline-flex rounded-lg border border-gray-500 border-opacity-10 backdrop-blur-sm p-1 space-x-2">
                                           <button onClick={() => setModal({ type: 'sell', data: item })} className="p-1 rounded-md text-green-500 hover:bg-green-100 hover:text-green-700 transition-colors duration-200"
                title="Record Sale"><svg
    className="w-6 h-6" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
>
    <path  strokeLinecap="round"  strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path>
</svg>

</button> 
<button
                onClick={() => setModal({ type: 'edit', data: item })} // Or item
                className="p-1 rounded-md text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                title="Edit User" // Or Edit Item
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
                        {/* Delete Icon Button (for Admin) */}
            <button
                onClick={() => handleDeleteItem(item.itemID)}// Or item
                className="p-1 rounded-md text-red-500 hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                title="Delete User" // Or Delete Item
            >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
                                    </div>
                                    ) : (
<button
            onClick={() => setModal({ type: 'sell', data: item })} // Or item
            className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 flex items-center justify-center mx-auto" // Added mx-auto for centering
            title="Record Sale"
        >
            <svg
                className="w-5 h-5 mr-1" // Added mr-1 for spacing if text is added
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
            </svg>
            <span className="hidden md:inline">Sell</span> {/* Optional: Add text on larger screens */}
        </button>
                                        )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
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
            {modal.type === 'add' && <Modal  onClose={closeModal}><ItemForm onSave={handleSaveItem} onCancel={closeModal} /></Modal>}
            {modal.type === 'edit' && <Modal onClose={closeModal}><ItemForm item={modal.data} onSave={handleSaveItem} onCancel={closeModal} /></Modal>}
            {modal.type === 'sell' && <Modal onClose={closeModal}><SaleForm item={modal.data} onSale={handleRecordSale} onCancel={closeModal} /></Modal>}
        </div>
        </>
    );
};

export default InventoryScreen;