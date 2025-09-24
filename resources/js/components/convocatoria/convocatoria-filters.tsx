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

interface ConvocatoriaFiltersProps {
    ugels?: Ugel[];
    years?: number[];
    filters?: {
        search?: string;
        ugel_id?: string;
        year?: string;
        process_type?: string;
        status?: string;
    };
    onNewConvocatoria: () => void;
}

export default function ConvocatoriaFilters({ ugels = [], years = [], filters = {}, onNewConvocatoria }: ConvocatoriaFiltersProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [ugelId, setUgelId] = useState(filters.ugel_id || 'all');
    const [year, setYear] = useState(filters.year || 'all');
    const [processType, setProcessType] = useState(filters.process_type || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Sincronizar estado local con props cuando cambian los filtros externos
    useEffect(() => {
        setSearch(filters.search || '');
        setUgelId(filters.ugel_id || 'all');
        setYear(filters.year || 'all');
        setProcessType(filters.process_type || 'all');
        setStatus(filters.status || 'all');
    }, [filters.search, filters.ugel_id, filters.year, filters.process_type, filters.status]);

    const hasActiveFilters = search ||
        (ugelId && ugelId !== 'all') ||
        (year && year !== 'all') ||
        (processType && processType !== 'all') ||
        (status && status !== 'all');

    const applyFilters = (newSearch: string, newUgelId: string, newYear: string, newProcessType: string, newStatus: string) => {
        const params = new URLSearchParams();

        if (newSearch.trim()) {
            params.set('search', newSearch.trim());
        }

        if (newUgelId && newUgelId !== 'all') {
            params.set('ugel_id', newUgelId);
        }

        if (newYear && newYear !== 'all') {
            params.set('year', newYear);
        }

        if (newProcessType && newProcessType !== 'all') {
            params.set('process_type', newProcessType);
        }

        if (newStatus && newStatus !== 'all') {
            params.set('status', newStatus);
        }

        router.get('/convocatorias', Object.fromEntries(params), {
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
            applyFilters(value, ugelId, year, processType, status);
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cancelar debounce y aplicar inmediatamente
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        applyFilters(search, ugelId, year, processType, status);
    };

    const handleUgelChange = (value: string) => {
        setUgelId(value);
        applyFilters(search, value, year, processType, status);
    };

    const handleYearChange = (value: string) => {
        setYear(value);
        applyFilters(search, ugelId, value, processType, status);
    };

    const handleProcessTypeChange = (value: string) => {
        setProcessType(value);
        applyFilters(search, ugelId, year, value, status);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        applyFilters(search, ugelId, year, processType, value);
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
        setUgelId('all');
        setYear('all');
        setProcessType('all');
        setStatus('all');
        router.get('/convocatorias', {}, {
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
                            <Label htmlFor="search">Buscar convocatoria</Label>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Buscar por título, descripción, UGEL..."
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
                                            {ugel.name} - {ugel.region?.name || 'Sin región'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por año */}
                        <div className="min-w-[120px] space-y-2">
                            <Label>Año</Label>
                            <Select value={year} onValueChange={handleYearChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    {years.map((yearOption) => (
                                        <SelectItem key={yearOption} value={yearOption.toString()}>
                                            {yearOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por tipo de proceso */}
                        <div className="min-w-[140px] space-y-2">
                            <Label>Tipo</Label>
                            <Select value={processType} onValueChange={handleProcessTypeChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="contratacion">Contratación</SelectItem>
                                    <SelectItem value="nombramiento">Nombramiento</SelectItem>
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
                                    <SelectItem value="draft">Borrador</SelectItem>
                                    <SelectItem value="published">Publicado</SelectItem>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="closed">Cerrado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
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
                            onClick={onNewConvocatoria}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Convocatoria
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
