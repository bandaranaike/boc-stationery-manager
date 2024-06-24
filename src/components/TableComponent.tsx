import React, {useState, useEffect} from 'react';
import EditItemModal from '@/components/EditItemModal';
import DeleteItemModal from '@/components/DeleteItemModal';
import {Item, Stock} from "@/types";
import {format} from "@/utils/utills";

interface TableComponentProps {
    reload: boolean;
}

const TableComponent: React.FC<TableComponentProps> = ({reload}) => {
    const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({});
    const [items, setItems] = useState<Item[]>([]);
    const [stocks, setStocks] = useState<Record<number, Stock[]>>({});
    const [error, setError] = useState<string | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const [stockToDelete, setStockToDelete] = useState<number | null>(null);

    useEffect(() => {
        console.log("depends on working", reload)
        fetchItems();
    }, [reload]);

    const fetchItems = async () => {
        console.log("fetching items...")
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

    const fetchStocks = async (itemId: number) => {
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
    };

    const itemEdited = async () => {
        await fetchItems();
    };

    const deleteItem = async () => {
        if (itemToDelete !== null) {
            await fetch('/api/items', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({deleteId: itemToDelete}),
            });
            setItemToDelete(null);
            setIsDeleteOpen(false);
            await fetchItems();
        }
    };

    const deleteStock = async () => {
        if (stockToDelete !== null) {
            try {

                // Find the item ID that contains this stock
                const itemId = Object.keys(stocks).find(itemId =>
                    stocks[parseInt(itemId)].some(stock => stock.id === stockToDelete)
                );

                await fetch('/api/stocks', {
                    method: 'DELETE',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({id: stockToDelete, itemId}),
                });

                if (itemId) {
                    await fetchStocks(parseInt(itemId));
                    await fetchItems();
                }

                setStockToDelete(null);
                setIsDeleteOpen(false);
            } catch (error) {
                console.error('Error deleting stock:', error);
                // @ts-ignore
                setError(error.message);
            }
        }
    };

    const handleRowClick = async (itemId: number) => {
        setExpandedRows(prevState => ({
            ...prevState,
            [itemId]: !prevState[itemId],
        }));

        if (!expandedRows[itemId]) {
            await fetchStocks(itemId);
        }
    };

    const openDeleteModal = (itemId: number) => {
        setItemToDelete(itemId);
        setIsDeleteOpen(true);
    };

    const openStockDeleteModal = (stockId: number) => {
        setStockToDelete(stockId);
        setIsDeleteOpen(true);
    };

    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded max-h-[800px]">
            {error && <div className="text-red-500">Error: {error}</div>}
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead
                    className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3">Code</th>
                    <th scope="col" className="px-6 py-3">Name</th>
                    <th scope="col" className="px-6 py-3">Total Value</th>
                    <th scope="col" className="px-6 py-3">Total Stock</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3"><span className="sr-only">Actions</span></th>
                </tr>
                </thead>
                <tbody className="overflow-y-auto">
                {items.map(item => (
                    <React.Fragment key={item.id}>
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 last:border-none">
                            <td className="px-6 py-4">{item.code}</td>
                            <td className="px-6 py-4">{item.name}</td>
                            <td className="px-6 py-4">{format(item.total_value)}</td>
                            <td className="px-6 py-4">{format(item.total_stock, 0)}</td>
                            <td title={`Order level is ${item.reorder_level}`}
                                className={`px-6 py-4 ${item.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
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
                                {item.total_stock > 0 && (<button
                                    onClick={() => handleRowClick(item.id)}
                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                                >
                                    {expandedRows[item.id] ? 'Hide' : 'Show Stocks'}
                                </button>)}

                            </td>
                        </tr>
                        {item.total_stock > 0 && expandedRows[item.id] && stocks[item.id] && (
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
                                                <th scope="col" className="px-6 py-3"><span
                                                    className="sr-only">Actions</span></th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {stocks[item.id].map(stock => (
                                                <tr key={stock.id}
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 last:border-none">
                                                    <td className="px-6 py-4">{stock.date}</td>
                                                    <td className="px-6 py-4">{format(stock.unit_price)}</td>
                                                    <td className="px-6 py-4">{format(stock.stock, 0)}</td>
                                                    <td className="px-6 py-4">{format(stock.initial_stock, 0)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => openStockDeleteModal(stock.id)}
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
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
                onDelete={itemToDelete !== null ? deleteItem : deleteStock}
            />
        </div>
    );
};

export default TableComponent;
