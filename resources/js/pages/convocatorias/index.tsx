import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Megaphone, Plus } from 'lucide-react';
import ConvocatoriaTable from '@/components/convocatoria/convocatoria-table';
import ConvocatoriaFilters from '@/components/convocatoria/convocatoria-filters';
import ConvocatoriaFormModal from '@/components/convocatoria/convocatoria-form-modal';
import DeleteConvocatoriaModal from '@/components/convocatoria/delete-convocatoria-modal';
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

interface ConvocatoriasPageProps {
    convocatorias: {
        data: Convocatoria[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    ugels: Ugel[];
    years: number[];
    filters: {
        search?: string;
        ugel_id?: string;
        year?: string;
        process_type?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Convocatorias',
        href: '/convocatorias',
    },
];

export default function ConvocatoriaIndex() {
    const { convocatorias, ugels, years, filters } = usePage<SharedData & ConvocatoriasPageProps>().props;
    const [selectedConvocatoria, setSelectedConvocatoria] = useState<Convocatoria | null>(null);
    const [modalState, setModalState] = useState({
        form: false,
        delete: false,
    });
    const toast = useToast();

    const openCreateModal = () => {
        setSelectedConvocatoria(null);
        setModalState({ form: true, delete: false });
    };

    const openEditModal = (convocatoria: Convocatoria) => {
        setSelectedConvocatoria(convocatoria);
        setModalState({ form: true, delete: false });
    };

    const openDeleteModal = (convocatoria: Convocatoria) => {
        setSelectedConvocatoria(convocatoria);
        setModalState({ form: false, delete: true });
    };

    const closeModals = () => {
        setSelectedConvocatoria(null);
        setModalState({ form: false, delete: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Convocatorias" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <Megaphone className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de Convocatorias
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra las convocatorias de contratación y nombramiento docente
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <ConvocatoriaFilters
                    filters={filters}
                    ugels={ugels}
                    years={years}
                    onNewConvocatoria={openCreateModal}
                />

                {/* Convocatorias Table */}
                <ConvocatoriaTable
                    convocatorias={convocatorias}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                />

                {/* Modales */}
                <ConvocatoriaFormModal
                    isOpen={modalState.form}
                    convocatoria={selectedConvocatoria}
                    ugels={ugels}
                    onClose={closeModals}
                />

                {selectedConvocatoria && (
                    <DeleteConvocatoriaModal
                        isOpen={modalState.delete}
                        convocatoria={selectedConvocatoria}
                        onClose={closeModals}
                    />
                )}

                {/* Botón flotante para móviles */}
                <div className="fixed bottom-6 right-6 sm:hidden z-50">
                    <Button
                        onClick={openCreateModal}
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        title="Crear Convocatoria"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
