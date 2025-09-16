interface ToastOptions {
    title?: string;
    message: string;
    duration?: number;
}

interface UseToast {
    success: (options: ToastOptions) => void;
    error: (options: ToastOptions) => void;
    warning: (options: ToastOptions) => void;
    info: (options: ToastOptions) => void;
}

export const useToast = (): UseToast => {
    const addToast = (window as any).addToast;

    return {
        success: ({ title = 'Éxito', message, duration = 5000 }: ToastOptions) => {
            if (addToast) {
                addToast({
                    type: 'success',
                    title,
                    message,
                    duration,
                });
            }
        },

        error: ({ title = 'Error', message, duration = 7000 }: ToastOptions) => {
            if (addToast) {
                addToast({
                    type: 'error',
                    title,
                    message,
                    duration,
                });
            }
        },

        warning: ({ title = 'Advertencia', message, duration = 6000 }: ToastOptions) => {
            if (addToast) {
                addToast({
                    type: 'warning',
                    title,
                    message,
                    duration,
                });
            }
        },

        info: ({ title = 'Información', message, duration = 5000 }: ToastOptions) => {
            if (addToast) {
                addToast({
                    type: 'info',
                    title,
                    message,
                    duration,
                });
            }
        },
    };
};
