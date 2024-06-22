import React from 'react';

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

interface ItemTableProps {
    items: Item[];
    onRemove: (index: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onRemove }) => {
    return (
        <div className="relative overflow-x-auto shadow-md sm:rounded rounded pb-3">
            <table className="w-full mb-4 text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 rounded">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Code and Name</th>
                    <th scope="col" className="px-6 py-3">Quantity</th>
                    <th scope="col" className="px-6 py-3">Unit Prices</th>
                    <th scope="col" className="px-6 py-3">Total Value</th>
                    <th scope="col" className="px-6 py-3">Remove</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="px-6 py-4">{item.code} - {item.name}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">{item.stocks.map(stock => stock.unit_price.toFixed(2)).join(', ')}</td>
                        <td className="px-6 py-4">{item.total_value.toFixed(2)}</td>
                        <td className="px-6 py-4">
                            <button onClick={() => onRemove(index)} className="text-red-500">Remove</button>
                        </td>
                    </tr>
                ))}
                {!items.length && (
                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td colSpan={5} className="p-8 text-center">Please add items first</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;
