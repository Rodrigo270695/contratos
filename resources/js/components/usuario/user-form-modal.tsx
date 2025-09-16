import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import InputError from '@/components/input-error';
import { useForm } from '@inertiajs/react';
import { UserPlus, Edit, Eye, EyeOff, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';

interface User {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    phone?: string;
    user_type: 'admin' | 'docente';
    status: 'active' | 'inactive' | 'pending';
}

interface UserFormModalProps {
    isOpen: boolean;
    user?: User | null; // Si hay user, es edición; si no, es creación
    onClose: () => void;
}

export default function UserFormModal({ isOpen, user, onClose }: UserFormModalProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const isEditing = !!user;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        first_name: '',
        last_name: '',
        dni: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        user_type: 'admin' as 'admin' | 'docente',
        status: 'active' as 'active' | 'inactive' | 'pending',
    });

    useEffect(() => {
        if (user && isOpen) {
            // Modo edición - cargar datos del usuario
            setData({
                first_name: user.first_name,
                last_name: user.last_name,
                dni: user.dni,
                email: user.email,
                phone: user.phone || '',
                password: '',
                password_confirmation: '',
                user_type: user.user_type,
                status: user.status,
            });
        } else if (!user && isOpen) {
            // Modo creación - valores por defecto
            setData({
                first_name: '',
                last_name: '',
                dni: '',
                email: '',
                phone: '',
                password: '',
                password_confirmation: '',
                user_type: 'admin',
                status: 'active',
            });
        }
    }, [user, isOpen, setData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && user) {
            // Actualizar usuario existente
            put(`/usuarios/${user.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            // Crear nuevo usuario
            post('/usuarios', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center space-x-2 text-xl font-semibold text-gray-900 dark:text-white">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                            {isEditing ? (
                                <Edit className="h-5 w-5 text-white" />
                            ) : (
                                <UserPlus className="h-5 w-5 text-white" />
                            )}
                        </div>
                        <span>
                            {isEditing ? 'Editar Administrador' : 'Crear Nuevo Administrador'}
                        </span>
                    </DialogTitle>
                    <DialogDescription className="text-sm text-gray-600 dark:text-gray-400">
                        {isEditing
                            ? 'Modifica los datos del usuario administrador. Los campos marcados con * son obligatorios.'
                            : 'Complete los datos para crear un nuevo usuario administrador. Los campos marcados con * son obligatorios.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    {/* Información Personal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                            Información Personal
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nombres <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="first_name"
                                    type="text"
                                    value={data.first_name}
                                    onChange={(e) => setData('first_name', e.target.value)}
                                    className="w-full"
                                    placeholder="Ingrese los nombres"
                                    required
                                />
                                <InputError message={errors.first_name} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="last_name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Apellidos <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="last_name"
                                    type="text"
                                    value={data.last_name}
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    className="w-full"
                                    placeholder="Ingrese los apellidos"
                                    required
                                />
                                <InputError message={errors.last_name} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="dni" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    DNI <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="dni"
                                    type="text"
                                    value={data.dni}
                                    onChange={(e) => setData('dni', e.target.value.replace(/\D/g, '').slice(0, 8))}
                                    className="w-full font-mono text-center tracking-widest"
                                    placeholder="12345678"
                                    maxLength={8}
                                    required
                                />
                                <InputError message={errors.dni} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Teléfono
                                </Label>
                                <Input
                                    id="phone"
                                    type="text"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value.replace(/\D/g, '').slice(0, 9))}
                                    className="w-full font-mono text-center tracking-widest"
                                    placeholder="987654321"
                                    maxLength={9}
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full"
                                placeholder="usuario@ugel.gob.pe"
                                required
                            />
                            <InputError message={errors.email} />
                        </div>
                    </div>

                    {/* Configuración de Acceso */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600 pb-2">
                            Configuración de Acceso
                        </h3>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="user_type" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Tipo de Usuario <span className="text-red-500">*</span>
                                </Label>
                                <div className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                                    <div className="flex items-center space-x-2">
                                        <Shield className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                                        <span className="font-medium">👑 Administrador</span>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    Solo se pueden {isEditing ? 'mantener' : 'crear'} usuarios administradores.
                                </p>
                                <InputError message={errors.user_type} />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Estado <span className="text-red-500">*</span>
                                </Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value as 'active' | 'inactive' | 'pending')}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    required
                                >
                                    <option value="active">✅ Activo</option>
                                    <option value="pending">⏳ Pendiente</option>
                                    <option value="inactive">❌ Inactivo</option>
                                </select>
                                <InputError message={errors.status} />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Contraseña {isEditing ? '' : <span className="text-red-500">*</span>}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full pr-10"
                                        placeholder="••••••••"
                                        required={!isEditing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password} />
                                {isEditing && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Dejar vacío para mantener la contraseña actual
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Confirmar Contraseña {isEditing ? '' : <span className="text-red-500">*</span>}
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password_confirmation"
                                        type={showPasswordConfirmation ? 'text' : 'password'}
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full pr-10"
                                        placeholder="••••••••"
                                        required={!isEditing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 cursor-pointer"
                                    >
                                        {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                <InputError message={errors.password_confirmation} />
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
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
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                        >
                            {processing ? (
                                <div className="flex items-center space-x-2">
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                    <span>{isEditing ? 'Guardando...' : 'Creando...'}</span>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    {isEditing ? (
                                        <>
                                            <Edit className="h-4 w-4" />
                                            <span>Guardar Cambios</span>
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="h-4 w-4" />
                                            <span>Crear Administrador</span>
                                        </>
                                    )}
                                </div>
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
