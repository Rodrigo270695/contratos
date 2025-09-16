import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    // Determinar si es admin o docente
    const isAdmin = user?.user_type === 'admin';
    const fullName = user ? `${user.first_name} ${user.last_name}` : '';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {/* Bienvenida personalizada */}
                <div className="rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <h1 className="text-2xl font-bold mb-2">
                        ¡Bienvenido{isAdmin ? ' Administrador' : ''}, {fullName}!
                    </h1>
                    <p className="text-blue-100">
                        {isAdmin
                            ? 'Panel de administración - Sistema de Convocatorias Docentes UGEL Chiclayo'
                            : 'Encuentra las mejores oportunidades de trabajo docente'
                        }
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                    {isAdmin ? 'Gestionar' : 'Ver'}
                                </div>
                                <div className="text-green-700 dark:text-green-300">Convocatorias</div>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                    {isAdmin ? 'Revisar' : 'Mis'}
                                </div>
                                <div className="text-blue-700 dark:text-blue-300">
                                    {isAdmin ? 'Postulaciones' : 'Aplicaciones'}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                    {isAdmin ? 'Reportes' : 'IA'}
                                </div>
                                <div className="text-purple-700 dark:text-purple-300">
                                    {isAdmin ? 'Estadísticas' : 'Recomendaciones'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
                        <div className="text-center p-8">
                            <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                                {isAdmin ? '🎛️ Panel de Control' : '📚 Mi Espacio'}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md">
                                {isAdmin
                                    ? 'Desde aquí podrás gestionar todas las convocatorias, revisar postulaciones y generar reportes del sistema.'
                                    : 'Explora convocatorias disponibles, gestiona tu perfil y recibe recomendaciones personalizadas de IA.'
                                }
                            </p>
                            <div className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                                Tipo de usuario: <span className="font-semibold">{isAdmin ? 'Administrador' : 'Docente'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
