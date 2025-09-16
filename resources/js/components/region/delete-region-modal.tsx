import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';

interface Region {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

interface DeleteRegionModalProps {
    isOpen: boolean;
    region: Region;
    onClose: () => void;
}

export default function DeleteRegionModal({ isOpen, region, onClose }: DeleteRegionModalProps) {
    const toast = useToast();
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/regiones/${region.id}`, {
            onSuccess: () => {
                toast.success('Región eliminada exitosamente');
                onClose();
            },
            onError: (errors) => {
                if (errors.message) {
                    toast.error(errors.message);
                } else {
                    toast.error('Ocurrió un error al eliminar la región');
                }
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-3 text-xl font-semibold text-red-600">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        Confirmar Eliminación
                    </DialogTitle>
                    <DialogDescription className="text-base">
                        ¿Estás seguro de que deseas eliminar la región <strong>{region.name}</strong>?
                        Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>

                <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 p-4 border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                            <p className="font-medium mb-1">¡Atención!</p>
                            <p>
                                Si esta región tiene UGELs asociadas, no podrá ser eliminada.
                                Primero debes reasignar o eliminar todas las UGELs relacionadas.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-4">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">
                        Datos de la región:
                    </h4>
                    <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                        <p><span className="font-medium">Nombre:</span> {region.name}</p>
                        <p><span className="font-medium">Código:</span> {region.code}</p>
                        <p><span className="font-medium">Estado:</span> {region.status === 'active' ? 'Activo' : 'Inactivo'}</p>
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
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
                        className="cursor-pointer"
                    >
                        {processing ? 'Eliminando...' : 'Eliminar Región'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
