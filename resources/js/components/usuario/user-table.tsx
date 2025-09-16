import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Pagination from '@/components/ui/pagination';
import { router } from '@inertiajs/react';
import { Edit, Trash2, User, Shield, GraduationCap } from 'lucide-react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    phone?: string;
    user_type: 'admin' | 'docente';
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
    updated_at: string;
}

interface UserTableProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    onEditUser: (user: User) => void;
    onDeleteUser: (user: User) => void;
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

export default function UserTable({ users, onEditUser, onDeleteUser }: UserTableProps) {

    const getStatusBadge = (status: string) => {
        const variants = {
            active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800',
            inactive: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800',
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800'
        };

        const labels = {
            active: 'Activo',
            inactive: 'Inactivo',
            pending: 'Pendiente'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${variants[status as keyof typeof variants]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    const getUserTypeIcon = (userType: string) => {
        return userType === 'admin' ? (
            <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        ) : (
            <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        );
    };

    const getUserTypeBadge = (userType: string) => {
        return userType === 'admin' ? (
            <span className="inline-flex items-center space-x-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800 border border-purple-200 dark:bg-purple-900/20 dark:text-purple-300 dark:border-purple-800">
                <Shield className="h-3 w-3" />
                <span>Admin</span>
            </span>
        ) : (
            <span className="inline-flex items-center space-x-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 border border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800">
                <GraduationCap className="h-3 w-3" />
                <span>Docente</span>
            </span>
        );
    };

    if (users.data.length === 0) {
        return (
            <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                <div className="text-center">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                        No se encontraron usuarios
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        No hay usuarios que coincidan con los filtros aplicados.
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
                        Lista de Usuarios
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {users.from}-{users.to} de {users.total} usuarios
                    </span>
                </div>
            </div>

            {/* Vista Desktop - Tabla tradicional */}
            <div className="hidden lg:block overflow-x-auto">
                <table className="w-full divide-y divide-gray-200 dark:divide-gray-600">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Usuario
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Contacto
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-300">
                                Tipo
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
                        {users.data.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                                <span className="text-sm font-medium text-white">
                                                    {user.first_name.charAt(0).toUpperCase()}
                                                    {user.last_name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                {user.first_name} {user.last_name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                DNI: {user.dni}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900 dark:text-white">
                                        {user.email}
                                    </div>
                                    {user.phone && (
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {user.phone}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getUserTypeBadge(user.user_type)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {getStatusBadge(user.status)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(user.created_at)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        {/* Botón editar solo para administradores */}
                                        {user.user_type === 'admin' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onEditUser(user)}
                                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Botón eliminar solo para administradores */}
                                        {user.user_type === 'admin' && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => onDeleteUser(user)}
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 dark:border-red-700 cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}

                                        {/* Mensaje para docentes */}
                                        {user.user_type === 'docente' && (
                                            <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                                                Solo lectura
                                            </span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Vista Mobile - Cards */}
            <div className="lg:hidden divide-y divide-gray-200 dark:divide-gray-600">
                {users.data.map((user) => (
                    <div key={user.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        <div className="flex items-center space-x-3">
                            {/* Avatar */}
                            <div className="flex-shrink-0">
                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                                    <span className="text-sm font-medium text-white">
                                        {user.first_name.charAt(0).toUpperCase()}
                                        {user.last_name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            </div>

                            {/* Información principal */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                        {user.first_name} {user.last_name}
                                    </h4>
                                    {getUserTypeBadge(user.user_type)}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                    DNI: {user.dni}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-300 truncate mb-1">
                                    {user.email}
                                </p>
                                {user.phone && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                        📱 {user.phone}
                                    </p>
                                )}
                                <div className="flex items-center space-x-2 mt-2">
                                    {getStatusBadge(user.status)}
                                    <span className="text-xs text-gray-400 dark:text-gray-500">
                                        {formatDate(user.created_at)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Separador y Acciones móvil */}
                        {user.user_type === 'admin' ? (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex justify-end space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEditUser(user)}
                                        className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 dark:border-blue-700 cursor-pointer"
                                        title="Editar usuario"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onDeleteUser(user)}
                                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 dark:border-red-700 cursor-pointer"
                                        title="Eliminar usuario"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                                <div className="flex justify-end">
                                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                                        Solo lectura
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 dark:bg-gray-700 dark:border-gray-600">
                <Pagination
                    data={users}
                    perPageOptions={[5, 10, 15, 25, 50]}
                    showPerPageSelector={true}
                    showInfo={true}
                />
            </div>
        </div>
    );
}
