import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import { router } from '@inertiajs/react';
import { Edit, Trash2, Calendar, Users, Clock } from 'lucide-react';

interface Convocatoria {
    id: number;
    title: string;
    description?: string;
    year: number;
    process_type: 'contratacion' | 'nombramiento';
    ugel_id: number;
    start_date: string;
    end_date: string;
    registration_start: string;
    registration_end: string;
    status: 'draft' | 'published' | 'active' | 'closed' | 'cancelled';
    total_plazas: number;
    created_by: number;
    ugel: {
        id: number;
        name: string;
        code: string;
        region: {
            id: number;
            name: string;
        };
    };
    creator: {
        id: number;
        first_name: string;
        last_name: string;
    };
    created_at: string;
    updated_at: string;
}

interface ConvocatoriaTableProps {
    convocatorias?: {
        data: Convocatoria[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    onEdit: (convocatoria: Convocatoria) => void;
    onDelete: (convocatoria: Convocatoria) => void;
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

const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export default function ConvocatoriaTable({
    convocatorias = {
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
}: ConvocatoriaTableProps) {

    const getStatusBadge = (status: string) => {
        const variants = {
            draft: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800',
            published: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
            active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
            closed: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
            cancelled: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
        };

        const labels = {
            draft: 'Borrador',
            published: 'Publicado',
            active: 'Activo',
            closed: 'Cerrado',
            cancelled: 'Cancelado'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${variants[status as keyof typeof variants]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getProcessTypeBadge = (type: string) => {
        const variants = {
            contratacion: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
            nombramiento: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800'
        };

        const labels = {
            contratacion: 'Contratación',
            nombramiento: 'Nombramiento'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${variants[type as keyof typeof variants]}`}>
                {labels[type as keyof typeof labels]}
            </span>
        );
    };

    if (convocatorias.data.length === 0) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="text-center">
                    <Megaphone className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No se encontraron convocatorias
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No hay convocatorias que coincidan con los filtros aplicados.
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
                        Lista de Convocatorias
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {convocatorias.from}-{convocatorias.to} de {convocatorias.total} convocatorias
                    </span>
                </div>
            </div>

            {/* Vista Desktop - Tabla tradicional */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Convocatoria
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                UGEL/Región
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Fechas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Estado/Tipo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Plazas
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                        {convocatorias.data.map((convocatoria) => (
                            <tr key={convocatoria.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {convocatoria.title}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {convocatoria.year} - {convocatoria.creator?.first_name || 'Usuario'} {convocatoria.creator?.last_name || ''}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {convocatoria.ugel?.name || 'Sin UGEL'}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {convocatoria.ugel?.region?.name || 'Sin región'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1 text-xs">
                                        <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                            <Calendar className="h-3 w-3" />
                                            {formatDate(convocatoria.start_date)} - {formatDate(convocatoria.end_date)}
                                        </div>
                                        <div className="flex items-center gap-1 text-gray-500 dark:text-gray-500">
                                            <Clock className="h-3 w-3" />
                                            Inscr: {formatDateTime(convocatoria.registration_start)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col space-y-2">
                                        {getStatusBadge(convocatoria.status)}
                                        {getProcessTypeBadge(convocatoria.process_type)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-white">
                                        <Users className="h-4 w-4" />
                                        {convocatoria.total_plazas || 0}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(convocatoria)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(convocatoria)}
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
                {convocatorias.data.map((convocatoria) => (
                    <div key={convocatoria.id} className="p-6 space-y-4">
                        {/* Header de la convocatoria */}
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                    {convocatoria.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {convocatoria.year} - {convocatoria.creator?.first_name || 'Usuario'} {convocatoria.creator?.last_name || ''}
                                </p>
                            </div>
                            {getStatusBadge(convocatoria.status)}
                        </div>

                        {/* Información de la convocatoria */}
                        <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">UGEL:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{convocatoria.ugel?.name || 'Sin UGEL'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Región:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{convocatoria.ugel?.region?.name || 'Sin región'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500 dark:text-gray-400">Tipo:</span>
                                {getProcessTypeBadge(convocatoria.process_type)}
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Plazas:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{convocatoria.total_plazas || 0}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Periodo:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">
                                    {formatDate(convocatoria.start_date)} - {formatDate(convocatoria.end_date)}
                                </span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Inscripciones:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">
                                    {formatDateTime(convocatoria.registration_start)}
                                </span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(convocatoria)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(convocatoria)}
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
                    data={convocatorias}
                    perPageOptions={[5, 10, 15, 25, 50]}
                    showPerPageSelector={true}
                    showInfo={true}
                />
            </div>
        </div>
    );
}
