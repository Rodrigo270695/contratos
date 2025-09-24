import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import { router } from '@inertiajs/react';
import { Edit, Trash2, Users, Clock, MapPin, GraduationCap } from 'lucide-react';

interface Plaza {
    id: number;
    convocatoria_id: number;
    institution_id: number;
    codigo_plaza: string;
    cargo: string;
    nivel: 'inicial' | 'primaria' | 'secundaria';
    especialidad?: string;
    jornada: '25' | '30' | '40';
    vacantes: number;
    motivo_vacante: string;
    requisitos?: string;
    status: 'active' | 'filled' | 'cancelled';
    convocatoria: {
        id: number;
        title: string;
        year: number;
        ugel: {
            id: number;
            name: string;
            region: {
                id: number;
                name: string;
            };
        };
    };
    institution: {
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
    };
    created_at: string;
    updated_at: string;
}

interface PlazaTableProps {
    plazas?: {
        data: Plaza[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    onEdit: (plaza: Plaza) => void;
    onDelete: (plaza: Plaza) => void;
}

// Función helper para formatear fechas sin dependencias externas
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

export default function PlazaTable({
    plazas = {
        data: [],
        current_page: 1,
        last_page: 1,
        per_page: 10,
        total: 0,
        from: 0,
        to: 0
    },
    onEdit,
    onDelete
}: PlazaTableProps) {

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
            filled: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
            cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
        };

        const labels = {
            active: 'Activo',
            filled: 'Ocupado',
            cancelled: 'Cancelado'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${variants[status as keyof typeof variants]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getNivelBadge = (nivel: string) => {
        const variants = {
            inicial: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
            primaria: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
            secundaria: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
        };

        const labels = {
            inicial: 'Inicial',
            primaria: 'Primaria',
            secundaria: 'Secundaria'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${variants[nivel as keyof typeof variants]}`}>
                {labels[nivel as keyof typeof labels]}
            </span>
        );
    };

    if (plazas.data.length === 0) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="text-center">
                    <Users className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No se encontraron plazas
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No hay plazas que coincidan con los filtros aplicados.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4 dark:bg-gray-700 dark:border-gray-600">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Lista de Plazas
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {plazas.from}-{plazas.to} de {plazas.total} plazas
                    </span>
                </div>
            </div>

            {/* Vista Desktop - Tabla tradicional */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Plaza
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Institución/UGEL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Convocatoria
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Estado/Nivel
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Vacantes
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                        {plazas.data.map((plaza) => (
                            <tr key={plaza.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {plaza.codigo_plaza}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {plaza.cargo}
                                        </div>
                                        {plaza.especialidad && (
                                            <div className="text-xs text-gray-400 dark:text-gray-500">
                                                {plaza.especialidad}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {plaza.institution?.name || 'Sin institución'}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {plaza.institution?.district?.ugel?.name || 'Sin UGEL'}
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                        {plaza.institution?.district?.ugel?.region?.name || 'Sin región'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {plaza.convocatoria?.title || 'Sin convocatoria'}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {plaza.convocatoria?.year || ''} - {plaza.convocatoria?.ugel?.name || 'Sin UGEL'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col space-y-2">
                                        {getStatusBadge(plaza.status)}
                                        {getNivelBadge(plaza.nivel)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-1 text-gray-900 dark:text-white">
                                            <Users className="h-4 w-4" />
                                            {plaza.vacantes} vacante{plaza.vacantes !== 1 ? 's' : ''}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                            <Clock className="h-3 w-3" />
                                            {plaza.jornada}h semanales
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(plaza)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(plaza)}
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 dark:border-red-700 cursor-pointer"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-600">
                {plazas.data.map((plaza) => (
                    <div key={plaza.id} className="p-6 space-y-4">
                        {/* Header de la plaza */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                    {plaza.codigo_plaza}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {plaza.cargo}
                                </p>
                            </div>
                            {getStatusBadge(plaza.status)}
                        </div>

                        {/* Información de la plaza */}
                        <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Institución:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{plaza.institution?.name || 'Sin institución'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">UGEL:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{plaza.institution?.district?.ugel?.name || 'Sin UGEL'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Convocatoria:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{plaza.convocatoria?.title || 'Sin convocatoria'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500 dark:text-gray-400">Nivel:</span>
                                {getNivelBadge(plaza.nivel)}
                            </div>
                            {plaza.especialidad && (
                                <div>
                                    <span className="font-medium text-gray-500 dark:text-gray-400">Especialidad:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white">{plaza.especialidad}</span>
                                </div>
                            )}
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Vacantes:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{plaza.vacantes}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Jornada:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{plaza.jornada}h semanales</span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(plaza)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(plaza)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 dark:border-red-700 cursor-pointer"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:bg-gray-700 dark:border-gray-600">
                <Pagination
                    data={plazas}
                    perPageOptions={[5, 10, 15, 25, 50]}
                    showPerPageSelector={true}
                    showInfo={true}
                />
            </div>
        </div>
    );
}
