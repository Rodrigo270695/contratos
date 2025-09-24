import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { School, Plus } from 'lucide-react';
import InstitutionTable from '@/components/institution/institution-table';
import InstitutionFilters from '@/components/institution/institution-filters';
import InstitutionFormModal from '@/components/institution/institution-form-modal';
import DeleteInstitutionModal from '@/components/institution/delete-institution-modal';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface District {
    id: number;
    name: string;
    code: string;
    ugel: {
        id: number;
        name: string;
        region: {
            id: number;
            name: string;
        };
    };
}

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

interface InstitutionsPageProps {
    institutions: {
        data: Institution[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        from: number;
        to: number;
    };
    districts: District[];
    filters: {
        search?: string;
        district_id?: string;
        level?: string;
        modality?: string;
        status?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
    {
        title: 'Instituciones',
        href: '/institutions',
    },
];

export default function InstitutionIndex() {
    const { institutions, districts, filters } = usePage<SharedData & InstitutionsPageProps>().props;
    const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
    const [modalState, setModalState] = useState({
        form: false,
        delete: false,
    });
    const toast = useToast();

    const openCreateModal = () => {
        setSelectedInstitution(null);
        setModalState({ form: true, delete: false });
    };

    const openEditModal = (institution: Institution) => {
        setSelectedInstitution(institution);
        setModalState({ form: true, delete: false });
    };

    const openDeleteModal = (institution: Institution) => {
        setSelectedInstitution(institution);
        setModalState({ form: false, delete: true });
    };

    const closeModals = () => {
        setSelectedInstitution(null);
        setModalState({ form: false, delete: false });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Instituciones Educativas" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 shadow-lg">
                            <School className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Gestión de Instituciones Educativas
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra las instituciones educativas del sistema
                            </p>
                        </div>
                    </div>
                </div>

                {/* Filters and Actions */}
                <InstitutionFilters
                    filters={filters}
                    districts={districts}
                    onNewInstitution={openCreateModal}
                />

                {/* Institutions Table */}
                <InstitutionTable
                    institutions={institutions}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                />

                {/* Modales */}
                <InstitutionFormModal
                    isOpen={modalState.form}
                    institution={selectedInstitution}
                    districts={districts}
                    onClose={closeModals}
                />

                {selectedInstitution && (
                    <DeleteInstitutionModal
                        isOpen={modalState.delete}
                        institution={selectedInstitution}
                        onClose={closeModals}
                    />
                )}

                {/* Botón flotante para móviles */}
                <div className="fixed bottom-6 right-6 sm:hidden z-50">
                    <Button
                        onClick={openCreateModal}
                        className="h-14 w-14 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 cursor-pointer"
                        title="Crear Institución"
                    >
                        <Plus className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </AppLayout>
    );
}
