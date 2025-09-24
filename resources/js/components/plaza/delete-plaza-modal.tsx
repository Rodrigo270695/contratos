import React from 'react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

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

interface DeletePlazaModalProps {
    isOpen: boolean;
    onClose: () => void;
    plaza: Plaza | null;
}

export default function DeletePlazaModal({
    isOpen,
    onClose,
    plaza
}: DeletePlazaModalProps) {
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = () => {
        if (!plaza) return;

        setIsDeleting(true);
        router.delete(`/plazas/${plaza.id}`, {
            onSuccess: () => {
                setIsDeleting(false);
                onClose();
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    if (!plaza) return null;

    const getNivelLabel = (nivel: string) => {
        const labels = {
            inicial: 'Inicial',
            primaria: 'Primaria',
            secundaria: 'Secundaria'
        };
        return labels[nivel as keyof typeof labels] || nivel;
    };

    const getStatusLabel = (status: string) => {
        const labels = {
            active: 'Activo',
            filled: 'Ocupado',
            cancelled: 'Cancelado'
        };
        return labels[status as keyof typeof labels] || status;
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle>Eliminar Plaza</DialogTitle>
                            <DialogDescription>
                                Esta acción no se puede deshacer. La plaza será eliminada permanentemente.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Plaza a eliminar:
                        </h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            <p>
                                <span className="font-medium">Código:</span> {plaza.codigo_plaza}
                            </p>
                            <p>
                                <span className="font-medium">Cargo:</span> {plaza.cargo}
                            </p>
                            <p>
                                <span className="font-medium">Nivel:</span> {getNivelLabel(plaza.nivel)}
                            </p>
                            {plaza.especialidad && (
                                <p>
                                    <span className="font-medium">Especialidad:</span> {plaza.especialidad}
                                </p>
                            )}
                            <p>
                                <span className="font-medium">Institución:</span> {plaza.institution?.name || 'Sin institución'}
                            </p>
                            <p>
                                <span className="font-medium">Convocatoria:</span> {plaza.convocatoria?.title || 'Sin convocatoria'} ({plaza.convocatoria?.year || ''})
                            </p>
                            <p>
                                <span className="font-medium">Vacantes:</span> {plaza.vacantes}
                            </p>
                            <p>
                                <span className="font-medium">Jornada:</span> {plaza.jornada} horas
                            </p>
                            <p>
                                <span className="font-medium">Estado:</span> {getStatusLabel(plaza.status)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-red-50 p-4 dark:bg-red-900/20">
                        <div className="flex">
                            <AlertTriangle className="h-5 w-5 text-red-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                                    ¡Atención!
                                </h3>
                                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                    Si esta plaza tiene postulaciones asociadas, no podrá ser eliminada.
                                    Asegúrate de que no existan dependencias antes de continuar.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="cursor-pointer"
                    >
                        {isDeleting ? 'Eliminando...' : 'Eliminar Plaza'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
