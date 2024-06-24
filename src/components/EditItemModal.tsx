import React, {useState, Fragment} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {useForm} from 'react-hook-form';
import axios from 'axios';
import {Item} from "@/types";

interface EditItemModalProps {
    onItemEdited: () => void;
    item: Item;
}

const EditItemModal: React.FC<EditItemModalProps> = ({onItemEdited, item}) => {
    const {register, handleSubmit, reset} = useForm({
        defaultValues: {
            id: item.id,
            newName: item.name,
            newCode: item.code,
            newReorderLevel: item.reorder_level
        }
    });
    const [isOpen, setIsOpen] = useState(false);

    function closeModal() {
        setIsOpen(false);
    }

    function openModal() {
        setIsOpen(true);
    }

    const onSubmit = async (data: object) => {
        try {
            const response = await axios.put('/api/items', data);
            if (response.status == 200) {
                reset();
                closeModal();
                onItemEdited();
            } else {
                console.error('Failed to edit item:', response.data.error);
            }
        } catch (error) {
            console.error('An error occurred while editing item:', error);
        }
    };

    return (
        <>
            <button
                onClick={openModal}
                className="font-medium text-gray-600 dark:text-gray-400 hover:underline"
                type="button"
            >
                Edit
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
                                        Edit item
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
                                        <input type="hidden" {...register('id')} value={item.id}/>
                                        <div>
                                            <label htmlFor="name"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Item name
                                            </label>
                                            <input {...register('newName')} id="name"
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                   required/>
                                        </div>
                                        <div>
                                            <label htmlFor="code"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Item code
                                            </label>
                                            <input {...register('newCode')} id="code"
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                   required/>
                                        </div>
                                        <div>
                                            <label htmlFor="reorder_level"
                                                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                                Reorder level
                                            </label>
                                            <input {...register('newReorderLevel')} id="reorder_level"
                                                   type="number"
                                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                                                   required/>
                                        </div>
                                        <button type="submit"
                                                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                            Update item
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

export default EditItemModal;
