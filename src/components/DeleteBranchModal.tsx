import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { DeleteBranchModalProps } from '@/types';

const DeleteBranchModal: React.FC<DeleteBranchModalProps> = ({ isOpen, closeModal, onDelete }) => {
    return (
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
                        <div className="fixed inset-0 bg-black bg-opacity-30" />
                    </Transition.Child>

                    <span className="inline-block h-screen align-middle" aria-hidden="true">
            &#8203;
          </span>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-gray-800 shadow-xl rounded-lg">
                            <div className="flex justify-between items-center">
                                <Dialog.Title
                                    as="h3"
                                    className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-50"
                                >
                                    Confirm Deletion
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
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Are you sure you want to delete this branch? This action cannot be undone.
                                </p>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    className="bg-gray-500 text-white px-4 py-2 mr-2 rounded"
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    className="bg-red-600 text-white px-4 py-2 rounded"
                                    onClick={onDelete}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
};

export default DeleteBranchModal;
