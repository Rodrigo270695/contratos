import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { router } from '@inertiajs/react';
import { Search, Plus, Filter, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface RegionFiltersProps {
    filters: {
        search?: string;
        status?: string;
    };
    onCreateRegion: () => void;
}

export default function RegionFilters({ filters, onCreateRegion }: RegionFiltersProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            applyFilters();
        }, 500);

        return () => clearTimeout(timer);
    }, [search]);

    // Apply filters immediately when status changes
    useEffect(() => {
        applyFilters();
    }, [status]);

    const applyFilters = () => {
        const params = new URLSearchParams();

        if (search) params.append('search', search);
        if (status) params.append('status', status);

        const queryString = params.toString();
        const url = queryString ? `/regiones?${queryString}` : '/regiones';

        router.get(url, {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const clearFilters = () => {
        setSearch('');
        setStatus('');
        router.get('/regiones', {}, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
    };

    const hasActiveFilters = search || status;

    return (
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
                {/* Filtros */}
                <div className="flex flex-1 flex-col space-y-4 lg:flex-row lg:items-center lg:space-y-0 lg:space-x-4">
                    {/* Búsqueda */}
                    <div className="relative flex-1 lg:max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre o código..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>

                    {/* Filtro por estado */}
                    <div className="w-full lg:w-48">
                        <select
                            value={status}
                            onChange={(e) => handleStatusChange(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:bg-white focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value="">Todos los estados</option>
                            <option value="active">Activo</option>
                            <option value="inactive">Inactivo</option>
                        </select>
                    </div>

                    {/* Limpiar filtros */}
                    {hasActiveFilters && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearFilters}
                            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                            <X className="h-4 w-4" />
                            <span>Limpiar</span>
                        </Button>
                    )}
                </div>

                {/* Acciones - solo desktop */}
                <div className="hidden sm:flex items-center space-x-3">
                    <Button
                        onClick={onCreateRegion}
                        className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Crear Región
                    </Button>
                </div>
            </div>

            {/* Indicador de filtros activos */}
            {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Filter className="h-4 w-4" />
                        <span>Filtros activos:</span>
                    </div>

                    {search && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                            Búsqueda: "{search}"
                        </span>
                    )}

                    {status && (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-300">
                            Estado: {status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
