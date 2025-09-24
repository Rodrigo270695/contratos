import Navbar from '@/components/navbar';
import ToastContainer from '@/components/ui/toast-container';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Calendar, MapPin, Users, Briefcase, TrendingUp, Building2 } from 'lucide-react';

interface Convocatoria {
    id: number;
    title: string;
    year: number;
    process_type: 'contratacion' | 'nombramiento';
    status: 'draft' | 'published' | 'active' | 'closed' | 'cancelled';
    total_plazas: number;
    plazas_count: number;
    total_vacantes_reales: number;
    start_date: string;
    end_date: string;
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

interface Estadisticas {
    convocatorias_activas: number;
    total_vacantes_creadas: number;
    ugels_participantes: number;
}

interface WelcomeProps extends SharedData {
    convocatorias: Convocatoria[];
    estadisticas: Estadisticas;
}

export default function Welcome() {
    const { auth, convocatorias, estadisticas } = usePage<WelcomeProps>().props;

    // Función helper para formatear fechas
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
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
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${variants[status as keyof typeof variants]}`}>
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
            <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${variants[processType as keyof typeof variants]}`}>
                {labels[processType as keyof typeof labels]}
            </span>
        );
    };

    return (
        <>
            <Head title="Convocatorias Docentes - UGEL Lambayeque">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="flex min-h-screen flex-col bg-amber-50 text-amber-900 dark:bg-[#0a0a0a]">
                {/* Navbar Componente */}
                <Navbar />

                {/* Contenido Principal */}
                <div className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header con estadísticas */}
                        <div className="mb-8">
                            <div className="text-center mb-6">
                                <h1 className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                                    Convocatorias Docentes UGEL Lambayeque
                                </h1>
                                <p className="text-amber-700 dark:text-amber-300 text-lg">
                                {auth.user ?
                                    `¡Bienvenido ${auth.user.first_name}! Explora las convocatorias disponibles.` :
                                        'Encuentra las mejores oportunidades de trabajo docente en la región de Lambayeque.'
                                }
                            </p>
                            </div>

                            {/* Estadísticas */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-white rounded-lg p-6 shadow-lg border border-amber-200 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <TrendingUp className="h-8 w-8 text-amber-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Convocatorias Activas</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.convocatorias_activas}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-lg border border-amber-200 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Briefcase className="h-8 w-8 text-amber-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Vacantes Creadas</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.total_vacantes_creadas}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-lg p-6 shadow-lg border border-amber-200 dark:bg-gray-800 dark:border-gray-700">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <Building2 className="h-8 w-8 text-amber-600" />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">UGELs Participantes</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{estadisticas.ugels_participantes}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lista de convocatorias */}
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                                    Convocatorias Recientes
                                </h2>
                                {convocatorias.length > 0 && (
                                    <span className="text-sm text-amber-700 dark:text-amber-300">
                                        Mostrando {convocatorias.length} convocatorias
                                    </span>
                                )}
                            </div>

                            {convocatorias.length === 0 ? (
                                <div className="text-center py-12">
                                    <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                        No hay convocatorias activas
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Por el momento no hay convocatorias publicadas. Vuelve pronto para ver las nuevas oportunidades.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {convocatorias.map((convocatoria) => (
                                        <div key={convocatoria.id} className="bg-white rounded-lg shadow-lg border border-amber-200 overflow-hidden hover:shadow-xl transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
                                            {/* Header de la card */}
                                            <div className="p-6 pb-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 mb-2">
                                                            {convocatoria.title}
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2 mb-3">
                                                            {getStatusBadge(convocatoria.status)}
                                                            {getProcessTypeBadge(convocatoria.process_type)}
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Información de la convocatoria */}
                                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                                    <div className="flex items-center">
                                                        <MapPin className="h-4 w-4 text-amber-600 mr-2" />
                                                        <span>{convocatoria.ugel?.name} - {convocatoria.ugel?.region?.name}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Calendar className="h-4 w-4 text-amber-600 mr-2" />
                                                        <span>Hasta: {formatDate(convocatoria.end_date)}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Users className="h-4 w-4 text-amber-600 mr-2" />
                                                        <span>
                                                            {convocatoria.total_vacantes_reales} vacantes creadas ({convocatoria.plazas_count} plazas)
                                    </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer de la card */}
                                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        Año {convocatoria.year}
                                        </span>
                                                    <div className="flex items-center gap-3">
                                                        {convocatoria.total_vacantes_reales > 0 ? (
                                                            <span className="text-xs font-medium text-green-600 dark:text-green-400">
                                                                ✓ {convocatoria.total_vacantes_reales} vacantes
                                    </span>
                                                        ) : (
                                                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                                                                📝 En preparación
                                    </span>
                                                        )}
                                                        <a
                                                            href={`/convocatoria/${convocatoria.id}`}
                                                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-200 rounded-md hover:bg-amber-200 hover:text-amber-800 transition-colors dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-700 dark:hover:bg-amber-900/40"
                                                        >
                                                            Ver Convocatoria
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Información adicional para usuarios no registrados */}
                        {!auth.user && (
                            <div className="mt-12 bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-8 border border-amber-200 dark:from-gray-800 dark:to-gray-700 dark:border-gray-600">
                                <div className="text-center">
                                    <h3 className="text-xl font-semibold text-amber-900 dark:text-amber-100 mb-4">
                                        ¿Eres docente y buscas oportunidades?
                                    </h3>
                                    <p className="text-amber-700 dark:text-amber-300 mb-6">
                                        Regístrate en nuestra plataforma para acceder a recomendaciones personalizadas y postular a las convocatorias que mejor se adapten a tu perfil profesional.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                        <a
                                            href="/register"
                                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
                                        >
                                            Registrarse como Docente
                                        </a>
                                        <a
                                            href="/login"
                                            className="inline-flex items-center px-6 py-3 border border-amber-300 text-base font-medium rounded-md text-amber-700 bg-white hover:bg-amber-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors dark:bg-gray-800 dark:text-amber-300 dark:border-amber-600 dark:hover:bg-gray-700"
                                        >
                                            Iniciar Sesión
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
