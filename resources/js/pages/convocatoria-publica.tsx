import Navbar from '@/components/navbar';
import ToastContainer from '@/components/ui/toast-container';
import { type SharedData } from '@/types';
import { Head, usePage, Link } from '@inertiajs/react';
import {
    Calendar,
    MapPin,
    Users,
    Briefcase,
    Building2,
    Clock,
    FileText,
    ChevronDown,
    ChevronUp,
    ArrowLeft,
    GraduationCap,
    Target,
    Info,
    Send
} from 'lucide-react';
import { useState } from 'react';

interface Convocatoria {
    id: number;
    title: string;
    description?: string;
    year: number;
    process_type: 'contratacion' | 'nombramiento';
    status: 'draft' | 'published' | 'active' | 'closed' | 'cancelled';
    total_plazas: number;
    start_date: string;
    end_date: string;
    registration_start: string;
    registration_end: string;
    ugel: {
        id: number;
        name: string;
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
}

interface Plaza {
    id: number;
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
    total_postulaciones: number;
    vacantes_ocupadas: number;
    vacantes_disponibles: number;
    institution: {
        id: number;
        name: string;
        code: string;
        address?: string;
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
}

interface ConvocatoriaPublicaProps extends SharedData {
    convocatoria: Convocatoria;
    plazas: Plaza[];
}

export default function ConvocatoriaPublica() {
    const { auth, convocatoria, plazas } = usePage<ConvocatoriaPublicaProps>().props;
    const [expandedPlazas, setExpandedPlazas] = useState<Set<number>>(new Set());

    // Función helper para formatear fechas
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatDateTime = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Función helper para obtener el estado de la convocatoria
    const getStatusBadge = (status: string) => {
        const variants = {
            published: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300',
            active: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300'
        };

        const labels = {
            published: 'Publicado',
            active: 'Activo'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${variants[status as keyof typeof variants]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    // Función helper para obtener el tipo de proceso
    const getProcessTypeBadge = (processType: string) => {
        const variants = {
            contratacion: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300',
            nombramiento: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300'
        };

        const labels = {
            contratacion: 'Contratación',
            nombramiento: 'Nombramiento'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium border ${variants[processType as keyof typeof variants]}`}>
                {labels[processType as keyof typeof labels]}
            </span>
        );
    };

    const getNivelBadge = (nivel: string) => {
        const variants = {
            inicial: 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-300',
            primaria: 'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300',
            secundaria: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300'
        };

        const labels = {
            inicial: 'Inicial',
            primaria: 'Primaria',
            secundaria: 'Secundaria'
        };

        return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium border ${variants[nivel as keyof typeof variants]}`}>
                {labels[nivel as keyof typeof labels]}
            </span>
        );
    };

    const formatMonto = (monto?: number): string => {
        if (!monto) return 'No especificado';
        return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(monto);
    };

    const handlePostular = (plazaId: number) => {
        // Verificar si el usuario está autenticado
        if (!auth.user) {
            // Redirigir al login con el parámetro de retorno
            window.location.href = `/login?redirect=${encodeURIComponent(window.location.pathname)}`;
            return;
        }

        // Verificar si el usuario es un docente
        if (auth.user.user_type !== 'teacher') {
            alert('Solo los docentes pueden postular a las plazas.');
            return;
        }

        // Por ahora, mostrar un mensaje de confirmación
        const plaza = plazas.find(p => p.id === plazaId);
        if (plaza && confirm(`¿Está seguro que desea postular a la plaza ${plaza.codigo_plaza}?`)) {
            // TODO: Implementar la lógica de postulación
            alert('Funcionalidad de postulación en desarrollo. Pronto estará disponible.');
        }
    };

    const togglePlazaExpansion = (plazaId: number) => {
        const newExpanded = new Set(expandedPlazas);
        if (newExpanded.has(plazaId)) {
            newExpanded.delete(plazaId);
        } else {
            newExpanded.add(plazaId);
        }
        setExpandedPlazas(newExpanded);
    };

    return (
        <>
            <Head title={`${convocatoria.title} - Convocatorias Docentes`}>
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-amber-50 text-amber-900 dark:bg-[#0a0a0a]">
                {/* Navbar */}
                <Navbar />

                {/* Contenido Principal */}
                <div className="flex-1 p-6 lg:p-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Botón de regreso */}
                        <div className="mb-6">
                            <Link
                                href="/"
                                className="inline-flex items-center text-amber-600 hover:text-amber-700 transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver a convocatorias
                            </Link>
                        </div>

                        {/* Header de la convocatoria */}
                        <div className="bg-white rounded-lg shadow-lg border border-amber-200 p-8 mb-8 dark:bg-gray-800 dark:border-gray-700">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                <div className="flex-1">
                                    <div className="flex flex-wrap gap-3 mb-4">
                                        {getStatusBadge(convocatoria.status)}
                                        {getProcessTypeBadge(convocatoria.process_type)}
                                    </div>

                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                                        {convocatoria.title}
                                    </h1>

                                    {convocatoria.description && (
                                        <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                                            {convocatoria.description}
                                        </p>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div className="flex items-center">
                                            <MapPin className="h-5 w-5 text-amber-600 mr-3" />
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">UGEL:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                    {convocatoria.ugel.name} - {convocatoria.ugel.region.name}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Calendar className="h-5 w-5 text-amber-600 mr-3" />
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">Vigencia:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                    {formatDate(convocatoria.start_date)} - {formatDate(convocatoria.end_date)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Clock className="h-5 w-5 text-amber-600 mr-3" />
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">Inscripciones:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                    {formatDateTime(convocatoria.registration_start)} - {formatDateTime(convocatoria.registration_end)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center">
                                            <Briefcase className="h-5 w-5 text-amber-600 mr-3" />
                                            <div>
                                                <span className="font-medium text-gray-900 dark:text-white">Total plazas:</span>
                                                <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                    {plazas.length} plazas ({plazas.reduce((sum, plaza) => sum + plaza.vacantes, 0)} vacantes)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lista de plazas */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                    Plazas Disponibles
                                </h2>
                                <span className="text-sm text-amber-700 dark:text-amber-300">
                                    {plazas.length} plazas encontradas
                                </span>
                            </div>

                            {plazas.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-lg shadow-lg border border-amber-200 dark:bg-gray-800 dark:border-gray-700">
                                    <Briefcase className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No hay plazas disponibles
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Esta convocatoria aún no tiene plazas específicas creadas.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {plazas.map((plaza) => (
                                        <div key={plaza.id} className="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                                            {/* Header de la plaza */}
                                            <div className="p-6">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-3">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                {plaza.codigo_plaza}
                                                            </h3>
                                                            {getNivelBadge(plaza.nivel)}
                                                            {plaza.vacantes_disponibles > 0 ? (
                                                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800">
                                                                    Disponible
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800">
                                                                    Ocupado
                                                                </span>
                                                            )}
                                                        </div>

                                                        <p className="text-gray-900 dark:text-white font-medium mb-2">
                                                            {plaza.cargo}
                                                        </p>

                                                        {plaza.especialidad && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                                                                <GraduationCap className="inline h-4 w-4 mr-1" />
                                                                {plaza.especialidad}
                                                            </p>
                                                        )}

                                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                            <div className="flex items-center">
                                                                <Building2 className="h-4 w-4 text-amber-600 mr-2" />
                                                                <div>
                                                                    <span className="font-medium">Institución:</span>
                                                                    <span className="ml-1 text-gray-600 dark:text-gray-300">
                                                                        {plaza.institution.name}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center">
                                                                <Users className="h-4 w-4 text-amber-600 mr-2" />
                                                                <div>
                                                                    <span className="font-medium">Vacantes:</span>
                                                                    <span className="ml-1 text-gray-600 dark:text-gray-300">
                                                                        {plaza.vacantes_disponibles}/{plaza.vacantes}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center">
                                                                <Clock className="h-4 w-4 text-amber-600 mr-2" />
                                                                <div>
                                                                    <span className="font-medium">Jornada:</span>
                                                                    <span className="ml-1 text-gray-600 dark:text-gray-300">
                                                                        {plaza.jornada}h semanales
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            <div className="flex items-center">
                                                                <span className="text-amber-600 mr-2 font-bold">S/</span>
                                                                <div>
                                                                    <span className="font-medium">Sueldo:</span>
                                                                    <span className="ml-1 text-gray-600 dark:text-gray-300 font-semibold">
                                                                        {plaza.monto_pago ? formatMonto(plaza.monto_pago) : 'No especificado'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 ml-4">
                                                        {/* Botón Postular */}
                                                        {plaza.vacantes_disponibles > 0 ? (
                                                            <button
                                                                onClick={() => handlePostular(plaza.id)}
                                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                                            >
                                                                <Send className="h-4 w-4 mr-2" />
                                                                Postular
                                                            </button>
                                                        ) : (
                                                            <span className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-500 bg-gray-100 rounded-md cursor-not-allowed dark:bg-gray-700 dark:text-gray-400">
                                                                Sin vacantes
                                                            </span>
                                                        )}

                                                        {/* Botón Expandir */}
                                                        <button
                                                            onClick={() => togglePlazaExpansion(plaza.id)}
                                                            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                                                        >
                                                            {expandedPlazas.has(plaza.id) ? (
                                                                <ChevronUp className="h-5 w-5" />
                                                            ) : (
                                                                <ChevronDown className="h-5 w-5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Información expandible */}
                                                {expandedPlazas.has(plaza.id) && (
                                                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                            {/* Información adicional */}
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                                    <Info className="h-4 w-4 mr-2 text-amber-600" />
                                                                    Información Adicional
                                                                </h4>
                                                                <div className="space-y-3 text-sm">
                                                                    <div>
                                                                        <span className="font-medium text-gray-900 dark:text-white">Código IE:</span>
                                                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                                            {plaza.institution.code}
                                                                        </span>
                                                                    </div>

                                                                    {plaza.institution.address && (
                                                                        <div>
                                                                            <span className="font-medium text-gray-900 dark:text-white">Dirección:</span>
                                                                            <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                                                {plaza.institution.address}
                                                                            </span>
                                                                        </div>
                                                                    )}

                                                                    <div>
                                                                        <span className="font-medium text-gray-900 dark:text-white">Distrito:</span>
                                                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                                            {plaza.institution.district.name}
                                                                        </span>
                                                                    </div>

                                                                    <div>
                                                                        <span className="font-medium text-gray-900 dark:text-white">Motivo de vacante:</span>
                                                                        <span className="ml-2 text-gray-600 dark:text-gray-300">
                                                                            {plaza.motivo_vacante}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Requisitos */}
                                                            {plaza.requisitos && (
                                                                <div>
                                                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                                        <Target className="h-4 w-4 mr-2 text-amber-600" />
                                                                        Requisitos Específicos
                                                                    </h4>
                                                                    <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                                                                        {plaza.requisitos}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Estadísticas de postulaciones */}
                                                        <div className="mt-6 p-4 bg-amber-50 dark:bg-gray-700 rounded-lg">
                                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                                                Estado de Postulaciones
                                                            </h4>
                                                            <div className="grid grid-cols-3 gap-4 text-center">
                                                                <div>
                                                                    <p className="text-2xl font-bold text-blue-600">
                                                                        {plaza.total_postulaciones}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                                                        Postulaciones
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-2xl font-bold text-green-600">
                                                                        {plaza.vacantes_disponibles}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                                                        Disponibles
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-2xl font-bold text-red-600">
                                                                        {plaza.vacantes_ocupadas}
                                                                    </p>
                                                                    <p className="text-xs text-gray-600 dark:text-gray-300">
                                                                        Ocupadas
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
