import React, { useState, useEffect } from 'react';
import SearchableDropdown from '@/components/SearchableDropdown';
import axios from 'axios';
import { DropdownOption, Stock } from '@/types';
import { format } from "@/utils/utills";

interface AddItemFormProps {
    availableItems: DropdownOption[];
    onAdd: (item: DropdownOption, quantity: number, stocks: Stock[]) => void;
    fetchItems: (inputValue: string) => void;
    addedStocks: { [itemId: number]: Stock[] };
}

const AddItemForm: React.FC<AddItemFormProps> = ({ availableItems, onAdd, fetchItems, addedStocks }) => {
    const [selectedItem, setSelectedItem] = useState<DropdownOption | null>(null);
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
            let fetchedStocks: Stock[] = response.data;

            if (addedStocks[itemId]) {
                addedStocks[itemId].forEach((addedStock) => {
                    const index = fetchedStocks.findIndex(stock => stock.id === addedStock.id);
                    if (index > -1) {
                        fetchedStocks[index].stock -= addedStock.stock;
                    }
                });
            }

            setStocks(fetchedStocks.sort((a: Stock, b: Stock) => new Date(a.date).getTime() - new Date(b.date).getTime()));
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

            // Copy stocks to prevent direct modification
            let tempStocks = [...stocks];

            for (let stock of tempStocks) {
                if (remainingQuantity <= 0) break;

                if (stock.stock >= remainingQuantity) {
                    selectedStocks.push({ ...stock, stock: remainingQuantity });
                    remainingQuantity = 0;
                } else {
                    selectedStocks.push({ ...stock });
                    remainingQuantity -= stock.stock;
                }
            }

            if (remainingQuantity > 0) {
                setError('Insufficient stock available.');
                return;
            }

            // Update the actual stocks only if sufficient stock is available
            tempStocks.forEach((stock, index) => {
                if (selectedStocks.some(selectedStock => selectedStock.id === stock.id)) {
                    stocks[index].stock = stock.stock - selectedStocks.find(selectedStock => selectedStock.id === stock.id)!.stock;
                }
            });

            if (selectedItem && quantity > 0) {
                onAdd(selectedItem, quantity, selectedStocks);
                setSelectedItem(null);
                setQuantity(1);
                setError(null);
                setStocks(tempStocks);  // Update stocks state with the modified stock quantities
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
                            const item = availableItems.find(option => option.value === selected?.value);
                            setSelectedItem(item || null); // Handle undefined case by setting to null
                        }}
                        onInputChangeHandler={handleSearch}
                        value={selectedItem ? {
                            id: selectedItem.id,
                            value: selectedItem.value,
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
                        <thead
                            className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Stock ID</th>
                            <th scope="col" className="px-6 py-3">Unit Price</th>
                            <th scope="col" className="px-6 py-3">Available Quantity</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stocks.map((stock) => (
                            <tr key={stock.id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 last:border-none">
                                <td className="px-6 py-4">{stock.id}</td>
                                <td className="px-6 py-4">{format(stock.unit_price)}</td>
                                <td className="px-6 py-4">{format(stock.stock, 0)}</td>
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
