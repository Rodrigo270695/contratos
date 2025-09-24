import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Search, Plus, X } from 'lucide-react';

interface Ugel {
    id: number;
    name: string;
    code: string;
    region: {
        id: number;
        name: string;
    };
}

interface DistrictFiltersProps {
    ugels: Ugel[];
    filters: {
        search?: string;
        status?: string;
        ugel_id?: string;
    };
    onNewDistrict: () => void;
}

export default function DistrictFilters({ ugels, filters, onNewDistrict }: DistrictFiltersProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || 'all');
    const [ugelId, setUgelId] = useState(filters.ugel_id || 'all');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Sincronizar estado local con props cuando cambian los filtros externos
    useEffect(() => {
        setSearch(filters.search || '');
        setStatus(filters.status || 'all');
        setUgelId(filters.ugel_id || 'all');
    }, [filters.search, filters.status, filters.ugel_id]);

    const hasActiveFilters = search || (status && status !== 'all') || (ugelId && ugelId !== 'all');

    const applyFilters = (newSearch: string, newStatus: string, newUgelId: string) => {
        const params = new URLSearchParams();

        if (newSearch.trim()) {
            params.set('search', newSearch.trim());
        }

        if (newStatus && newStatus !== 'all') {
            params.set('status', newStatus);
        }

        if (newUgelId && newUgelId !== 'all') {
            params.set('ugel_id', newUgelId);
        }

        router.get('/districts', Object.fromEntries(params), {
            preserveState: true,
            replace: true,
        });
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);

        // Limpiar timeout anterior
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        // Aplicar filtros con debounce de 500ms
        const timeout = setTimeout(() => {
            applyFilters(value, status, ugelId);
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cancelar debounce y aplicar inmediatamente
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        applyFilters(search, status, ugelId);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        applyFilters(search, value, ugelId);
    };

    const handleUgelChange = (value: string) => {
        setUgelId(value);
        applyFilters(search, status, value);
    };

    // Limpiar timeout al desmontar el componente
    useEffect(() => {
        return () => {
            if (searchTimeout) {
                clearTimeout(searchTimeout);
            }
        };
    }, [searchTimeout]);

    const clearFilters = () => {
        setSearch('');
        setStatus('all');
        setUgelId('all');
        router.get('/districts', {}, {
            preserveState: true,
            replace: true,
        });
    };

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex flex-col space-y-4 lg:flex-row lg:items-end lg:justify-between lg:space-y-0 lg:space-x-4">
                    {/* Filtros */}
                    <div className="flex flex-1 flex-col space-y-4 lg:flex-row lg:items-end lg:space-y-0 lg:space-x-4">
                        {/* Búsqueda */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="search">Buscar distrito</Label>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Buscar por nombre, código o región..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-9"
                                />
                            </form>
                        </div>

                        {/* Filtro por UGEL */}
                        <div className="min-w-[200px] space-y-2">
                            <Label>UGEL</Label>
                            <Select value={ugelId} onValueChange={handleUgelChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las UGELs" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las UGELs</SelectItem>
                                    {ugels.map((ugel) => (
                                        <SelectItem key={ugel.id} value={ugel.id.toString()}>
                                            {ugel.name} - {ugel.region.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por estado */}
                        <div className="min-w-[120px] space-y-2">
                            <Label>Estado</Label>
                            <Select value={status} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Limpiar filtros */}
                        {hasActiveFilters && (
                            <div className="flex items-end">
                                <Button
                                    variant="outline"
                                    onClick={clearFilters}
                                    className="shrink-0 cursor-pointer"
                                >
                                    <X className="mr-2 h-4 w-4" />
                                    Limpiar
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Botón crear */}
                    <div className="flex shrink-0">
                        <Button
                            onClick={onNewDistrict}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nuevo Distrito
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
