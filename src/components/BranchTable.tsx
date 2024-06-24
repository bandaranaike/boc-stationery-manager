import React from 'react';

interface Branch {
    id: number;
    code: string;
    name: string;
}

interface BranchTableProps {
    branches: Branch[];
    onEdit: (branch: Branch) => void;
    onDelete: (id: number) => void;
}

const BranchTable: React.FC<BranchTableProps> = ({ branches, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto shadow-md sm:rounded mt-4 h-full max-h-[720px]">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sticky top-0">
                <tr>
                    <th scope="col" className="px-6 py-3">Code and Name</th>
                    <th scope="col" className="px-6 py-3">Actions</th>
                </tr>
                </thead>
                <tbody className="overflow-y-auto">
                {branches.map((branch) => (
                    <tr key={branch.id} className="bg-white dark:bg-gray-800 dark:border-gray-700 border-b last:border-none">
                        <td className="px-6 py-3">{branch.code} - {branch.name}</td>
                        <td className="px-6 py-3">
                            <button onClick={() => onEdit(branch)} className="text-blue-500 mr-2">Edit</button>
                            <button onClick={() => onDelete(branch.id)} className="text-red-500">Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default BranchTable;
