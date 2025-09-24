import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription
} from '@/components/ui/dialog';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';
import { Building2 } from 'lucide-react';

interface Region {
    id: number;
    name: string;
}

interface Ugel {
    id: number;
    name: string;
    code: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    status: 'active' | 'inactive';
    region_id: number;
}

interface UgelFormModalProps {
    isOpen: boolean;
    ugel: Ugel | null;
    regions: Region[];
    onClose: () => void;
}

export default function UgelFormModal({ isOpen, ugel, regions, onClose }: UgelFormModalProps) {
    const isEditing = !!ugel;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        region_id: '',
        name: '',
        code: '',
        address: '',
        phone: '',
        email: '',
        status: 'active' as 'active' | 'inactive',
    });

    useEffect(() => {
        if (isOpen) {
            if (isEditing && ugel) {
                setData({
                    region_id: ugel.region_id.toString(),
                    name: ugel.name,
                    code: ugel.code,
                    address: ugel.address || '',
                    phone: ugel.phone || '',
                    email: ugel.email || '',
                    status: ugel.status,
                });
            } else {
                reset();
            }
            clearErrors();
        }
    }, [isOpen, ugel, isEditing]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing && ugel) {
            put(`/ugels/${ugel.id}`, {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        } else {
            post('/ugels', {
                onSuccess: () => {
                    onClose();
                    reset();
                },
            });
        }
    };

    const handleClose = () => {
        if (!processing) {
            onClose();
            reset();
            clearErrors();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
                            <Building2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <DialogTitle>
                                {isEditing ? 'Editar UGEL' : 'Nueva UGEL'}
                            </DialogTitle>
                            <DialogDescription>
                                {isEditing ? 'Modifica los datos de la UGEL' : 'Completa los datos para crear una nueva UGEL'}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid gap-4">
                        {/* Región */}
                        <div className="space-y-2">
                            <Label htmlFor="region_id">Región <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.region_id}
                                onValueChange={(value) => setData('region_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Seleccionar región" />
                                </SelectTrigger>
                                <SelectContent>
                                    {regions.map((region) => (
                                        <SelectItem key={region.id} value={region.id.toString()}>
                                            {region.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.region_id && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.region_id}
                                </p>
                            )}
                        </div>

                        {/* Nombre */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre <span className="text-red-500">*</span></Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="Ej: UGEL Chiclayo"
                                className={errors.name ? 'border-red-500' : ''}
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Código */}
                        <div className="space-y-2">
                            <Label htmlFor="code">Código <span className="text-red-500">*</span></Label>
                            <Input
                                id="code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                placeholder="Ej: UGEL-01"
                                className={errors.code ? 'border-red-500' : ''}
                            />
                            {errors.code && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.code}
                                </p>
                            )}
                        </div>

                        {/* Dirección */}
                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input
                                id="address"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="Dirección de la UGEL"
                                className={errors.address ? 'border-red-500' : ''}
                            />
                            {errors.address && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.address}
                                </p>
                            )}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                placeholder="Ej: 074-123456"
                                className={errors.phone ? 'border-red-500' : ''}
                            />
                            {errors.phone && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Ej: ugel@gob.pe"
                                className={errors.email ? 'border-red-500' : ''}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <Label htmlFor="status">Estado <span className="text-red-500">*</span></Label>
                            <Select
                                value={data.status}
                                onValueChange={(value: 'active' | 'inactive') => setData('status', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="inactive">Inactivo</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-600 dark:text-red-400">
                                    {errors.status}
                                </p>
                            )}
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
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 cursor-pointer"
                        >
                            {processing ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
