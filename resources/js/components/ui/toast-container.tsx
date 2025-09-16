import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import Toast, { ToastProps } from './toast';
import { type SharedData } from '@/types';

interface ToastData {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number;
}

export default function ToastContainer() {
    const [toasts, setToasts] = useState<ToastData[]>([]);
    const { flash } = usePage<SharedData>().props;

    // Función para generar ID único
    const generateId = () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    };

    // Función para agregar toast
    const addToast = (toast: Omit<ToastData, 'id'>) => {
        const newToast: ToastData = {
            id: generateId(),
            ...toast,
        };
        setToasts(prev => [...prev, newToast]);
    };

    // Función para remover toast
    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Escuchar mensajes flash de Laravel
    useEffect(() => {
        if (flash?.success) {
            addToast({
                type: 'success',
                title: 'Éxito',
                message: flash.success,
                duration: 5000,
            });
        }

        if (flash?.error) {
            addToast({
                type: 'error',
                title: 'Error',
                message: flash.error,
                duration: 7000,
            });
        }

        if (flash?.warning) {
            addToast({
                type: 'warning',
                title: 'Advertencia',
                message: flash.warning,
                duration: 6000,
            });
        }

        if (flash?.info) {
            addToast({
                type: 'info',
                title: 'Información',
                message: flash.info,
                duration: 5000,
            });
        }
    }, [flash]);

    // Función global para agregar toasts desde cualquier parte de la app
    useEffect(() => {
        // Hacer la función disponible globalmente
        (window as any).addToast = addToast;

        return () => {
            delete (window as any).addToast;
        };
    }, []);

    if (toasts.length === 0) {
        return null;
    }

    return (
        <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    id={toast.id}
                    type={toast.type}
                    title={toast.title}
                    message={toast.message}
                    duration={toast.duration}
                    onClose={removeToast}
                />
            ))}
        </div>
    );
}

// Tipos para TypeScript global
declare global {
    interface Window {
        addToast?: (toast: Omit<ToastData, 'id'>) => void;
    }
}
