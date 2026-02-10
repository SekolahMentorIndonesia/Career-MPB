import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Hapus", cancelText = "Batal", type = "danger" }) => {
    return (
        <div className={clsx("fixed inset-0 z-[60] flex items-center justify-center p-4", !isOpen && "pointer-events-none")}>
            <Transition
                show={isOpen}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel}></div>
            </Transition>

            <Transition
                show={isOpen}
                enter="transition-all duration-300 ease-out"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="transition-all duration-200 ease-in"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
            >
                <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
                    <div className="p-6">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className={clsx(
                                "p-3 rounded-2xl",
                                type === 'danger' ? 'bg-red-50' :
                                    type === 'success' ? 'bg-green-50' : 'bg-blue-50'
                            )}>
                                <AlertTriangle className={clsx(
                                    "w-8 h-8",
                                    type === 'danger' ? 'text-red-500' :
                                        type === 'success' ? 'text-green-500' : 'text-blue-500'
                                )} />
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">{title}</h3>
                                <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex border-t border-gray-100">
                        <button
                            onClick={onCancel}
                            className="flex-1 px-6 py-4 text-sm font-black text-gray-500 hover:bg-gray-50 transition-colors uppercase tracking-widest"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={clsx(
                                "flex-1 px-6 py-4 text-sm font-black text-white transition-all uppercase tracking-widest",
                                type === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                                    type === 'success' ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
                            )}
                        >
                            {confirmText}
                        </button>
                    </div>
                </div>
            </Transition>
        </div>
    );
};

export default ConfirmationModal;
