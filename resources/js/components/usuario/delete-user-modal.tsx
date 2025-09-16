import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { Trash2, AlertTriangle } from 'lucide-react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    user_type: 'admin' | 'docente';
    status: 'active' | 'inactive' | 'pending';
}

interface DeleteUserModalProps {
    isOpen: boolean;
    user: User;
    onClose: () => void;
}

export default function DeleteUserModal({ isOpen, user, onClose }: DeleteUserModalProps) {
    const { delete: destroy, processing } = useForm();

    const handleDelete = () => {
        destroy(`/usuarios/${user.id}`, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-red-600 dark:text-red-400">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                            <Trash2 className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                        <span>Eliminar Usuario</span>
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        Esta acción eliminará permanentemente el usuario y toda la información asociada. Esta acción no se puede deshacer.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    {/* Advertencia */}
                    <div className="flex items-start space-x-3 rounded-lg bg-yellow-50 p-4 border border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800">
                        <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-800 dark:text-yellow-200">
                            <p className="font-medium mb-1">⚠️ Esta acción no se puede deshacer</p>
                            <p>
                                Se eliminará permanentemente el usuario y toda la información asociada.
                            </p>
                        </div>
                    </div>

                    {/* Información del usuario */}
                    <div className="rounded-lg bg-gray-50 p-4 border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                            Usuario a eliminar:
                        </h4>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Nombre:</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {user.first_name} {user.last_name}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">DNI:</span>
                                <span className="text-sm font-mono text-gray-900 dark:text-white">
                                    {user.dni}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                                <span className="text-sm text-gray-900 dark:text-white">
                                    {user.email}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Tipo:</span>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    user.user_type === 'admin'
                                        ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                                        : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                                }`}>
                                    {user.user_type === 'admin' ? '👑 Administrador' : '🎓 Docente'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Estado:</span>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    user.status === 'active'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                        : user.status === 'inactive'
                                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                                }`}>
                                    {user.status === 'active' ? '✅ Activo' : user.status === 'inactive' ? '❌ Inactivo' : '⏳ Pendiente'}
                                </span>
                            </div>
                        </div>
                    </div>


                    {/* Botones */}
                    <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
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
                            onClick={handleDelete}
                            disabled={processing}
                            className="bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {processing ? (
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>Eliminando...</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Trash2 className="h-4 w-4" />
                                    <span>Eliminar Usuario</span>
                                </div>
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
