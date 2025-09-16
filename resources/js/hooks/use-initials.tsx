import { useCallback } from 'react';

export function useInitials() {
    return useCallback((fullName: string): string => {
        // Validar que fullName no sea null, undefined o vacío
        if (!fullName || typeof fullName !== 'string') {
            return 'NN'; // "No Name" como fallback
        }

        const names = fullName.trim().split(' ').filter(name => name.length > 0);

        if (names.length === 0) return 'NN';
        if (names.length === 1) return names[0].charAt(0).toUpperCase();

        const firstInitial = names[0].charAt(0);
        const lastInitial = names[names.length - 1].charAt(0);

        return `${firstInitial}${lastInitial}`.toUpperCase();
    }, []);
}
