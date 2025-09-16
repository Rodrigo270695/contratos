import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

export default function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Animación de entrada
        const showTimer = setTimeout(() => {
            setIsVisible(true);
        }, 10);

        // Auto-close después del duration
        const closeTimer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => {
            clearTimeout(showTimer);
            clearTimeout(closeTimer);
        };
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose(id);
        }, 300); // Tiempo de animación de salida
    };

    const getToastStyles = () => {
        const baseStyles = "relative flex items-start p-4 rounded-lg shadow-lg border transition-all duration-300 transform";
        const visibilityStyles = isVisible && !isExiting
            ? "translate-x-0 opacity-100"
            : isExiting
            ? "translate-x-full opacity-0"
            : "translate-x-full opacity-0";

        switch (type) {
            case 'success':
                return `${baseStyles} ${visibilityStyles} bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300`;
            case 'error':
                return `${baseStyles} ${visibilityStyles} bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300`;
            case 'warning':
                return `${baseStyles} ${visibilityStyles} bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300`;
            case 'info':
                return `${baseStyles} ${visibilityStyles} bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300`;
            default:
                return `${baseStyles} ${visibilityStyles} bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300`;
        }
    };

    const getIcon = () => {
        const iconClass = "h-5 w-5 flex-shrink-0 mt-0.5";

        switch (type) {
            case 'success':
                return <CheckCircle className={`${iconClass} text-green-600 dark:text-green-400`} />;
            case 'error':
                return <XCircle className={`${iconClass} text-red-600 dark:text-red-400`} />;
            case 'warning':
                return <AlertCircle className={`${iconClass} text-yellow-600 dark:text-yellow-400`} />;
            case 'info':
                return <Info className={`${iconClass} text-blue-600 dark:text-blue-400`} />;
            default:
                return <Info className={`${iconClass} text-gray-600 dark:text-gray-400`} />;
        }
    };

    return (
        <div className={getToastStyles()}>
            <div className="flex items-start space-x-3 flex-1">
                {getIcon()}
                <div className="flex-1 min-w-0">
                    {title && (
                        <h4 className="text-sm font-medium mb-1">
                            {title}
                        </h4>
                    )}
                    <p className="text-sm">
                        {message}
                    </p>
                </div>
            </div>

            <button
                onClick={handleClose}
                className="ml-3 flex-shrink-0 rounded-md p-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Cerrar notificación"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}
