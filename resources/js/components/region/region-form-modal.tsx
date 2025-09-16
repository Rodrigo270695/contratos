import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from '@inertiajs/react';
import { MapPin, Plus } from 'lucide-react';
import { useEffect } from 'react';

interface Region {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

interface RegionFormModalProps {
    isOpen: boolean;
    region?: Region | null;
    onClose: () => void;
}

export default function RegionFormModal({ isOpen, region, onClose }: RegionFormModalProps) {
    const isEditing = !!region;
    const toast = useToast();

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        code: '',
        status: 'active' as 'active' | 'inactive',
    });

    // Resetear el formulario cuando se abre/cierra el modal o cambia la región
    useEffect(() => {
        if (isOpen) {
            if (region) {
                setData({
                    name: region.name,
                    code: region.code,
                    status: region.status,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [isOpen, region]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const onSuccess = () => {
            toast.success(
                isEditing
                    ? 'Región actualizada exitosamente'
                    : 'Región creada exitosamente'
            );
            onClose();
        };

        const onError = () => {
            toast.error('Ocurrió un error. Por favor, revisa los campos.');
        };

        if (isEditing && region) {
            put(`/regiones/${region.id}`, {
                onSuccess,
                onError,
            });
        } else {
            post('/regiones', {
                onSuccess,
                onError,
            });
        }
    };

    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                            {isEditing ? (
                                <MapPin className="h-4 w-4 text-white" />
                            ) : (
                                <Plus className="h-4 w-4 text-white" />
                            )}
                        </div>
                        {isEditing ? 'Editar Región' : 'Crear Nueva Región'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Modifica los datos de la región seleccionada.'
                            : 'Completa la información para crear una nueva región.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4">
                        {/* Nombre de la región */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">
                                Nombre de la Región <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                placeholder="Ej: Lambayeque"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={errors.name ? 'border-red-500' : ''}
                                required
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Código */}
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-sm font-medium">
                                Código <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="code"
                                type="text"
                                placeholder="Ej: LAM"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                className={errors.code ? 'border-red-500' : ''}
                                maxLength={10}
                                required
                            />
                            {errors.code && (
                                <p className="text-sm text-red-600">{errors.code}</p>
                            )}
                            <p className="text-xs text-gray-500">
                                Solo letras mayúsculas y números (máx. 10 caracteres)
                            </p>
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <Label htmlFor="status" className="text-sm font-medium">
                                Estado <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.status} onValueChange={(value: 'active' | 'inactive') => setData('status', value)}>
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Selecciona un estado" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-600">{errors.status}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            className="cursor-pointer"
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                            disabled={processing}
                        >
                            {processing
                                ? (isEditing ? 'Actualizando...' : 'Creando...')
                                : (isEditing ? 'Actualizar Región' : 'Crear Región')
                            }
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
