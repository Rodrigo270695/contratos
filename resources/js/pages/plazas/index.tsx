import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Briefcase, Plus } from 'lucide-react';
import PlazaTable from '@/components/plaza/plaza-table';
import PlazaFilters from '@/components/plaza/plaza-filters';
import PlazaFormModal from '@/components/plaza/plaza-form-modal';
import DeletePlazaModal from '@/components/plaza/delete-plaza-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface Convocatoria {
    id: number;
    title: string;
    year: number;
}

interface Institution {
    id: number;
    name: string;
    code: string;
    district: {
        id: number;
        name: string;
        ugel: {
            id: number;
            name: string;
            region: {
                id: number;
                name: string;
            };
        };
    };
}

interface Plaza {
    id: number;
    convocatoria_id: number;
    institution_id: number;
    codigo_plaza: string;
    cargo: string;
    nivel: 'inicial' | 'primaria' | 'secundaria';
    especialidad?: string;
    jornada: '25' | '30' | '40';
    vacantes: number;
    motivo_vacante: string;
    requisitos?: string;
    status: 'active' | 'filled' | 'cancelled';
    convocatoria: {
        id: number;
        title: string;
        year: number;
        ugel: {
            id: number;
            name: string;
            region: {
                id: number;
                name: string;
            };
        };
    };
    institution: {
        id: number;
        name: string;
        code: string;
        district: {
            id: number;
            name: string;
            ugel: {
                id: number;
                name: string;
                region: {
                    id: number;
                    name: string;
                };
            };
        };
    };
    created_at: string;
    updated_at: string;
}

interface PlazasPageProps {
    plazas: {
        data: Plaza[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    convocatorias: Convocatoria[];
    institutions: Institution[];
    filters: {
        search?: string;
        convocatoria_id?: string;
        institution_id?: string;
        nivel?: string;
        jornada?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Plazas',
        href: '/plazas',
    },
];

export default function PlazaIndex() {
    const { plazas, convocatorias, institutions, filters } = usePage<SharedData & PlazasPageProps>().props;
    const [selectedPlaza, setSelectedPlaza] = useState<Plaza | null>(null);
    const [modalState, setModalState] = useState({
        form: false,
        delete: false,
    });
    const toast = useToast();

    const openCreateModal = () => {
        setSelectedPlaza(null);
        setModalState({ form: true, delete: false });
    };

    const openEditModal = (plaza: Plaza) => {
        setSelectedPlaza(plaza);
        setModalState({ form: true, delete: false });
    };

    const openDeleteModal = (plaza: Plaza) => {
        setSelectedPlaza(plaza);
        setModalState({ form: false, delete: true });
    };

    const closeModals = () => {
        setSelectedPlaza(null);
        setModalState({ form: false, delete: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Plazas" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <Briefcase className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de Plazas
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra las plazas disponibles en las convocatorias docentes
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <PlazaFilters
                    filters={filters}
                    convocatorias={convocatorias}
                    institutions={institutions}
                    onNewPlaza={openCreateModal}
                />

                {/* Plazas Table */}
                <PlazaTable
                    plazas={plazas}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                />

                {/* Modales */}
                <PlazaFormModal
                    isOpen={modalState.form}
                    plaza={selectedPlaza}
                    convocatorias={convocatorias}
                    institutions={institutions}
                    onClose={closeModals}
                />

                {selectedPlaza && (
                    <DeletePlazaModal
                        isOpen={modalState.delete}
                        plaza={selectedPlaza}
                        onClose={closeModals}
                    />
                )}

                {/* Botón flotante para móviles */}
                <div className="fixed bottom-6 right-6 sm:hidden z-50">
                    <Button
                        onClick={openCreateModal}
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        title="Crear Plaza"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
