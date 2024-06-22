import React from 'react';
import Select from 'react-select';

const SearchableDropdown = ({ options, onChangeHandler, onInputChangeHandler }) => {
    return (
        <Select
            options={options}
            onChange={onChangeHandler}
            onInputChange={(inputValue) => onInputChangeHandler(inputValue)}
            className="w-full"
            placeholder="Select an option"
            isSearchable
            styles={{
                control: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isFocused ? '#2d3748' : '#2d3748',
                    borderColor: state.isFocused ? '#4a5568' : '#4a5568',
                    color: '#e2e8f0',
                }),
                menu: (provided) => ({
                    ...provided,
                    backgroundColor: '#2d3748',
                    color: '#e2e8f0',
                }),
                singleValue: (provided) => ({
                    ...provided,
                    color: '#e2e8f0',
                }),
                input: (provided) => ({
                    ...provided,
                    color: '#e2e8f0',
                }),
                placeholder: (provided) => ({
                    ...provided,
                    color: '#a0aec0',
                }),
                menuList: (provided) => ({
                    ...provided,
                    backgroundColor: '#2d3748',
                }),
                option: (provided, state) => ({
                    ...provided,
                    backgroundColor: state.isSelected ? '#4a5568' : '#2d3748',
                    color: '#e2e8f0',
                    '&:hover': {
                        backgroundColor: '#4a5568',
                    },
                }),
            }}
        />
    );
};

export default SearchableDropdown;
