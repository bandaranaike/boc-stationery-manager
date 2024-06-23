import React from 'react';
import SearchableDropdown from '@/components/SearchableDropdown';
import { DropdownOption } from '@/types';

interface BranchSelectorProps {
    branches: DropdownOption[];
    onChange: (selectedOption: DropdownOption | null) => void;
    value: DropdownOption | null;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ branches, onChange, value }) => {
    return (
        <div className="mb-4 min-w-96 flex">
            <label className="block mb-2 pt-2 mr-2">Branch</label>
            <SearchableDropdown
                options={branches}
                onChangeHandler={onChange}
                onInputChangeHandler={() => {}}
                value={value}
            />
        </div>
    );
};

export default BranchSelector;
