import React, {useState, useEffect} from 'react';
import axios from 'axios';
import BranchSelector from '../components/BranchSelector';
import ItemTable from '../components/ItemTable';
import AddItemForm from '../components/AddItemForm';
import {DropdownOption, Item, Stock} from "@/types";

const InvoiceManagement: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [availableItems, setAvailableItems] = useState<DropdownOption[]>([]);
    const [branch, setBranch] = useState<DropdownOption | null>(null);
    const [branches, setBranches] = useState<DropdownOption[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

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
            code: item.name,
            name: item.name
        }));
        setAvailableItems(fetchedItems);
    };

    const addItem = (item: Item, quantity: number, stocks: Stock[]) => {
        const newItems = stocks.map((stock) => ({
            ...item,
            quantity: stock.stock,
            total_value: stock.unit_price * stock.stock,
            stocks: [stock],
        }));

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
    }

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
                await axios.post('/api/updateStocks', {items});
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
        <div className="p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Invoice Management</h1>
                <BranchSelector branches={branches} onChange={handleBranchChange} value={branch}/>
            </div>
            <ItemTable items={items} onRemove={handleRemoveItem}/>
            <AddItemForm availableItems={availableItems} onAdd={addItem} fetchItems={fetchItems}/>
            <div className="text-right my-4">
                <strong>Grand Total: {grandTotal.toFixed(2)}</strong>
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
