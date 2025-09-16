import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, UserPlus } from 'lucide-react';
import UserTable from '@/components/usuario/user-table';
import UserFilters from '@/components/usuario/user-filters';
import UserFormModal from '@/components/usuario/user-form-modal';
import DeleteUserModal from '@/components/usuario/delete-user-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

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

interface UsersPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        user_type?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
];

export default function UsuarioIndex() {
    const { users, filters } = usePage<SharedData & UsersPageProps>().props;
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [modalState, setModalState] = useState({
        form: false,
        delete: false,
    });
    const toast = useToast();

    const openCreateModal = () => {
        setSelectedUser(null);
        setModalState({ form: true, delete: false });
    };

    const openEditModal = (user: User) => {
        setSelectedUser(user);
        setModalState({ form: true, delete: false });
    };

    const openDeleteModal = (user: User) => {
        setSelectedUser(user);
        setModalState({ form: false, delete: true });
    };

    const closeModals = () => {
        setSelectedUser(null);
        setModalState({ form: false, delete: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Usuarios" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de Usuarios
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra usuarios del sistema UGEL Lambayeque
                            </p>
                        </div>
                    </div>

                </div>


                {/* Filters and Actions */}
                <UserFilters
                    filters={filters}
                    onCreateUser={openCreateModal}
                />

                {/* Users Table */}
                <UserTable
                    users={users}
                    onEditUser={openEditModal}
                    onDeleteUser={openDeleteModal}
                />

                {/* Modales */}
                <UserFormModal
                    isOpen={modalState.form}
                    user={selectedUser}
                    onClose={closeModals}
                />

                {selectedUser && (
                    <DeleteUserModal
                        isOpen={modalState.delete}
                        user={selectedUser}
                        onClose={closeModals}
                    />
                )}

                {/* Botón flotante para móviles */}
                <div className="fixed bottom-6 right-6 sm:hidden z-50">
                    <Button
                        onClick={openCreateModal}
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        title="Crear Administrador"
                    >
                        <UserPlus className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
