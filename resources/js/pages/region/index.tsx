import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { MapPin, Plus } from 'lucide-react';
import RegionTable from '@/components/region/region-table';
import RegionFilters from '@/components/region/region-filters';
import RegionFormModal from '@/components/region/region-form-modal';
import DeleteRegionModal from '@/components/region/delete-region-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Region {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

interface RegionsPageProps {
    regions: {
        data: Region[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Regiones',
        href: '/regiones',
    },
];

export default function RegionIndex() {
    const { regions, filters } = usePage<SharedData & RegionsPageProps>().props;
    const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
    const [modalState, setModalState] = useState({
        form: false,
        delete: false,
    });
    const toast = useToast();

    const openCreateModal = () => {
        setSelectedRegion(null);
        setModalState({ form: true, delete: false });
    };

    const openEditModal = (region: Region) => {
        setSelectedRegion(region);
        setModalState({ form: true, delete: false });
    };

    const openDeleteModal = (region: Region) => {
        setSelectedRegion(region);
        setModalState({ form: false, delete: true });
    };

    const closeModals = () => {
        setSelectedRegion(null);
        setModalState({ form: false, delete: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Regiones" />

            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <MapPin className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de Regiones
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra regiones del sistema UGEL Lambayeque
                            </p>
                        </div>
                    </div>

                </div>


                {/* Filters and Actions */}
                <RegionFilters
                    filters={filters}
                    onCreateRegion={openCreateModal}
                />

                {/* Regions Table */}
                <RegionTable
                    regions={regions}
                    onEditRegion={openEditModal}
                    onDeleteRegion={openDeleteModal}
                />

                {/* Modales */}
                <RegionFormModal
                    isOpen={modalState.form}
                    region={selectedRegion}
                    onClose={closeModals}
                />

                {selectedRegion && (
                    <DeleteRegionModal
                        isOpen={modalState.delete}
                        region={selectedRegion}
                        onClose={closeModals}
                    />
                )}

                {/* Botón flotante para móviles */}
                <div className="fixed bottom-6 right-6 sm:hidden z-50">
                    <Button
                        onClick={openCreateModal}
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        title="Crear Región"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
