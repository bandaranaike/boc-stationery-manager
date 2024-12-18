// src/types.ts

import exp from "node:constants";

export interface Branch {
    id: number;
    code: string;
    name: string;
}

export interface DropdownOption {
    value: number;
    label: string;
    code?: string;
    name?: string;
    total_value?: number;
    quantity?: number;
    stocks?: Stock[];
    id: number;
}

export interface DeleteBranchModalProps extends ModalProps {
    onDelete: () => void;
}

export interface DeleteItemModalProps extends DeleteBranchModalProps {
}

export interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

export interface EditBranchModalProps extends ModalProps {
    branch: Branch | null;
    onUpdate: (updatedBranch: Branch) => Promise<void>;
}

export interface Stock {
    id: number;
    item_id: number;
    date: string;
    unit_price: number;
    stock: number;
    initial_stock: number;
}

export interface Item {
    id: number;
    code: string;
    name: string;
    quantity?: number;
    total_value?: number;
    total_stock: number;
    reorder_level?: number;
    stocks?: Stock[];
    status: string;
}