import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

interface Ugel {
    id: number;
    name: string;
    code: string;
    region: {
        name: string;
    };
}

interface DeleteUgelModalProps {
    isOpen: boolean;
    ugel: Ugel;
    onClose: () => void;
}

export default function DeleteUgelModal({ isOpen, ugel, onClose }: DeleteUgelModalProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/ugels/${ugel.id}`, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const handleClose = () => {
        if (!processing) {
            onClose();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-red-900 dark:text-red-100">
                                Eliminar UGEL
                            </DialogTitle>
                            <DialogDescription>
                                Esta acción no se puede deshacer
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <div className="rounded-lg bg-red-50 border border-red-200 p-4 dark:bg-red-900/10 dark:border-red-800">
                        <p className="text-sm text-red-800 dark:text-red-200 mb-3">
                            ¿Estás seguro que deseas eliminar la siguiente UGEL?
                        </p>
                        <div className="space-y-2">
                            <div className="text-sm">
                                <span className="font-medium text-red-900 dark:text-red-100">Nombre:</span>
                                <span className="ml-2 text-red-700 dark:text-red-300">{ugel.name}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-red-900 dark:text-red-100">Código:</span>
                                <span className="ml-2 text-red-700 dark:text-red-300">{ugel.code}</span>
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-red-900 dark:text-red-100">Región:</span>
                                <span className="ml-2 text-red-700 dark:text-red-300">{ugel.region.name}</span>
                            </div>
                        </div>
                        <p className="text-sm text-red-800 dark:text-red-200 mt-3 font-medium">
                            Se eliminarán todos los datos asociados a esta UGEL.
                        </p>
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                        disabled={processing}
                        className="cursor-pointer"
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        disabled={processing}
                        className="bg-red-600 hover:bg-red-700 cursor-pointer"
                    >
                        {processing ? 'Eliminando...' : 'Eliminar UGEL'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
