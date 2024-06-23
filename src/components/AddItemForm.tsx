import React, { useState, useEffect } from 'react';
import SearchableDropdown from '@/components/SearchableDropdown';
import axios from 'axios';
import { DropdownOption, Item, Stock } from '@/types';

interface AddItemFormProps {
    availableItems: DropdownOption[];
    onAdd: (item: Item, quantity: number, stocks: Stock[]) => void;
    fetchItems: (inputValue: string) => void;
}

const AddItemForm: React.FC<AddItemFormProps> = ({ availableItems, onAdd, fetchItems }) => {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [quantity, setQuantity] = useState<number>(1);
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (selectedItem) {
            fetchStocks(selectedItem.id);
        }
    }, [selectedItem]);

    const fetchStocks = async (itemId: number) => {
        try {
            const response = await axios.get(`/api/stocks?itemId=${itemId}`);
            setStocks(response.data.sort((a: Stock, b: Stock) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        } catch (error) {
            console.error('Error fetching stocks:', error);
        }
    };

    const handleAddItem = () => {
        if (!selectedItem) {
            setError("Please select an item");
        } else {
            let remainingQuantity = quantity;
            let selectedStocks: Stock[] = [];

            for (let stock of stocks) {
                if (remainingQuantity <= 0) break;

                if (stock.stock >= remainingQuantity) {
                    selectedStocks.push({ ...stock, stock: remainingQuantity });
                    stock.stock -= remainingQuantity;  // Update the stock
                    remainingQuantity = 0;
                } else {
                    selectedStocks.push({ ...stock });
                    remainingQuantity -= stock.stock;
                    stock.stock = 0;  // All stock used
                }
            }

            if (remainingQuantity > 0) {
                setError('Insufficient stock available.');
                return;
            }

            if (selectedItem && quantity > 0) {
                onAdd(selectedItem, quantity, selectedStocks);
                setSelectedItem(null);
                setQuantity(1);
                setError(null);
                setStocks([]);
            } else if (quantity === 0) {
                setError('Please add a quantity.');
            }
        }
    };

    const handleSearch = (inputValue: string) => {
        fetchItems(inputValue);
    };

    return (
        <div>
            <div className="flex mb-4 mt-6" id="addingItemToInvoice">
                <div className="mr-2 min-w-96">
                    <SearchableDropdown
                        options={availableItems}
                        onChangeHandler={(selected) => {
                            const item = availableItems.find(item => item.value === selected?.value);
                            setSelectedItem(item ? { id: item.value, code: item.code!, name: item.name! } : null);
                        }}
                        onInputChangeHandler={handleSearch}
                        value={selectedItem ? {
                            value: selectedItem.id,
                            label: `${selectedItem.code} - ${selectedItem.name}`
                        } : null}
                    />
                </div>
                <div className="mr-2">
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        placeholder="Quantity"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    />
                </div>
                <div>
                    <button
                        onClick={handleAddItem}
                        className="w-full text-white bg-blue-800 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded px-5 py-2.5 text-center dark:bg-blue-700 dark:hover:bg-blue-800 dark:focus:ring-blue-800"
                    >
                        Add Item
                    </button>
                </div>
            </div>
            {error && <p className="text-red-500">{error}</p>}
            {stocks.length > 0 && (
                <div className="overflow-x-auto shadow-md sm:rounded mt-4">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Stock ID</th>
                            <th scope="col" className="px-6 py-3">Unit Price</th>
                            <th scope="col" className="px-6 py-3">Available Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stocks.map((stock) => (
                            <tr key={stock.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4">{stock.id}</td>
                                <td className="px-6 py-4">{stock.unit_price.toFixed(2)}</td>
                                <td className="px-6 py-4">{stock.stock}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AddItemForm;
