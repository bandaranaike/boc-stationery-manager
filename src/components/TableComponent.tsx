import React, { useState, useEffect } from 'react';

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

const TableComponent = () => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const [items, setItems] = useState<Item[]>([]);
    const [stocks, setStocks] = useState<Record<number, Stock[]>>({});
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
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
        fetchItems();
    }, []);

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
                    <th scope="col" className="px-6 py-3"><span className="sr-only">Expand</span></th>
                </tr>
                </thead>
                <tbody>
                {items.map(item => (
                    <React.Fragment key={item.id}>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4">{item.code}</td>
                            <td className="px-6 py-4">{item.name}</td>
                            <td className="px-6 py-4">{item.total_value}</td>
                            <td className="px-6 py-4">{item.total_stock}</td>
                            <td className="px-6 py-4">{item.status}</td>
                            <td className="px-6 py-4 text-right">
                                <button
                                    onClick={() => handleRowClick(item.id)}
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    {expandedRows[item.id] ? 'Collapse' : 'Expand'}
                                </button>
                            </td>
                        </tr>
                        {expandedRows[item.id] && stocks[item.id] && (
                            <tr className="bg-gray-50 dark:bg-gray-900">
                                <td colSpan={6} className="p-2">
                                    <div className="relative overflow-x-auto shadow-md sm:rounded">
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                            <tr>
                                                <th scope="col" className="px-6 py-3">Date</th>
                                                <th scope="col" className="px-6 py-3">Unit Price</th>
                                                <th scope="col" className="px-6 py-3">Stock</th>
                                                <th scope="col" className="px-6 py-3">Initial Stock</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {stocks[item.id].map(stock => (
                                                <tr key={stock.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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
        </div>
    );
};

export default TableComponent;
