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

interface Convocatoria {
    id: number;
    title: string;
    year: number;
    total_plazas: number;
    plazas_count?: number;
    plazas_disponibles?: number;
}

interface Institution {
    id: number;
    name: string;
    code: string;
    district: {
        id: number;
        name: string;
        ugel: {
            id: number;
            name: string;
            region: {
                id: number;
                name: string;
            };
        };
    };
}

interface PlazaFiltersProps {
    convocatorias?: Convocatoria[];
    institutions?: Institution[];
    filters?: {
        search?: string;
        convocatoria_id?: string;
        institution_id?: string;
        nivel?: string;
        jornada?: string;
        status?: string;
    };
    onNewPlaza: () => void;
}

export default function PlazaFilters({
    convocatorias = [],
    institutions = [],
    filters = {},
    onNewPlaza
}: PlazaFiltersProps) {
    const [search, setSearch] = useState(filters.search || '');
    const [convocatoriaId, setConvocatoriaId] = useState(filters.convocatoria_id || 'all');
    const [institutionId, setInstitutionId] = useState(filters.institution_id || 'all');
    const [nivel, setNivel] = useState(filters.nivel || 'all');
    const [jornada, setJornada] = useState(filters.jornada || 'all');
    const [status, setStatus] = useState(filters.status || 'all');
    const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

    // Sincronizar estado local con props cuando cambian los filtros externos
    useEffect(() => {
        setSearch(filters.search || '');
        setConvocatoriaId(filters.convocatoria_id || 'all');
        setInstitutionId(filters.institution_id || 'all');
        setNivel(filters.nivel || 'all');
        setJornada(filters.jornada || 'all');
        setStatus(filters.status || 'all');
    }, [filters.search, filters.convocatoria_id, filters.institution_id, filters.nivel, filters.jornada, filters.status]);

    const hasActiveFilters = search ||
        (convocatoriaId && convocatoriaId !== 'all') ||
        (institutionId && institutionId !== 'all') ||
        (nivel && nivel !== 'all') ||
        (jornada && jornada !== 'all') ||
        (status && status !== 'all');

    const applyFilters = (newSearch: string, newConvocatoriaId: string, newInstitutionId: string, newNivel: string, newJornada: string, newStatus: string) => {
        const params = new URLSearchParams();

        if (newSearch.trim()) {
            params.set('search', newSearch.trim());
        }

        if (newConvocatoriaId && newConvocatoriaId !== 'all') {
            params.set('convocatoria_id', newConvocatoriaId);
        }

        if (newInstitutionId && newInstitutionId !== 'all') {
            params.set('institution_id', newInstitutionId);
        }

        if (newNivel && newNivel !== 'all') {
            params.set('nivel', newNivel);
        }

        if (newJornada && newJornada !== 'all') {
            params.set('jornada', newJornada);
        }

        if (newStatus && newStatus !== 'all') {
            params.set('status', newStatus);
        }

        router.get('/plazas', Object.fromEntries(params), {
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
            applyFilters(value, convocatoriaId, institutionId, nivel, jornada, status);
        }, 500);

        setSearchTimeout(timeout);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Cancelar debounce y aplicar inmediatamente
        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }
        applyFilters(search, convocatoriaId, institutionId, nivel, jornada, status);
    };

    const handleConvocatoriaChange = (value: string) => {
        setConvocatoriaId(value);
        applyFilters(search, value, institutionId, nivel, jornada, status);
    };

    const handleInstitutionChange = (value: string) => {
        setInstitutionId(value);
        applyFilters(search, convocatoriaId, value, nivel, jornada, status);
    };

    const handleNivelChange = (value: string) => {
        setNivel(value);
        applyFilters(search, convocatoriaId, institutionId, value, jornada, status);
    };

    const handleJornadaChange = (value: string) => {
        setJornada(value);
        applyFilters(search, convocatoriaId, institutionId, nivel, value, status);
    };

    const handleStatusChange = (value: string) => {
        setStatus(value);
        applyFilters(search, convocatoriaId, institutionId, nivel, jornada, value);
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
        setConvocatoriaId('all');
        setInstitutionId('all');
        setNivel('all');
        setJornada('all');
        setStatus('all');
        router.get('/plazas', {}, {
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
                            <Label htmlFor="search">Buscar plaza</Label>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <Input
                                    id="search"
                                    placeholder="Buscar por código, cargo, especialidad..."
                                    value={search}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="pl-9"
                                />
                            </form>
                        </div>

                        {/* Filtro por convocatoria */}
                        <div className="min-w-[200px] space-y-2">
                            <Label>Convocatoria</Label>
                            <Select value={convocatoriaId} onValueChange={handleConvocatoriaChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las convocatorias" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las convocatorias</SelectItem>
                                    {convocatorias.map((convocatoria) => (
                                        <SelectItem key={convocatoria.id} value={convocatoria.id.toString()}>
                                            <div className="flex flex-col">
                                                <span>{convocatoria.title} ({convocatoria.year})</span>
                                                <span className="text-xs text-gray-500">
                                                    Plazas: {convocatoria.plazas_count || 0}/{convocatoria.total_plazas}
                                                    {(convocatoria.plazas_disponibles || 0) <= 0 && (
                                                        <span className="text-red-500 ml-1">(Completo)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por institución */}
                        <div className="min-w-[200px] space-y-2">
                            <Label>Institución</Label>
                            <Select value={institutionId} onValueChange={handleInstitutionChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Todas las instituciones" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas las instituciones</SelectItem>
                                    {institutions.map((institution) => (
                                        <SelectItem key={institution.id} value={institution.id.toString()}>
                                            {institution.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Filtro por nivel */}
                        <div className="min-w-[120px] space-y-2">
                            <Label>Nivel</Label>
                            <Select value={nivel} onValueChange={handleNivelChange}>
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

                        {/* Filtro por jornada */}
                        <div className="min-w-[100px] space-y-2">
                            <Label>Jornada</Label>
                            <Select value={jornada} onValueChange={handleJornadaChange}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todas</SelectItem>
                                    <SelectItem value="25">25h</SelectItem>
                                    <SelectItem value="30">30h</SelectItem>
                                    <SelectItem value="40">40h</SelectItem>
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
                                    <SelectItem value="filled">Ocupado</SelectItem>
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
                            onClick={onNewPlaza}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Plaza
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
