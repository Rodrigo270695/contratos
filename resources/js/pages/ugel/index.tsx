import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Building2, Plus } from 'lucide-react';
import UgelTable from '@/components/ugel/ugel-table';
import UgelFilters from '@/components/ugel/ugel-filters';
import UgelFormModal from '@/components/ugel/ugel-form-modal';
import DeleteUgelModal from '@/components/ugel/delete-ugel-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Region {
    id: number;
    name: string;
}

interface Ugel {
    id: number;
    name: string;
    code: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    status: 'active' | 'inactive';
    region_id: number;
    region: {
        id: number;
        name: string;
    };
    created_at: string;
    updated_at: string;
}

interface UgelsPageProps {
    ugels: {
        data: Ugel[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    regions: Region[];
    filters: {
        search?: string;
        status?: string;
        region_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'UGELs',
        href: '/ugels',
    },
];

export default function UgelIndex() {
    const { ugels, regions, filters } = usePage<SharedData & UgelsPageProps>().props;
    const [selectedUgel, setSelectedUgel] = useState<Ugel | null>(null);
    const [modalState, setModalState] = useState({
        form: false,
        delete: false,
    });
    const toast = useToast();

    const openCreateModal = () => {
        setSelectedUgel(null);
        setModalState({ form: true, delete: false });
    };

    const openEditModal = (ugel: Ugel) => {
        setSelectedUgel(ugel);
        setModalState({ form: true, delete: false });
    };

    const openDeleteModal = (ugel: Ugel) => {
        setSelectedUgel(ugel);
        setModalState({ form: false, delete: true });
    };

    const closeModals = () => {
        setSelectedUgel(null);
        setModalState({ form: false, delete: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de UGELs" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <Building2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de UGELs
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra las Unidades de Gestión Educativa Local del sistema
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <UgelFilters
                    filters={filters}
                    regions={regions}
                    onCreateUgel={openCreateModal}
                />

                {/* UGELs Table */}
                <UgelTable
                    ugels={ugels}
                    onEditUgel={openEditModal}
                    onDeleteUgel={openDeleteModal}
                />

                {/* Modales */}
                <UgelFormModal
                    isOpen={modalState.form}
                    ugel={selectedUgel}
                    regions={regions}
                    onClose={closeModals}
                />

                {selectedUgel && (
                    <DeleteUgelModal
                        isOpen={modalState.delete}
                        ugel={selectedUgel}
                        onClose={closeModals}
                    />
                )}

                {/* Botón flotante para móviles */}
                <div className="fixed bottom-6 right-6 sm:hidden z-50">
                    <Button
                        onClick={openCreateModal}
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        title="Crear UGEL"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
