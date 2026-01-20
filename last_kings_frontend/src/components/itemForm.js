import React, { useState } from 'react';

const ItemForm = ({ item, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        itemName: '', itemBarcode: '', itemDescription: '',itemCategory: '',  itemPrice: '', itemQuantity: '', ...item
    });

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handleSubmit = (e) => { e.preventDefault();
         onSave(formData); };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray backdrop-filter backdrop-blur-lg bg-opacity-30">
            <h2 className="text-2xl font-bold text-white mb-6">{item ? 'Edit Item' : 'Add New Item'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="itemName" value={formData.itemName} onChange={handleChange} placeholder="Name" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500" required />
                <input name="itemBarcode" value={formData.itemBarcode} onChange={handleChange} placeholder="barcode" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500" />
                <input name="itemDescription" value={formData.itemDescription} onChange={handleChange} placeholder=" Description (e.g., brand, )" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500" />
                 <input name="itemCategory" value={formData.itemCategory} onChange={handleChange} placeholder=" Category(e.g.,drink,snack )" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500" />
                <input name="itemPrice" type="number" step="0.01" value={formData.itemPrice} onChange={handleChange} placeholder="Price" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500" required />
                <input name="itemQuantity" type="number" value={formData.itemQuantity} onChange={handleChange} placeholder="Quantity" className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-indigo-500" required />
            
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onCancel} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 font-semibold transition-colors">Cancel</button>
                <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-semibold transition-colors shadow-md">Save Item</button>
            </div>
        </form>
    );
};

export default ItemForm;