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

interface Convocatoria {
    id: number;
    title: string;
    year: number;
    total_plazas: number;
    plazas_count?: number;
    plazas_disponibles?: number;
}

interface Institution {
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
}

interface Plaza {
    id: number;
    convocatoria_id: number;
    institution_id: number;
    codigo_plaza: string;
    cargo: string;
    nivel: 'inicial' | 'primaria' | 'secundaria';
    especialidad?: string;
    jornada: '25' | '30' | '40';
    monto_pago?: number;
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

interface PlazaFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    plaza?: Plaza | null;
    convocatorias?: Convocatoria[];
    institutions?: Institution[];
}

export default function PlazaFormModal({
    isOpen,
    onClose,
    plaza,
    convocatorias = [],
    institutions = []
}: PlazaFormModalProps) {
    const isEditing = !!plaza;

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        convocatoria_id: '',
        institution_id: '',
        codigo_plaza: '',
        cargo: '',
        nivel: 'primaria' as 'inicial' | 'primaria' | 'secundaria',
        especialidad: '',
        jornada: '30' as '25' | '30' | '40',
        monto_pago: '',
        vacantes: 1,
        motivo_vacante: '',
        requisitos: '',
        status: 'active' as 'active' | 'filled' | 'cancelled',
    });

    // Cargar datos cuando se abre el modal para editar
    useEffect(() => {
        if (isOpen && plaza) {
            setData({
                convocatoria_id: plaza.convocatoria_id.toString(),
                institution_id: plaza.institution_id.toString(),
                codigo_plaza: plaza.codigo_plaza,
                cargo: plaza.cargo,
                nivel: plaza.nivel,
                especialidad: plaza.especialidad || '',
                jornada: plaza.jornada,
                monto_pago: plaza.monto_pago?.toString() || '',
                vacantes: plaza.vacantes,
                motivo_vacante: plaza.motivo_vacante,
                requisitos: plaza.requisitos || '',
                status: plaza.status,
            });
        }
    }, [isOpen, plaza]);

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
            convocatoria_id: parseInt(data.convocatoria_id),
            institution_id: parseInt(data.institution_id),
            monto_pago: data.monto_pago ? parseFloat(data.monto_pago) : null,
            vacantes: parseInt(data.vacantes.toString()),
        };

        if (isEditing) {
            put(`/plazas/${plaza.id}`, {
                onSuccess: () => handleClose(),
            });
        } else {
            post('/plazas', {
                onSuccess: () => handleClose(),
            });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing ? 'Editar Plaza' : 'Nueva Plaza'}
                    </DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Modifica los datos de la plaza.'
                            : 'Completa la información para crear una nueva plaza.'
                        }
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Convocatoria */}
                        <div className="lg:col-span-2 space-y-2">
                            <Label htmlFor="convocatoria_id">
                                Convocatoria <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.convocatoria_id} onValueChange={(value) => setData('convocatoria_id', value)}>
                                <SelectTrigger className={errors.convocatoria_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Seleccionar convocatoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {convocatorias.map((convocatoria) => {
                                        const isCompleto = (convocatoria.plazas_disponibles || 0) <= 0;
                                        return (
                                            <SelectItem
                                                key={convocatoria.id}
                                                value={convocatoria.id.toString()}
                                                disabled={isCompleto && !data.convocatoria_id}
                                            >
                                                <div className="flex flex-col">
                                                    <span className={isCompleto ? 'text-gray-400' : ''}>
                                                        {convocatoria.title} ({convocatoria.year})
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        Plazas: {convocatoria.plazas_count || 0}/{convocatoria.total_plazas}
                                                        {isCompleto && (
                                                            <span className="text-red-500 ml-1">(Completo)</span>
                                                        )}
                                                        {!isCompleto && (
                                                            <span className="text-green-600 ml-1">
                                                                ({convocatoria.plazas_disponibles} disponibles)
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                            {errors.convocatoria_id && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.convocatoria_id}</p>
                            )}
                        </div>

                        {/* Institución */}
                        <div className="lg:col-span-2 space-y-2">
                            <Label htmlFor="institution_id">
                                Institución Educativa <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.institution_id} onValueChange={(value) => setData('institution_id', value)}>
                                <SelectTrigger className={errors.institution_id ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Seleccionar institución" />
                                </SelectTrigger>
                                <SelectContent>
                                    {institutions.map((institution) => (
                                        <SelectItem key={institution.id} value={institution.id.toString()}>
                                            {institution.name} - {institution.district?.ugel?.name || 'Sin UGEL'}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.institution_id && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.institution_id}</p>
                            )}
                        </div>

                        {/* Código de plaza */}
                        <div className="space-y-2">
                            <Label htmlFor="codigo_plaza">
                                Código de Plaza <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="codigo_plaza"
                                type="text"
                                value={data.codigo_plaza}
                                onChange={(e) => setData('codigo_plaza', e.target.value.toUpperCase())}
                                className={errors.codigo_plaza ? 'border-red-500' : ''}
                                placeholder="Ej: PL-2025-001"
                                maxLength={30}
                            />
                            {errors.codigo_plaza && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.codigo_plaza}</p>
                            )}
                        </div>

                        {/* Cargo */}
                        <div className="space-y-2">
                            <Label htmlFor="cargo">
                                Cargo <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="cargo"
                                type="text"
                                value={data.cargo}
                                onChange={(e) => setData('cargo', e.target.value)}
                                className={errors.cargo ? 'border-red-500' : ''}
                                placeholder="Ej: Profesor de Aula"
                                maxLength={150}
                            />
                            {errors.cargo && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.cargo}</p>
                            )}
                        </div>

                        {/* Nivel */}
                        <div className="space-y-2">
                            <Label htmlFor="nivel">
                                Nivel Educativo <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.nivel} onValueChange={(value) => setData('nivel', value as 'inicial' | 'primaria' | 'secundaria')}>
                                <SelectTrigger className={errors.nivel ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="inicial">Inicial</SelectItem>
                                    <SelectItem value="primaria">Primaria</SelectItem>
                                    <SelectItem value="secundaria">Secundaria</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.nivel && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.nivel}</p>
                            )}
                        </div>

                        {/* Especialidad */}
                        <div className="space-y-2">
                            <Label htmlFor="especialidad">Especialidad</Label>
                            <Input
                                id="especialidad"
                                type="text"
                                value={data.especialidad}
                                onChange={(e) => setData('especialidad', e.target.value)}
                                className={errors.especialidad ? 'border-red-500' : ''}
                                placeholder="Ej: Matemática, Comunicación"
                                maxLength={100}
                            />
                            {errors.especialidad && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.especialidad}</p>
                            )}
                        </div>

                        {/* Jornada */}
                        <div className="space-y-2">
                            <Label htmlFor="jornada">
                                Jornada Laboral <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.jornada} onValueChange={(value) => setData('jornada', value as '25' | '30' | '40')}>
                                <SelectTrigger className={errors.jornada ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="25">25 horas</SelectItem>
                                    <SelectItem value="30">30 horas</SelectItem>
                                    <SelectItem value="40">40 horas</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.jornada && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.jornada}</p>
                            )}
                        </div>

                        {/* Monto de Pago */}
                        <div className="space-y-2">
                            <Label htmlFor="monto_pago">Monto de Pago Mensual</Label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                                <Input
                                    id="monto_pago"
                                    type="number"
                                    value={data.monto_pago}
                                    onChange={(e) => setData('monto_pago', e.target.value)}
                                    className={`pl-8 ${errors.monto_pago ? 'border-red-500' : ''}`}
                                    placeholder="0.00"
                                    step="0.01"
                                    min="0"
                                    max="999999.99"
                                />
                            </div>
                            {errors.monto_pago && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.monto_pago}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Monto mensual en soles (opcional)
                            </p>
                        </div>

                        {/* Vacantes */}
                        <div className="space-y-2">
                            <Label htmlFor="vacantes">
                                Número de Vacantes <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="vacantes"
                                type="number"
                                value={data.vacantes}
                                onChange={(e) => setData('vacantes', parseInt(e.target.value) || 1)}
                                className={errors.vacantes ? 'border-red-500' : ''}
                                min={1}
                                max={50}
                            />
                            {errors.vacantes && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.vacantes}</p>
                            )}
                        </div>

                        {/* Estado */}
                        <div className="space-y-2">
                            <Label htmlFor="status">
                                Estado <span className="text-red-500">*</span>
                            </Label>
                            <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'filled' | 'cancelled')}>
                                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Activo</SelectItem>
                                    <SelectItem value="filled">Ocupado</SelectItem>
                                    <SelectItem value="cancelled">Cancelado</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.status}</p>
                            )}
                        </div>

                        {/* Motivo de vacante */}
                        <div className="lg:col-span-2 space-y-2">
                            <Label htmlFor="motivo_vacante">
                                Motivo de la Vacante <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="motivo_vacante"
                                type="text"
                                value={data.motivo_vacante}
                                onChange={(e) => setData('motivo_vacante', e.target.value)}
                                className={errors.motivo_vacante ? 'border-red-500' : ''}
                                placeholder="Ej: Licencia por maternidad, Renuncia voluntaria"
                                maxLength={200}
                            />
                            {errors.motivo_vacante && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.motivo_vacante}</p>
                            )}
                        </div>

                        {/* Requisitos */}
                        <div className="lg:col-span-2 space-y-2">
                            <Label htmlFor="requisitos">Requisitos Específicos</Label>
                            <textarea
                                id="requisitos"
                                value={data.requisitos}
                                onChange={(e) => setData('requisitos', e.target.value)}
                                className={`flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical ${errors.requisitos ? 'border-red-500' : ''}`}
                                placeholder="Detalle los requisitos específicos para esta plaza...&#10;&#10;Ejemplo:&#10;• Título profesional en educación&#10;• Experiencia mínima de 2 años&#10;• Conocimiento en metodologías activas&#10;• Dominio de herramientas digitales"
                                rows={4}
                            />
                            {errors.requisitos && (
                                <p className="text-sm text-red-600 dark:text-red-400">{errors.requisitos}</p>
                            )}
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Máximo 5000 caracteres. Use viñetas (•) o números para organizar mejor la información.
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
                            type="submit"
                            disabled={processing}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white cursor-pointer"
                        >
                            {processing ? 'Guardando...' : isEditing ? 'Actualizar Plaza' : 'Crear Plaza'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
