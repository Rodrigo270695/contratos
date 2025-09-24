import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import { router } from '@inertiajs/react';
import { Edit, Trash2, School, MapPin } from 'lucide-react';

interface Institution {
    id: number;
    name: string;
    code: string;
    level: 'inicial' | 'primaria' | 'secundaria';
    modality: 'EBR' | 'EBA' | 'EBE';
    address?: string;
    status: 'active' | 'inactive';
    district_id: number;
    district: {
        id: number;
        name: string;
        code: string;
        ugel: {
            id: number;
            name: string;
            code: string;
            region: {
                id: number;
                name: string;
            };
        };
    };
    created_at: string;
    updated_at: string;
}

interface InstitutionTableProps {
    institutions: {
        data: Institution[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    onEdit: (institution: Institution) => void;
    onDelete: (institution: Institution) => void;
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

export default function InstitutionTable({ institutions, onEdit, onDelete }: InstitutionTableProps) {

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
            inactive: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800'
        };

        const labels = {
            active: 'Activo',
            inactive: 'Inactivo'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${variants[status as keyof typeof variants]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getLevelBadge = (level: string) => {
        const variants = {
            inicial: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800',
            primaria: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800',
            secundaria: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800'
        };

        const labels = {
            inicial: 'Inicial',
            primaria: 'Primaria',
            secundaria: 'Secundaria'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${variants[level as keyof typeof variants]}`}>
                {labels[level as keyof typeof labels]}
            </span>
        );
    };

    if (institutions.data.length === 0) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="text-center">
                    <School className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No se encontraron instituciones
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No hay instituciones educativas que coincidan con los filtros aplicados.
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
                        Lista de Instituciones Educativas
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {institutions.from}-{institutions.to} de {institutions.total} instituciones
                    </span>
                </div>
            </div>

            {/* Vista Desktop - Tabla tradicional */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Institución
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Distrito
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Nivel/Modalidad
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Estado
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Creado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-600">
                        {institutions.data.map((institution) => (
                            <tr key={institution.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                                <School className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {institution.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Código: {institution.code}
                                            </div>
                                            {institution.address && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {institution.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {institution.district.name}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {institution.district.ugel.name}
                                    </div>
                                    <div className="text-xs text-gray-400 dark:text-gray-500">
                                        {institution.district.ugel.region.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        {getLevelBadge(institution.level)}
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {institution.modality}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(institution.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(institution.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEdit(institution)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDelete(institution)}
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
                {institutions.data.map((institution) => (
                    <div key={institution.id} className="p-6 space-y-4">
                        {/* Header de la institución */}
                        <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0 h-12 w-12">
                                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                        <School className="h-6 w-6 text-white" />
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                        {institution.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Código: {institution.code}
                                    </p>
                                </div>
                            </div>
                            {getStatusBadge(institution.status)}
                        </div>

                        {/* Información de la institución */}
                        <div className="grid grid-cols-1 gap-3 text-sm">
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Distrito:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{institution.district.name}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">UGEL:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{institution.district.ugel.name}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Región:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{institution.district.ugel.region.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-500 dark:text-gray-400">Nivel:</span>
                                {getLevelBadge(institution.level)}
                                <span className="text-gray-500 dark:text-gray-400">({institution.modality})</span>
                            </div>
                            {institution.address && (
                                <div>
                                    <span className="font-medium text-gray-500 dark:text-gray-400">Dirección:</span>
                                    <span className="ml-2 text-gray-900 dark:text-white">{institution.address}</span>
                                </div>
                            )}
                            <div>
                                <span className="font-medium text-gray-500 dark:text-gray-400">Creado:</span>
                                <span className="ml-2 text-gray-900 dark:text-white">{formatDate(institution.created_at)}</span>
                            </div>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex justify-end space-x-2 pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(institution)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDelete(institution)}
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
                    data={institutions}
                    perPageOptions={[5, 10, 15, 25, 50]}
                    showPerPageSelector={true}
                    showInfo={true}
                />
            </div>
        </div>
    );
}
