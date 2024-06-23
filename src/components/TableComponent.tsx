import React, { useState, useEffect } from 'react';
import EditItemModal from '@/components/EditItemModal';
import DeleteItemModal from '@/components/DeleteItemModal';

interface Item {
    id: number;
    code: string;
    name: string;
    total_value: number;
    total_stock: number;
    status: string;
}

interface Stock {
    id: number;
    item_id: number;
    date: string;
    unit_price: number;
    stock: number;
    initial_stock: number;
}

interface TableComponentProps {
    reload: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({ reload }) => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const [items, setItems] = useState<Item[]>([]);
    const [stocks, setStocks] = useState<Record<number, Stock[]>>({});
    const [error, setError] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchItems();
    }, [reload]);

    const fetchItems = async () => {
        try {
            const response = await fetch('/api/items');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setItems(data);
        } catch (error: any) {
            console.error('Error fetching items:', error);
            setError(error.message);
        }
    };

    const itemEdited = async () => {
        await fetchItems();
    };

    const deleteItem = async () => {
        if (itemToDelete !== null) {
            await fetch('/api/items', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ deleteId: itemToDelete }),
            });
            setItemToDelete(null);
            setIsDeleteOpen(false);
            await fetchItems();
        }
    };

    const handleRowClick = async (itemId: number) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId],
        }));

        if (!expandedRows[itemId]) {
            try {
                const response = await fetch(`/api/stocks?itemId=${itemId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setStocks(prevState => ({
                    ...prevState,
                    [itemId]: data,
                }));
            } catch (error: any) {
                console.error('Error fetching stocks:', error);
                setError(error.message);
            }
        }
    };

    const openDeleteModal = (itemId: number) => {
        setItemToDelete(itemId);
        setIsDeleteOpen(true);
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded">
            {error && <div className="text-red-500">Error: {error}</div>}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Code</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Total Value</th>
                    <th scope="col" className="px-6 py-3">Total Stock</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <React.Fragment key={item.id}>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 last:border-none">
                            <td className="px-6 py-4">{item.code}</td>
                            <td className="px-6 py-4">{item.name}</td>
                            <td className="px-6 py-4">{item.total_value}</td>
                            <td className="px-6 py-4">{item.total_stock}</td>
                            <td className={`px-6 py-4 ${item.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                                {item.status}
                            </td>
                            <td className="px-6 py-4 text-right flex space-x-2">
                                <EditItemModal onItemEdited={itemEdited} item={item}></EditItemModal>
                                <button
                                    onClick={() => openDeleteModal(item.id)}
                                    className="font-medium text-gray-600 dark:text-gray-400 hover:underline"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleRowClick(item.id)}
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    {expandedRows[item.id] ? 'Hide' : 'Stocks'}
                                </button>
                            </td>
                        </tr>
                        {expandedRows[item.id] && stocks[item.id] && (
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <td colSpan={6} className="p-2">
                                    <div className="relative overflow-x-auto shadow-md sm:rounded">
                                        <table
                                            className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead
                                                className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Date</th>
                                                <th scope="col" className="px-6 py-3">Unit Price</th>
                                                <th scope="col" className="px-6 py-3">Stock</th>
                                                <th scope="col" className="px-6 py-3">Initial Stock</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {stocks[item.id].map(stock => (
                                                <tr key={stock.id}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                    <td className="px-6 py-4">{stock.date}</td>
                                                    <td className="px-6 py-4">{stock.unit_price}</td>
                                                    <td className="px-6 py-4">{stock.stock}</td>
                                                    <td className="px-6 py-4">{stock.initial_stock}</td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
            <DeleteItemModal
                isOpen={isDeleteOpen}
                closeModal={() => setIsDeleteOpen(false)}
                onDelete={deleteItem}
            />
        </div>
    );
};

export default TableComponent;
