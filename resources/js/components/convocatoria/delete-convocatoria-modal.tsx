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

interface DeleteConvocatoriaModalProps {
    isOpen: boolean;
    onClose: () => void;
    convocatoria: Convocatoria | null;
}

export default function DeleteConvocatoriaModal({
    isOpen,
    onClose,
    convocatoria
}: DeleteConvocatoriaModalProps) {
    const [isDeleting, setIsDeleting] = React.useState(false);

    const handleDelete = () => {
        if (!convocatoria) return;

        setIsDeleting(true);
        router.delete(`/convocatorias/${convocatoria.id}`, {
            onSuccess: () => {
                setIsDeleting(false);
                onClose();
            },
            onError: () => {
                setIsDeleting(false);
            },
        });
    };

    if (!convocatoria) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <AlertTriangle className="h-6 w-6 text-red-600" />
                        </div>
                        <div>
                            <DialogTitle>Eliminar Convocatoria</DialogTitle>
                            <DialogDescription>
                                Esta acción no se puede deshacer. La convocatoria será eliminada permanentemente.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Convocatoria a eliminar:
                        </h4>
                        <div className="mt-2 space-y-1 text-sm text-gray-600 dark:text-gray-300">
                            <p>
                                <span className="font-medium">Título:</span> {convocatoria.title}
                            </p>
                            <p>
                                <span className="font-medium">Año:</span> {convocatoria.year}
                            </p>
                            <p>
                                <span className="font-medium">UGEL:</span> {convocatoria.ugel.name}
                            </p>
                            <p>
                                <span className="font-medium">Tipo:</span> {' '}
                                {convocatoria.process_type === 'contratacion' ? 'Contratación' : 'Nombramiento'}
                            </p>
                            <p>
                                <span className="font-medium">Estado:</span> {' '}
                                {convocatoria.status === 'draft' && 'Borrador'}
                                {convocatoria.status === 'published' && 'Publicado'}
                                {convocatoria.status === 'active' && 'Activo'}
                                {convocatoria.status === 'closed' && 'Cerrado'}
                                {convocatoria.status === 'cancelled' && 'Cancelado'}
                            </p>
                            {convocatoria.total_plazas > 0 && (
                                <p>
                                    <span className="font-medium">Plazas:</span> {convocatoria.total_plazas}
                                </p>
                            )}
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
                                    Si esta convocatoria tiene plazas o postulaciones asociadas, no podrá ser eliminada.
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
                        {isDeleting ? 'Eliminando...' : 'Eliminar Convocatoria'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
