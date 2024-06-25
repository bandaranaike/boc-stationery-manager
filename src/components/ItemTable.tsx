import React from 'react';
import {DropdownOption, Item} from '@/types';
import {format} from "@/utils/utills";

interface ItemTableProps {
    items: DropdownOption[];
    onRemove: (index: number) => void;
}

const ItemTable: React.FC<ItemTableProps> = ({ items, onRemove }) => {
    return (
        <div className="overflow-x-auto shadow-md sm:rounded mt-4">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">Code and Name</th>
                    <th scope="col" className="px-6 py-3">Quantity</th>
                    <th scope="col" className="px-6 py-3">Total Value</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
                </thead>
                <tbody>
                {items.map((item, index) => (
                    <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 last:border-none">
                        <td className="px-6 py-4">{item.code} - {item.name}</td>
                        <td className="px-6 py-4">{format(item.quantity, 0)}</td>
                        <td className="px-6 py-4">{format(item.total_value)}</td>
                        <td className="px-6 py-4">
                            <button onClick={() => onRemove(index)} className="text-red-500">Remove</button>
                        </td>
                    </tr>
                ))}
                {!items.length && (
                    <tr className="bg-white dark:bg-gray-800">
                        <td colSpan={5} className="p-8 text-center">Please add items first</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
};

export default ItemTable;
