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

interface District {
    id: number;
    name: string;
    code: string;
    ugel: {
        id: number;
        name: string;
        region: {
            id: number;
            name: string;
        };
    };
}

interface InstitutionFiltersProps {
    districts: District[];
    filters: {
        search?: string;
        district_id?: string;
        level?: string;
        modality?: string;
        status?: string;
    };
    onNewInstitution: () => void;
}

export default function InstitutionFilters({ districts, filters, onNewInstitution }: InstitutionFiltersProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [districtId, setDistrictId] = useState(filters.district_id || 'all');
    const [level, setLevel] = useState(filters.level || 'all');
    const [modality, setModality] = useState(filters.modality || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Sincronizar estado local con props cuando cambian los filtros externos
    useEffect(() => {
        setSearch(filters.search || '');
        setDistrictId(filters.district_id || 'all');
        setLevel(filters.level || 'all');
        setModality(filters.modality || 'all');
        setStatus(filters.status || 'all');
    }, [filters.search, filters.district_id, filters.level, filters.modality, filters.status]);

    const hasActiveFilters = search ||
        (districtId && districtId !== 'all') ||
        (level && level !== 'all') ||
        (modality && modality !== 'all') ||
        (status && status !== 'all');

    const applyFilters = (newSearch: string, newDistrictId: string, newLevel: string, newModality: string, newStatus: string) => {
        const params = new URLSearchParams();

        if (newSearch.trim()) {
            params.set('search', newSearch.trim());
        }

        if (newDistrictId && newDistrictId !== 'all') {
            params.set('district_id', newDistrictId);
        }

        if (newLevel && newLevel !== 'all') {
            params.set('level', newLevel);
        }

        if (newModality && newModality !== 'all') {
            params.set('modality', newModality);
        }

        if (newStatus && newStatus !== 'all') {
            params.set('status', newStatus);
        }

        router.get('/institutions', Object.fromEntries(params), {
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
            applyFilters(value, districtId, level, modality, status);
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cancelar debounce y aplicar inmediatamente
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        applyFilters(search, districtId, level, modality, status);
    };

    const handleDistrictChange = (value: string) => {
        setDistrictId(value);
        applyFilters(search, value, level, modality, status);
    };

    const handleLevelChange = (value: string) => {
        setLevel(value);
        applyFilters(search, districtId, value, modality, status);
    };

    const handleModalityChange = (value: string) => {
        setModality(value);
        applyFilters(search, districtId, level, value, status);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        applyFilters(search, districtId, level, modality, value);
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
        setDistrictId('all');
        setLevel('all');
        setModality('all');
        setStatus('all');
        router.get('/institutions', {}, {
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
                            <Label htmlFor="search">Buscar institución</Label>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Buscar por nombre, código, distrito..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-9"
                                />
                            </form>
                        </div>

                        {/* Filtro por distrito */}
                        <div className="min-w-[200px] space-y-2">
                            <Label>Distrito</Label>
                            <Select value={districtId} onValueChange={handleDistrictChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todos los distritos" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos los distritos</SelectItem>
                                    {districts.map((district) => (
                                        <SelectItem key={district.id} value={district.id.toString()}>
                                            {district.name} - {district.ugel.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por nivel */}
                        <div className="min-w-[120px] space-y-2">
                            <Label>Nivel</Label>
                            <Select value={level} onValueChange={handleLevelChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="inicial">Inicial</SelectItem>
                                    <SelectItem value="primaria">Primaria</SelectItem>
                                    <SelectItem value="secundaria">Secundaria</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por modalidad */}
                        <div className="min-w-[120px] space-y-2">
                            <Label>Modalidad</Label>
                            <Select value={modality} onValueChange={handleModalityChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="EBR">EBR</SelectItem>
                                    <SelectItem value="EBA">EBA</SelectItem>
                                    <SelectItem value="EBE">EBE</SelectItem>
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
                            onClick={onNewInstitution}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Institución
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
