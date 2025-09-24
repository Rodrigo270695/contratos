import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { router } from '@inertiajs/react';
import { Search, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface Region {
    id: number;
    name: string;
}

interface UgelFiltersProps {
    filters: {
        search?: string;
        status?: string;
        region_id?: string;
    };
    regions: Region[];
    onCreateUgel: () => void;
}

export default function UgelFilters({ filters, regions, onCreateUgel }: UgelFiltersProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [regionId, setRegionId] = useState(filters.region_id || 'all');

    // Aplicar filtros con debounce para la búsqueda
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams();

            if (search) params.set('search', search);
            if (status && status !== 'all') params.set('status', status);
            if (regionId && regionId !== 'all') params.set('region_id', regionId);

            const queryString = params.toString();
            const url = queryString ? `/ugels?${queryString}` : '/ugels';

            router.get(url, {}, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [search, status, regionId]);

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        setRegionId('all');
        router.get('/ugels', {}, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const hasActiveFilters = search || (status && status !== 'all') || (regionId && regionId !== 'all');

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Filtros */}
                    <div className="flex flex-1 flex-col gap-4 lg:flex-row lg:items-center">
                        {/* Búsqueda */}
                        <div className="relative lg:w-80">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Buscar por nombre, código o región..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Filtro por región */}
                        <Select value={regionId} onValueChange={setRegionId}>
                            <SelectTrigger className="lg:w-48">
                                <SelectValue placeholder="Todas las regiones" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todas las regiones</SelectItem>
                                {regions.map((region) => (
                                    <SelectItem key={region.id} value={region.id.toString()}>
                                        {region.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {/* Filtro por estado */}
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger className="lg:w-40">
                                <SelectValue placeholder="Estado" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="active">Activo</SelectItem>
                                <SelectItem value="inactive">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* Limpiar filtros */}
                        {hasActiveFilters && (
                            <Button
                                variant="outline"
                                onClick={clearFilters}
                                className="shrink-0 cursor-pointer"
                            >
                                <X className="mr-2 h-4 w-4" />
                                Limpiar
                            </Button>
                        )}
                    </div>

                    {/* Botón crear */}
                    <div className="flex shrink-0">
                        <Button
                            onClick={onCreateUgel}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva UGEL
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
