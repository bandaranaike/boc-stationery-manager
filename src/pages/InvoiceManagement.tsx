import React, {useState, useEffect} from 'react';
import {jsPDF} from 'jspdf';
import 'jspdf-autotable';
import Select from 'react-select';
import SearchableDropdown from "@/components/SearchableDropdown";
import axios from "axios";

interface Item {
    id: number;
    code: string;
    name: string;
    quantity: number;
    unit_price: number;
    total_value: number;
}

interface Branch {
    code: string;
    accountNumber: string;
}

const InvoiceManagement = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [branch, setBranch] = useState<Branch>({code: '', accountNumber: ''});
    const [branches, setBranches] = useState<{ value: string; label: string }[]>([]);
    const [grandTotal, setGrandTotal] = useState<number>(0);
    const [searchTerm, setSearchTerm] = useState<string>('');

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
        setItems(response.data);
    };

    const addItem = (item: Item) => {
        setItems((prevItems) => [...prevItems, item]);
        setGrandTotal((prevTotal) => prevTotal + item.total_value);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...items];
        setGrandTotal((prevTotal) => prevTotal - newItems[index].total_value);
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const handleBranchChange = (selectedOption: any) => {
        setBranch((prevBranch) => ({...prevBranch, code: selectedOption.value}));
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
            item.unit_price.toFixed(2),
            item.total_value.toFixed(2)
        ]);

        doc.autoTable({
            head: [['Code', 'Stationery', 'Qty', 'Price', 'Cost']],
            body: itemRows,
            startY: 60,
        });

        doc.text(`Grand Total: ${grandTotal.toFixed(2)}`, 10, doc.autoTable.previous.finalY + 10);
        doc.text('..............................', 10, doc.autoTable.previous.finalY + 20);
        doc.text('Authorized Officer', 10, doc.autoTable.previous.finalY + 30);

        const date = new Date().toISOString().split('T')[0];
        doc.save(`invoices/${branch.code}/${date}.pdf`);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        // Add search logic here
    };

    return (
        <div className="p-4">
            <div className="flex justify-between">
                <h1 className="text-2xl font-bold mb-4">Invoice Management</h1>

                <div className="mb-4 min-w-96 flex">
                    <label className="block mb-2 pt-2 mr-2">Branch</label>
                    <SearchableDropdown options={branches} onChangeHandler={handleBranchChange}></SearchableDropdown>
                </div>
            </div>
            <div className="relative overflow-x-auto shadow-md sm:rounded rounded pb-3">
                <table className="w-full mb-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">Code and Name</th>
                        <th scope="col" className="px-6 py-3">Quantity</th>
                        <th scope="col" className="px-6 py-3">Unit Price</th>
                        <th scope="col" className="px-6 py-3">Total Value</th>
                        <th scope="col" className="px-6 py-3">Remove</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item, index) => (
                        <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{item.code} - {item.name}</td>
                            <td className="px-6 py-4">{item.quantity}</td>
                            <td className="px-6 py-4">{item.unit_price.toFixed(2)}</td>
                            <td className="px-6 py-4">{item.total_value.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <button onClick={() => handleRemoveItem(index)} className="text-red-500">Remove</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                    {!items.length && (<tbody className="mb-2 rounded pb-3">
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 rounded-b">
                        <td colSpan={5} className="p-8 text-center rounded mb-2"> Please add items first</td>
                    </tr>
                    </tbody>)}
                </table>
            </div>
            <div className="flex mb-4 mt-6">
                <div className="mr-2">
                    <SearchableDropdown options={items} onChangeHandler={fetchItems}></SearchableDropdown>
                </div>
                <div className="">
                    <button
                        onClick={() => addItem({
                            id: 1,
                            code: '10005',
                            name: 'Memorandum',
                            quantity: 2,
                            unit_price: 50,
                            total_value: 100
                        })}
                        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Add Item
                    </button>
                </div>
            </div>
            <div className="text-right mb-4">
                <strong>Grand Total: {grandTotal.toFixed(2)}</strong>
            </div>

            <button onClick={handleGeneratePDF} className="bg-green-500 text-white p-2">Save and Generate PDF</button>
        </div>
    );
};

export default InvoiceManagement;
