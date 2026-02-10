import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';

const Notification = ({ type, title, message, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, 4500); // Start exit animation slightly before auto-remove
        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(onClose, 300); // Match animation duration
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-red-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
    };

    const borderColors = {
        success: 'border-emerald-500/20 bg-emerald-50/90',
        error: 'border-red-500/20 bg-red-50/90',
        info: 'border-blue-500/20 bg-blue-50/90',
    };

    const shadowColors = {
        success: 'shadow-emerald-500/10',
        error: 'shadow-red-500/10',
        info: 'shadow-blue-500/10',
    };

    return (
        <div
            className={clsx(
                "pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-2xl min-w-[320px] max-w-md transition-all duration-300 transform",
                borderColors[type],
                shadowColors[type],
                isExiting ? "translate-x-full opacity-0 scale-95" : "translate-x-0 opacity-100 scale-100 animate-in fade-in slide-in-from-right-4"
            )}
        >
            <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-black text-gray-900 tracking-tight leading-none mb-1">
                    {title}
                </h4>
                <p className="text-xs font-medium text-gray-600 leading-relaxed">
                    {message}
                </p>
            </div>
            <button
                onClick={handleClose}
                className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors p-1 -mt-1 -mr-1"
            >
                <X className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Notification;
