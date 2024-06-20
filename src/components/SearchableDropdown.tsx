import exp from "node:constants";
import Select from "react-select";
import React from "react";

const SearchableDropdown = ({options, onChangeHandler, onInputChangeHandler=(InputValue:string)=>{}}) => {
    return (<Select
        options={options}
        onChange={onChangeHandler}
        onInputChange={onInputChangeHandler}
        className="w-full"
        placeholder="Select Branch"
        isSearchable
        styles={{
            control: (provided, state) => ({
                ...provided,
                backgroundColor: state.isFocused ? '#2d3748' : '#2d3748', // dark:bg-gray-800
                borderColor: state.isFocused ? '#4a5568' : '#4a5568', // dark:border-gray-600
                color: '#e2e8f0', // dark:text-white
            }),
            menu: (provided) => ({
                ...provided,
                backgroundColor: '#2d3748', // dark:bg-gray-800
                color: '#e2e8f0', // dark:text-white
            }),
            singleValue: (provided) => ({
                ...provided,
                color: '#e2e8f0', // dark:text-white
            }),
            input: (provided) => ({
                ...provided,
                color: '#e2e8f0', // dark:text-white
            }),
            placeholder: (provided) => ({
                ...provided,
                color: '#a0aec0', // dark:text-gray-400
            }),
            menuList: (provided) => ({
                ...provided,
                backgroundColor: '#2d3748', // dark:bg-gray-800
            }),
            option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#4a5568' : '#2d3748', // dark:bg-gray-700 and dark:bg-gray-800
                color: '#e2e8f0', // dark:text-white
                '&:hover': {
                    backgroundColor: '#4a5568', // dark:bg-gray-700
                },
            }),
        }}
    />);
}

export default SearchableDropdown;

