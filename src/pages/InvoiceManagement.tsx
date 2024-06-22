import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import BranchSelector from '../components/BranchSelector';
import ItemTable from '../components/ItemTable';
import AddItemForm from '../components/AddItemForm';

interface Stock {
    id: number;
    item_id: number;
    date: string;
    unit_price: number;
    stock: number;
    initial_stock: number;
}

interface Item {
    id: number;
    code: string;
    name: string;
    quantity: number;
    total_value: number;
    stocks: Stock[];
}

interface Branch {
    code: string;
    accountNumber: string;
}

const InvoiceManagement: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [availableItems, setAvailableItems] = useState<Item[]>([]);
    const [branch, setBranch] = useState<Branch>({ code: '', accountNumber: '' });
    const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);

    useEffect(() => {
        fetch('/api/branches')
            .then((response) => response.json())
            .then((data) => {
                const branchOptions = data.map((branch: any) => ({
                    value: branch.code,
                    label: `${branch.code} - ${branch.name}`,
                }));
                setBranches(branchOptions);
            });
    }, []);

    const fetchItems = async (inputValue: string) => {
        const response = await axios.get(`/api/items-search?text=${inputValue}`);
        const fetchedItems = response.data.map((item: any) => ({
            id: item.id,
            code: item.code,
            name: item.name,
        }));
        setAvailableItems(fetchedItems);
    };

    const addItem = (item: Item, quantity: number, selectedStocks: Stock[]) => {
        const newItems = selectedStocks.map((stock) => ({
            ...item,
            quantity: stock.stock,
            total_value: stock.unit_price * stock.stock,
            stocks: [stock],
        }));

        setItems((prevItems) => [...prevItems, ...newItems]);
        setGrandTotal((prevTotal) => prevTotal + newItems.reduce((sum, newItem) => sum + newItem.total_value, 0));
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        setGrandTotal((prevTotal) => prevTotal - newItems[index].total_value);
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleBranchChange = (selectedOption: any) => {
        setBranch((prevBranch) => ({ ...prevBranch, code: selectedOption.value }));
    };

    const handleGeneratePDF = () => {
        const doc = new jsPDF();
        doc.text('Central Province Office, Kandy', 10, 10);
        doc.text('ADVICE OF DEBIT', 90, 20);
        doc.text(`Branch Code: ${branch.code}`, 10, 30);
        doc.text(`G/L Account No. ${branch.accountNumber}`, 10, 40);
        doc.text('Stationery Charges for - 2024-06-09', 10, 50);

        const itemRows = items.map(item => [
            item.code,
            item.name,
            item.quantity,
            item.stocks.map(stock => stock.unit_price.toFixed(2)).join(', '),
            item.total_value.toFixed(2),
        ]);

        doc.autoTable({
            head: [['Code', 'Stationery', 'Qty', 'Unit Prices', 'Cost']],
            body: itemRows,
            startY: 60,
        });

        doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 10);
        doc.text('..............................', 10, doc.autoTable.previous.finalY + 20);
        doc.text('Authorized Officer', 10, doc.autoTable.previous.finalY + 30);

        const date = new Date().toISOString().split('T')[0];
        doc.save(`invoices/${branch.code}/${date}.pdf`);
    };

    return (
        <div className="p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Invoice Management</h1>
                <BranchSelector branches={branches} onChange={handleBranchChange} />
            </div>
            <ItemTable items={items} onRemove={handleRemoveItem} />
            <AddItemForm availableItems={availableItems} onAdd={addItem} fetchItems={fetchItems} />
            <div className="text-right mb-4">
                <strong>Grand Total: {grandTotal.toFixed(2)}</strong>
            </div>
            <button onClick={handleGeneratePDF} className="bg-green-500 text-white p-2">Save and Generate PDF</button>
        </div>
    );
};

export default InvoiceManagement;
