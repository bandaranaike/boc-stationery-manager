import React from 'react';
import SearchableDropdown from '@/components/SearchableDropdown';

interface BranchSelectorProps {
    branches: { value: string; label: string }[];
    onChange: (selectedOption: any) => void;
}

const BranchSelector: React.FC<BranchSelectorProps> = ({ branches, onChange }) => {
    return (
        <div className="mb-4 min-w-96 flex">
            <label className="block mb-2 pt-2 mr-2">Branch</label>
            <SearchableDropdown
                options={branches}
                onChangeHandler={onChange}
                onInputChangeHandler={() => {}}
            />
        </div>
    );
};

export default BranchSelector;
