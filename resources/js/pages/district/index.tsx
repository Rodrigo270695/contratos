import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Map, Plus } from 'lucide-react';
import DistrictTable from '@/components/district/district-table';
import DistrictFilters from '@/components/district/district-filters';
import DistrictFormModal from '@/components/district/district-form-modal';
import DeleteDistrictModal from '@/components/district/delete-district-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Ugel {
    id: number;
    name: string;
    code: string;
    region: {
        id: number;
        name: string;
    };
}

interface District {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    ugel_id: number;
    ugel: {
        id: number;
        name: string;
        code: string;
        region: {
            id: number;
            name: string;
        };
    };
    created_at: string;
    updated_at: string;
}

interface DistrictsPageProps {
    districts: {
        data: District[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    ugels: Ugel[];
    filters: {
        search?: string;
        status?: string;
        ugel_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Distritos',
        href: '/districts',
    },
];

export default function DistrictIndex() {
    const { districts, ugels, filters } = usePage<SharedData & DistrictsPageProps>().props;
    const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
    const [modalState, setModalState] = useState({
        form: false,
        delete: false,
    });
    const toast = useToast();

    const openCreateModal = () => {
        setSelectedDistrict(null);
        setModalState({ form: true, delete: false });
    };

    const openEditModal = (district: District) => {
        setSelectedDistrict(district);
        setModalState({ form: true, delete: false });
    };

    const openDeleteModal = (district: District) => {
        setSelectedDistrict(district);
        setModalState({ form: false, delete: true });
    };

    const closeModals = () => {
        setSelectedDistrict(null);
        setModalState({ form: false, delete: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Distritos" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <Map className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de Distritos
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra los distritos del sistema educativo
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <DistrictFilters
                    filters={filters}
                    ugels={ugels}
                    onNewDistrict={openCreateModal}
                />

                {/* Districts Table */}
                <DistrictTable
                    districts={districts}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                />

                {/* Modales */}
                <DistrictFormModal
                    isOpen={modalState.form}
                    district={selectedDistrict}
                    ugels={ugels}
                    onClose={closeModals}
                />

                {selectedDistrict && (
                    <DeleteDistrictModal
                        isOpen={modalState.delete}
                        district={selectedDistrict}
                        onClose={closeModals}
                    />
                )}

                {/* Botón flotante para móviles */}
                <div className="fixed bottom-6 right-6 sm:hidden z-50">
                    <Button
                        onClick={openCreateModal}
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        title="Crear Distrito"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
