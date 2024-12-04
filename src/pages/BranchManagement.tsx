import { useEffect, useState } from 'react';
import BranchTable from '../components/BranchTable';
import AddBranchModal from '../components/AddBranchModal';
import EditBranchModal from '../components/EditBranchModal';
import DeleteBranchModal from '../components/DeleteBranchModal';
import { Branch } from '@/types';

export default function BranchManagement() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [branchToDelete, setBranchToDelete] = useState<number | null>(null);

    useEffect(() => {
        fetchBranches();
    }, []);

    const fetchBranches = async () => {
        const response = await fetch('/api/branches');
        const data = await response.json();
        setBranches(data);
    };

    const addBranch = async (name: string, code: string) => {
        await fetch('/api/branches', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, code }),
        });
        fetchBranches();
    };

    const updateBranch = async (branch: Branch) => {
        await fetch('/api/branches', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ newName: branch.name, newCode: branch.code, id: branch.id }),
        });
        fetchBranches();
    };

    const deleteBranch = async () => {
        await fetch('/api/branches', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deleteId: branchToDelete }),
        });
        setBranchToDelete(null);
        setIsDeleteOpen(false);
        fetchBranches();
    };

    return (
        <div>
            <h2 className="text-3xl mb-6">Branch Management</h2>

            <button
                className="bg-blue-500 text-white px-4 py-2 mb-4 rounded"
                onClick={() => setIsAddOpen(true)}
            >
                Add Branch
            </button>

            <BranchTable
                branches={branches}
                onEdit={(branch) => {
                    setCurrentBranch(branch);
                    setIsEditOpen(true);
                }}
                onDelete={(id) => {
                    setBranchToDelete(id);
                    setIsDeleteOpen(true);
                }}
            />

            <AddBranchModal
                isOpen={isAddOpen}
                closeModal={() => setIsAddOpen(false)}
                onAdd={addBranch}
            />

            <EditBranchModal
                isOpen={isEditOpen}
                closeModal={() => setIsEditOpen(false)}
                branch={currentBranch}
                onUpdate={updateBranch}
            />

            <DeleteBranchModal
                isOpen={isDeleteOpen}
                closeModal={() => setIsDeleteOpen(false)}
                onDelete={deleteBranch}
            />
        </div>
    );
}
