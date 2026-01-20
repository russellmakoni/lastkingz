import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardScreen from '../screens/dashboard';
import InventoryScreen from '../screens/inventory';
import InventoryLogScreen from './InventoryLogScreen';
import UsersScreen from './Uusers';
import SalesLog from './SalesLog';
import ItemsLog from './itemLogs';



const MainLayout = () => {
    const [currentView, setView] = useState('inventory');
    const { user, signOut, isAdmin } = useAuth();
    // Renamed for better readability: isSidebaopen -> isSidebarOpen
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Function to toggle the sidebar's visibility
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Function to explicitly close the sidebar (used by overlay and internal close button)
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Function to navigate between views and close the sidebar
    const navigate = (view) => {
        setView(view);
        setIsSidebarOpen(false); // Close sidebar when a navigation item is clicked
    };

    // Helper function to render the current screen based on currentView state
    const renderScreen = () => {
        switch (currentView) {
            case 'inventory':
                return <InventoryScreen />;
            case 'dashboard':
                return <DashboardScreen />;
            case 'SalesLog': // NEW
                return <SalesLog />;
                case 'itemsLogs': // NEW
                return <ItemsLog />;
            case 'inventory-log':
                return <InventoryLogScreen />;
            case 'users': // Added for the 'Users' link if isAdmin
                // You'll need to create a UsersScreen component if you don't have one
                return<UsersScreen />;
            default:
                return <DashboardScreen />; // Default view
        }
    };

    return (
        <div className="min-h-screen flex flex-col font-sans">
            {/* Header / Top Navigation Bar */}
            <header className="shadow-md sticky top-0 z-30 backdrop-filter backdrop-blur-lg bg-opacity-30">
                <nav className="container mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Menu Toggle Button (using your original SVG) */}
                    <button
                        onClick={toggleSidebar}
                        className='p-2 rounded-md hover:bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-200 ease-in-out'
                        aria-label='Toggle sidebar'
                    >
                        {/* Your original SVG for the hamburger icon */}
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            ></path>
                        </svg>
                    </button>

                    {/* App Brand Name */}
                    <div className="text-2xl font-bold text-white brand-glow">Last Kingz Liquors</div>

                    {/* User Info and Sign Out Button in Header */}
                    <div className="flex items-center">
                    
                        <span className="text-white mr-4 hidden sm:inline"> {/* Hide on very small screens */}
                            Welcome, <span className="font-bold ">{user.username}</span>
                            {isAdmin() && <span className="ml-2 text-xs bg-blue-600 text-white font-bold py-1 px-2 rounded-full align-middle">ADMIN</span>}
                        </span>
                        <button onClick={signOut} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold text-sm transition-colors flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" /></svg>
                            <span className="hidden sm:inline">Sign Out</span> {/* Hide text on very small screens */}
                        </button>
                    </div>
                </nav>
            </header>

            {isSidebarOpen && (
                <div
                    className='fixed inset-0 z-40 bg-black bg-opacity-50'
                    onClick={closeSidebar} // Use closeSidebar explicitly
                    aria-hidden="true"
                ></div>
            )}

            {/* Sidebar Content */}
            <aside
                className={`fixed inset-y-0 left-0  w-72 p-4 shadow-xl z-50 transform flex flex-col
                backdrop-filter backdrop-blur-lg bg-opacity-30 text-white
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                transition-transform duration-300 ease-in-out`}
                aria-label="Main Sidebar"
            >
                {/* Sidebar Header with User Info and Close Button */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center">
                        <span className="font-bold text-lg text-blue-300">{user.username}</span>
                        {isAdmin() && <span className="ml-2 text-xs bg-indigo-700 text-white font-bold py-1 px-2 rounded-full align-middle">ADMIN</span>}
                    </div>
                    {/* Close button inside sidebar (using a simple 'X' SVG) */}
                    <button
                        onClick={closeSidebar}
                        className="p-1 rounded-full text-gray-300 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
                        aria-label="Close Sidebar"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            ></path>
                        </svg>
                    </button>
                </div>

                {/* Sidebar Navigation Links */}
                <div className="flex-1 overflow-y-auto"> {/* Use flex-1 to make this section scrollable */}
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a
                                href="#"
                                onClick={() => navigate('dashboard')}
                                className={`flex items-center p-2 rounded-lg hover:bg-gray-500 group transition duration-200 ease-in-out
                                ${currentView === 'dashboard' ? 'bg-gray-700 font-semibold text-white' : 'text-gray-300'}`}
                            >
                                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 21">
                                    <path d="M16.975 11H10V4.025a1 1 0 0 0-1.066-.998 8.5 8.5 0 1 0 9.039 9.039.999.999 0 0 0-1-1.066h.002Z" />
                                    <path d="M12.5 0c-.157 0-.311.01-.565.027A1 1 0 0 0 11 1.02V10h8.975a1 1 0 0 0 1-.935c.013-.188.028-.374.028-.565A8.51 8.51 0 0 0 12.5 0Z" />
                                </svg>
                                <span className="ms-3">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a
                                href="#"
                                onClick={() => navigate('inventory')}
                                className={`flex items-center p-2 rounded-lg hover:bg-gray-700 group transition duration-200 ease-in-out
                                ${currentView === 'inventory' ? 'bg-gray-700 font-semibold text-white' : 'text-gray-300'}`}
                            >
                                <svg className="shrink-0 w-5 h-5 text-gray-400 group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 18 18">
                                    <path d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Inventory</span>
                            </a>
                        </li>
                       
                         {isAdmin() && (<>
                        <li>
                            <a
                                href="#"
                                onClick={() => navigate('SalesLog')}
                                className={`flex items-center p-2 rounded-lg hover:bg-gray-500 group transition duration-200 ease-in-out
                                ${currentView === 'SalesLog' ? 'bg-gray-700 font-semibold text-white' : 'text-gray-300'}`}
                            >
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                    <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sales Logs</span>
                            </a>
                        </li>
                         <li>
                            <a
                                href="#"
                                onClick={() => navigate('itemsLogs')}
                                className={`flex items-center p-2 rounded-lg hover:bg-gray-500 group transition duration-200 ease-in-out
                                ${currentView === 'itemsLogs' ? 'bg-gray-700 font-semibold text-white' : 'text-gray-300'}`}
                            >
                                <svg className="w-6 h-6 text-gray-400 group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 20">
                                    <path d="M16 14V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 0 0 0-2h-1v-2a2 2 0 0 0 2-2ZM4 2h2v12H4V2Zm8 16H3a1 1 0 0 1 0-2h9v2Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Inventory Logs</span>
                            </a>
                        </li>
                       
                            <li>
                                <a href="#"
                                    onClick={() => navigate('users')} // Assuming 'users' view
                                    className={`flex items-center p-2 rounded-lg hover:bg-gray-500 group transition duration-200 ease-in-out
                                    ${currentView === 'users' ? 'bg-gray-700 font-semibold text-white' : 'text-gray-300'}`}
                                >
                                    <svg className="shrink-0 w-5 h-5 text-gray-400 group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                                </a>
                            </li>
                            </>
                        )}
                        <li>
                            <a
                                href="#"
                                onClick={() => { signOut(); closeSidebar(); }} // Call both signOut and closeSidebar
                                className="flex items-center p-2 rounded-lg hover:bg-gray-500 group transition duration-200 ease-in-out text-gray-300"
                            >
                                <svg className="shrink-0 w-5 h-5 text-gray-400 group-hover:text-white transition duration-75" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.96 2.96 0 0 0 .13 5H5Z" />
                                    <path d="M6.737 11.061a2.961 2.961 0 0 1 .81-1.515l6.117-6.116A4.839 4.839 0 0 1 16 2.141V2a1.97 1.97 0 0 0-1.933-2H7v5a2 2 0 0 1-2 2H0v11a1.969 1.969 0 0 0 1.933 2h12.134A1.97 1.97 0 0 0 16 18v-3.093l-1.546 1.546c-.413.413-.94.695-1.513.81l-3.4.679a2.947 2.947 0 0 1-1.85-.227 2.96 2.96 0 0 1-1.635-3.257l.681-3.397Z" />
                                    <path d="M8.961 16a.93.93 0 0 0 .189-.019l3.4-.679a.961.961 0 0 0 .49-.263l6.118-6.117a2.884 2.884 0 0 0-4.079-4.078l-6.117 6.117a.96.96 0 0 0-.263.491l-.679 3.4A.961.961 0 0 0 8.961 16Zm7.477-9.8a.958.958 0 0 1 .68-.281.961.961 0 0 1 .682 1.644l-.315.315-1.36-1.36.313-.318Zm-5.911 5.911 4.236-4.236 1.359 1.359-4.236 4.237-1.7.339.341-1.699Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Sign Out</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="container mx-auto p-6 flex-1 ">
                <h1 className="text-4xl font-bold text-gray-100 mb-8 capitalize">{currentView}</h1>
                {renderScreen()}
            </main>
        </div>
    );
};

export default MainLayout;
