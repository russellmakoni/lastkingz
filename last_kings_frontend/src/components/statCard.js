
import React from 'react';

const StatCard = ({ title, value, icon }) => (
    <div className="backdrop-filter backdrop-blur-lg bg-opacity-30 p-5 rounded-xl shadow-lg flex items-center transition-transform transform hover:-translate-y-1">
        <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full mr-4">
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-100 font-medium">{title}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

export default StatCard;