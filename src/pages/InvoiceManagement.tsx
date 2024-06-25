import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BranchSelector from '../components/BranchSelector';
import ItemTable from '../components/ItemTable';
import AddItemForm from '../components/AddItemForm';
import { DropdownOption, Item, Stock } from "@/types";
import { format } from "@/utils/utills";

const InvoiceManagement: React.FC = () => {
    const [items, setItems] = useState<DropdownOption[]>([]);
    const [availableItems, setAvailableItems] = useState<DropdownOption[]>([]);
    const [branch, setBranch] = useState<DropdownOption | null>(null);
    const [branches, setBranches] = useState<DropdownOption[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [addedStocks, setAddedStocks] = useState<{ [itemId: number]: Stock[] }>({});

    useEffect(() => {
        fetch('/api/branches')
            .then((response) => response.json())
            .then((data) => {
                const branchOptions = data.map((branch: any) => ({
                    value: branch.code,
                    name: branch.name,
                    label: `${branch.code} - ${branch.name}`,
                }));
                setBranches(branchOptions);
            });
        fetchItems('');
    }, []);

    const fetchItems = async (inputValue: string) => {
        const response = await axios.get(`/api/itemsSearch?text=${inputValue}&availability=1`);
        const fetchedItems = response.data.map((item: any) => ({
            label: `${item.code} - ${item.name}`,
            value: item.id,
            id: item.id,
            code: item.code,
            name: item.name
        }));
        setAvailableItems(fetchedItems);
    };

    const addItem = (item: DropdownOption, quantity: number, stocks: Stock[]) => {
        const newItems = stocks.map((stock) => ({
            ...item,
            quantity: stock.stock,
            total_value: stock.unit_price * stock.stock,
            stocks: [stock],
        }));

        setAddedStocks(prev => {
            const updatedStocks = { ...prev };
            if (!updatedStocks[item.id]) {
                updatedStocks[item.id] = [];
            }
            stocks.forEach(stock => {
                const existingStock = updatedStocks[item.id].find(s => s.id === stock.id);
                if (existingStock) {
                    existingStock.stock += stock.stock;
                } else {
                    updatedStocks[item.id].push(stock);
                }
            });
            return updatedStocks;
        });

        resetMessages();
        setItems((prevItems) => [...prevItems, ...newItems]);
        setGrandTotal((prevTotal) => prevTotal + newItems.reduce((sum, newItem) => sum + newItem.total_value!, 0));
    };

    const handleRemoveItem = (index: number) => {
        if (index >= 0 && index < items.length) {
            const newItems = [...items];
            const itemToRemove = newItems[index];

            if (itemToRemove) {
                setGrandTotal((prevTotal) => prevTotal - itemToRemove.total_value!);
                newItems.splice(index, 1);
                setItems(newItems);

                // Update addedStocks
                if (itemToRemove.stocks) {
                    setAddedStocks(prev => {
                        const updatedStocks = { ...prev };

                        // @ts-ignore
                        itemToRemove.stocks.forEach(stock => {
                            const stockIndex = updatedStocks[itemToRemove.id].findIndex(s => s.id === stock.id);
                            if (stockIndex > -1) {
                                updatedStocks[itemToRemove.id][stockIndex].stock += stock.stock;
                                if (updatedStocks[itemToRemove.id][stockIndex].stock <= 0) {
                                    updatedStocks[itemToRemove.id].splice(stockIndex, 1);
                                }
                            }
                        });
                        return updatedStocks;
                    });
                } else {
                    console.error(`Item at index ${index} has undefined stocks.`);
                }
            } else {
                console.error(`Item at index ${index} is undefined.`);
            }
        } else {
            console.error(`Index ${index} is out of bounds for items array.`);
        }
    };

    const handleBranchChange = (selectedOption: DropdownOption | null) => {
        resetMessages();
        setBranch(selectedOption);
    };

    const resetMessages = () => {
        setError(null);
        setMessage(null);
    };

    const handleGeneratePDF = async () => {
        if (!branch) {
            setError('Please add a branch.');
        } else if (!items.length) {
            setError('Please add items to the invoice.');
        } else {
            setError(null);
            try {
                const response = await axios.post('/api/generatePdf', {
                    items, branchName: branch?.name, branchCode: branch?.value
                });
                console.log(response.data.message); // PDF generated successfully
                await axios.post('/api/updateStocks', { items });
                setItems([]);
                setBranch(null);
                setGrandTotal(0);
                setMessage("Successfully PDF file generated");
            } catch (error) {
                console.error('Error generating PDF:', error);
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between">
                <h2 className="text-3xl mb-6">Invoice Management</h2>
                <BranchSelector branches={branches} onChange={handleBranchChange} value={branch} />
            </div>
            <ItemTable items={items} onRemove={handleRemoveItem} />
            <AddItemForm
                availableItems={availableItems}
                onAdd={addItem}
                fetchItems={fetchItems}
                addedStocks={addedStocks}
            />
            <div className="text-right my-4">
                <strong>Grand Total: {format(grandTotal)}</strong>
            </div>
            <button onClick={handleGeneratePDF} className="bg-green-700 text-white py-2 px-4 rounded">
                Save and Generate PDF
            </button>
            {error && <p className="text-red-500 py-4">{error}</p>}
            {message && <p className="text-green-500 py-4">{message}</p>}
        </div>
    );
};

export default InvoiceManagement;
