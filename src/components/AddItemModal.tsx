import React, {useState, Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {useForm} from 'react-hook-form';
import axios from 'axios';

interface AddItemModalProps {
    onItemAdded: () => void;
}

const AddItemModal: React.FC<AddItemModalProps> = ({onItemAdded}) => {
    const {register, handleSubmit, reset} = useForm();
    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const onSubmit = async (data: object) => {
        try {
            const response = await axios.post('/api/items', data);
            if (response.status == 201) {
                reset();
                closeModal();
                onItemAdded();
            } else {
                console.error('Failed to add item:', response.data.error);
            }
        } catch (error) {
            console.error('An error occurred while adding item:', error);
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="block ml-2 py-3 text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm px-5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                type="button"
            >
                Add item
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
                                        Add new item
                                    </Dialog.Title>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-600 focus:outline-none"
                                        onClick={closeModal}
                                    >
                                        ⨯
                                    </button>
                                </div>
                                <div className="mt-2">
                                    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                                        <div>
                                            <label htmlFor="name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Item name
                                            </label>
                                            <input {...register('name')} id="name"
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                   required/>
                                        </div>
                                        <div>
                                            <label htmlFor="code"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Item code
                                            </label>
                                            <input {...register('code')} id="code"
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                   required/>
                                        </div>
                                        <div>
                                            <label htmlFor="reorder_level"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Reorder Level
                                            </label>
                                            <input {...register('reorder_level')} id="reorder_level" type="number" step="0.01"
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                   required/>
                                        </div>
                                        <button type="submit"
                                                className="w-full text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
                                            Add item
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

export default AddItemModal;
