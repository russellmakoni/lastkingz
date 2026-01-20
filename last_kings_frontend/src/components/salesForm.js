import React, { useState } from 'react';

const SaleForm = ({ item, onSale, onCancel }) => {
    const [itemQuantity, setQuantity] = useState(1);
    const handleSubmit = (e) => { e.preventDefault(); onSale(item.itemID, itemQuantity); };
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-100 mb-2">Record Sale</h2>
            <p className="text-lg text-gray-100 mb-4">Item: <span className="font-semibold">{item.itemName}</span></p>
            <p className="text-sm text-gray-200">Available Quantity: {item.itemQuantity}</p>
            <input type="number" value={itemQuantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10))} min="1" max={item.itemQuantity} className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-green-500" required />
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-500 font-semibold transition-colors">Cancel</button>
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-semibold transition-colors shadow-md">Record Sale</button>
            </div>
        </form>
    );
};

export default SaleForm;
