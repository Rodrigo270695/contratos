import React, { useState, useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface Ugel {
    id: number;
    name: string;
    code: string;
    region: {
        id: number;
        name: string;
    };
}

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

interface ConvocatoriaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    convocatoria?: Convocatoria | null;
    ugels?: Ugel[];
}

export default function ConvocatoriaFormModal({
    isOpen,
    onClose,
    convocatoria,
    ugels = []
}: ConvocatoriaFormModalProps) {
    const isEditing = !!convocatoria;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        ugel_id: '',
        title: '',
        description: '',
        year: new Date().getFullYear(),
        process_type: 'contratacion' as 'contratacion' | 'nombramiento',
        start_date: '',
        end_date: '',
        registration_start: '',
        registration_end: '',
        status: 'draft' as 'draft' | 'published' | 'active' | 'closed' | 'cancelled',
        total_plazas: 0,
    });

    // Cargar datos cuando se abre el modal para editar
    useEffect(() => {
        if (isOpen && convocatoria) {
            setData({
                ugel_id: convocatoria.ugel_id.toString(),
                title: convocatoria.title,
                description: convocatoria.description || '',
                year: convocatoria.year,
                process_type: convocatoria.process_type,
                start_date: convocatoria.start_date.substring(0, 10), // Para date input (YYYY-MM-DD)
                end_date: convocatoria.end_date.substring(0, 10), // Para date input (YYYY-MM-DD)
                registration_start: convocatoria.registration_start.substring(0, 16), // Para datetime-local
                registration_end: convocatoria.registration_end.substring(0, 16), // Para datetime-local
                status: convocatoria.status,
                total_plazas: convocatoria.total_plazas,
            });
        }
    }, [isOpen, convocatoria]);

    // Limpiar formulario al cerrar
    const handleClose = () => {
        reset();
        clearErrors();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const submitData = {
            ...data,
            ugel_id: parseInt(data.ugel_id),
            year: parseInt(data.year.toString()),
            total_plazas: parseInt(data.total_plazas.toString()),
        };

        if (isEditing) {
            put(`/convocatorias/${convocatoria.id}`, {
                onSuccess: () => handleClose(),
            });
        } else {
            post('/convocatorias', {
                onSuccess: () => handleClose(),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Convocatoria' : 'Nueva Convocatoria'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Modifica los datos de la convocatoria.'
                            : 'Completa la información para crear una nueva convocatoria.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* UGEL */}
                        <div className="lg:col-span-2 space-y-2">
                            <Label htmlFor="ugel_id">
                                UGEL <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.ugel_id} onValueChange={(value) => setData('ugel_id', value)}>
                                <SelectTrigger className={errors.ugel_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Seleccionar UGEL" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ugels.map((ugel) => (
                                        <SelectItem key={ugel.id} value={ugel.id.toString()}>
                                            {ugel.name} - {ugel.region.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.ugel_id && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.ugel_id}</p>
                            )}
                        </div>

                        {/* Título */}
                        <div className="lg:col-span-2 space-y-2">
                            <Label htmlFor="title">
                                Título <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="title"
                                type="text"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                className={errors.title ? 'border-red-500' : ''}
                                placeholder="Ej: Convocatoria CAS Docente 2024"
                                maxLength={300}
                            />
                            {errors.title && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.title}</p>
                            )}
                        </div>

                        {/* Descripción */}
                        <div className="lg:col-span-2 space-y-2">
                            <Label htmlFor="description">Descripción</Label>
                            <Input
                                id="description"
                                type="text"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                className={errors.description ? 'border-red-500' : ''}
                                placeholder="Descripción opcional de la convocatoria"
                            />
                            {errors.description && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                            )}
                        </div>

                        {/* Año */}
                        <div className="space-y-2">
                            <Label htmlFor="year">
                                Año <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="year"
                                type="number"
                                value={data.year}
                                onChange={(e) => setData('year', parseInt(e.target.value))}
                                className={errors.year ? 'border-red-500' : ''}
                                min={2020}
                                max={new Date().getFullYear() + 2}
                            />
                            {errors.year && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.year}</p>
                            )}
                        </div>

                        {/* Tipo de proceso */}
                        <div className="space-y-2">
                            <Label htmlFor="process_type">
                                Tipo de Proceso <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.process_type} onValueChange={(value) => setData('process_type', value as 'contratacion' | 'nombramiento')}>
                                <SelectTrigger className={errors.process_type ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="contratacion">Contratación</SelectItem>
                                    <SelectItem value="nombramiento">Nombramiento</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.process_type && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.process_type}</p>
                            )}
                        </div>

                        {/* Fecha de inicio */}
                        <div className="space-y-2">
                            <Label htmlFor="start_date">
                                Fecha de Inicio <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="start_date"
                                type="date"
                                value={data.start_date}
                                onChange={(e) => setData('start_date', e.target.value)}
                                className={errors.start_date ? 'border-red-500' : ''}
                            />
                            {errors.start_date && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.start_date}</p>
                            )}
                        </div>

                        {/* Fecha de fin */}
                        <div className="space-y-2">
                            <Label htmlFor="end_date">
                                Fecha de Fin <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="end_date"
                                type="date"
                                value={data.end_date}
                                onChange={(e) => setData('end_date', e.target.value)}
                                className={errors.end_date ? 'border-red-500' : ''}
                            />
                            {errors.end_date && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.end_date}</p>
                            )}
                        </div>

                        {/* Inicio de inscripciones */}
                        <div className="space-y-2">
                            <Label htmlFor="registration_start">
                                Inicio de Inscripciones <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="registration_start"
                                type="datetime-local"
                                value={data.registration_start}
                                onChange={(e) => setData('registration_start', e.target.value)}
                                className={errors.registration_start ? 'border-red-500' : ''}
                            />
                            {errors.registration_start && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.registration_start}</p>
                            )}
                        </div>

                        {/* Fin de inscripciones */}
                        <div className="space-y-2">
                            <Label htmlFor="registration_end">
                                Fin de Inscripciones <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="registration_end"
                                type="datetime-local"
                                value={data.registration_end}
                                onChange={(e) => setData('registration_end', e.target.value)}
                                className={errors.registration_end ? 'border-red-500' : ''}
                            />
                            {errors.registration_end && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.registration_end}</p>
                            )}
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Estado <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value as 'draft' | 'published' | 'active' | 'closed' | 'cancelled')}>
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Borrador</SelectItem>
                                    <SelectItem value="published">Publicado</SelectItem>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="closed">Cerrado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                            )}
                        </div>

                        {/* Total de plazas */}
                        <div className="space-y-2">
                            <Label htmlFor="total_plazas">Total de Plazas</Label>
                            <Input
                                id="total_plazas"
                                type="number"
                                value={data.total_plazas}
                                onChange={(e) => setData('total_plazas', parseInt(e.target.value) || 0)}
                                className={errors.total_plazas ? 'border-red-500' : ''}
                                min={0}
                                max={10000}
                            />
                            {errors.total_plazas && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.total_plazas}</p>
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
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                        >
                            {processing ? 'Guardando...' : isEditing ? 'Actualizar Convocatoria' : 'Crear Convocatoria'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
