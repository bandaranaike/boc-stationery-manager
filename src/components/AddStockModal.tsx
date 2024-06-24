import React, {useState, Fragment, useEffect} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {useForm, SubmitHandler} from 'react-hook-form';
import axios from 'axios';
import SearchableDropdown from "@/components/SearchableDropdown";

interface Item {
    id: number;
    code: string;
    name: string;
}

interface FormData {
    item: number;
    unit_price: number;
    quantity: number;
}

interface DropdownOption {
    value: number;
    label: string;
}

interface AddStockModalProps {
    onStockAdded: () => void
}

const AddStockModal: React.FC<AddStockModalProps> = ({onStockAdded}) => {
    const {register, handleSubmit, reset, setValue} = useForm<FormData>();
    const [isOpen, setIsOpen] = useState(false);
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<DropdownOption | null>(null);

    useEffect(() => {
        fetchItems('');
    }, []);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const fetchItems = async (inputValue: string) => {
        setLoading(true);
        const response = await axios.get(`/api/itemsSearch?text=${inputValue}`);
        setItems(response.data);
        setLoading(false);
    };

    const handleInputChange = (inputValue: string) => {
        fetchItems(inputValue);
    };

    const handleSelectChange = (selectedOption: DropdownOption | null) => {
        if (selectedOption) {
            setValue('item', selectedOption.value);
            setSelectedItem(selectedOption);
        }
    };

    const onSubmit: SubmitHandler<FormData> = async (data) => {
        try {
            const response = await axios.post('/api/addStock', data);
            if (response.data.success) {
                reset();
                setSelectedItem(null);
                closeModal();
                onStockAdded();
            } else {
                console.error('Failed to add stock:', response.data.error);
            }
        } catch (error) {
            console.error('An error occurred while adding stock:', error);
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="block ml-2 py-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm px-5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                type="button"
            >
                Add stock
            </button>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-10 overflow-y-auto" onClose={closeModal}>
                    <div className="min-h-screen px-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-30"/>
                        </Transition.Child>

                        <span className="inline-block h-screen align-middle" aria-hidden="true">&#8203;</span>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div
                                className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                                <div className="flex justify-between items-center">
                                    <Dialog.Title as="h3"
                                                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50">
                                        Add new stock
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                        onClick={closeModal}
                                    >⨯
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                        <div className="bg-white dark:bg-gray-800">
                                            <label htmlFor="item"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Item
                                            </label>
                                            <SearchableDropdown
                                                options={items.map(item => ({
                                                    value: item.id,
                                                    label: `${item.code} - ${item.name}`
                                                }))}
                                                onChangeHandler={handleSelectChange}
                                                onInputChangeHandler={handleInputChange}
                                                value={selectedItem}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="unit_price"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Unit price
                                            </label>
                                            <input {...register('unit_price')} id="unit_price" type="number" step="0.01"
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                   required/>
                                        </div>
                                        <div>
                                            <label htmlFor="quantity"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Quantity
                                            </label>
                                            <input {...register('quantity')} id="quantity" type="number" step="0.01"
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white mb-3"
                                                   required/>
                                        </div>
                                        <button type="submit"
                                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            Add stock
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
};

export default AddStockModal;
