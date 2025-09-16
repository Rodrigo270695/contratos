import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import { router } from '@inertiajs/react';
import { Edit, Trash2, MapPin } from 'lucide-react';

interface Region {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

interface RegionTableProps {
    regions: {
        data: Region[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    onEditRegion: (region: Region) => void;
    onDeleteRegion: (region: Region) => void;
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

export default function RegionTable({ regions, onEditRegion, onDeleteRegion }: RegionTableProps) {

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

    if (regions.data.length === 0) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="text-center">
                    <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No se encontraron regiones
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No hay regiones que coincidan con los filtros aplicados.
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
                        Lista de Regiones
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {regions.from}-{regions.to} de {regions.total} regiones
                    </span>
                </div>
            </div>

            {/* Vista Desktop - Tabla tradicional */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Región
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Código
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
                        {regions.data.map((region) => (
                            <tr key={region.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {region.name}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono text-gray-800 dark:text-gray-200">
                                        {region.code}
                                    </code>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(region.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(region.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditRegion(region)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDeleteRegion(region)}
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
                {regions.data.map((region) => (
                    <div key={region.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                    <MapPin className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            {/* Información principal */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {region.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Código: {region.code}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                        {getStatusBadge(region.status)}
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        Creado: {formatDate(region.created_at)}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acciones móviles */}
                        <div className="mt-4 flex items-center justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEditRegion(region)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDeleteRegion(region)}
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
                    data={regions}
                    perPageOptions={[5, 10, 15, 25, 50]}
                    showPerPageSelector={true}
                    showInfo={true}
                />
            </div>
        </div>
    );
}
