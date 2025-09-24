import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import { router } from '@inertiajs/react';
import { Edit, Trash2, Building2, Phone, Mail, MapPin } from 'lucide-react';

interface Ugel {
    id: number;
    name: string;
    code: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    status: 'active' | 'inactive';
    region: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface UgelTableProps {
    ugels: {
        data: Ugel[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    onEditUgel: (ugel: Ugel) => void;
    onDeleteUgel: (ugel: Ugel) => void;
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

export default function UgelTable({ ugels, onEditUgel, onDeleteUgel }: UgelTableProps) {

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

    if (ugels.data.length === 0) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="text-center">
                    <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No se encontraron UGELs
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No hay UGELs que coincidan con los filtros aplicados.
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
                        Lista de UGELs
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {ugels.from}-{ugels.to} de {ugels.total} UGELs
                    </span>
                </div>
            </div>

            {/* Vista Desktop - Tabla tradicional */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                UGEL
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Región
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Contacto
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
                        {ugels.data.map((ugel) => (
                            <tr key={ugel.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                                <Building2 className="h-5 w-5 text-white" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {ugel.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Código: {ugel.code}
                                            </div>
                                            {ugel.address && (
                                                <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 mt-1">
                                                    <MapPin className="h-3 w-3" />
                                                    {ugel.address}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {ugel.region.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="space-y-1">
                                        {ugel.phone && (
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Phone className="h-3 w-3" />
                                                {ugel.phone}
                                            </div>
                                        )}
                                        {ugel.email && (
                                            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                                <Mail className="h-3 w-3" />
                                                {ugel.email}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(ugel.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(ugel.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onEditUgel(ugel)}
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </Button>

                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onDeleteUgel(ugel)}
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
                {ugels.data.map((ugel) => (
                    <div key={ugel.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                            </div>

                            {/* Información principal */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                            {ugel.name}
                                        </p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {ugel.region.name} - {ugel.code}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-1">
                                        {getStatusBadge(ugel.status)}
                                    </div>
                                </div>

                                {/* Información adicional */}
                                <div className="mt-2 space-y-1">
                                    {ugel.address && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <MapPin className="h-3 w-3" />
                                            {ugel.address}
                                        </div>
                                    )}
                                    {ugel.phone && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Phone className="h-3 w-3" />
                                            {ugel.phone}
                                        </div>
                                    )}
                                    {ugel.email && (
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                            <Mail className="h-3 w-3" />
                                            {ugel.email}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Creado: {formatDate(ugel.created_at)}
                                </div>
                            </div>
                        </div>

                        {/* Acciones móviles */}
                        <div className="mt-4 flex items-center justify-end space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEditUgel(ugel)}
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onDeleteUgel(ugel)}
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
                    data={ugels}
                    perPageOptions={[5, 10, 15, 25, 50]}
                    showPerPageSelector={true}
                    showInfo={true}
                />
            </div>
        </div>
    );
}
