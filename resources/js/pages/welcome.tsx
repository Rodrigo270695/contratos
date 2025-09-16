import Navbar from '@/components/navbar';
import ToastContainer from '@/components/ui/toast-container';
import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

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
                <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
                    <main className="flex w-full max-w-[335px] flex-col-reverse lg:max-w-4xl lg:flex-row">
                        <div className="flex-1 rounded-br-lg rounded-bl-lg bg-white p-6 pb-12 text-[13px] leading-[20px] shadow-[inset_0px_0px_0px_1px_rgba(180,134,11,0.16)] border border-amber-200 lg:rounded-tl-lg lg:rounded-br-none lg:p-20 dark:bg-[#161615] dark:text-[#EDEDEC] dark:shadow-[inset_0px_0px_0px_1px_#fffaed2d]">
                            <h1 className="mb-1 font-medium text-lg text-amber-900">Convocatorias Docentes UGEL Lambayeque</h1>
                            <p className="mb-2 text-amber-700 dark:text-amber-300">
                                Encuentra las mejores oportunidades de trabajo docente en la región de Lambayeque.
                                <br />
                                {auth.user ?
                                    `¡Bienvenido ${auth.user.first_name}! Explora las convocatorias disponibles.` :
                                    'Regístrate como docente para acceder a recomendaciones personalizadas.'
                                }
                            </p>
                            <ul className="mb-4 flex flex-col lg:mb-6">
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-1/2 before:bottom-0 before:left-[0.4rem] before:border-l before:border-amber-300 dark:before:border-amber-700">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-amber-300 bg-amber-50 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-amber-700 dark:bg-amber-900/20">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                                        </span>
                                    </span>
                                    <span className="text-amber-800 dark:text-amber-200">
                                        🎯 Ver convocatorias activas para docentes de todos los niveles
                                    </span>
                                </li>
                                <li className="relative flex items-center gap-4 py-2 before:absolute before:top-0 before:bottom-1/2 before:left-[0.4rem] before:border-l before:border-amber-300 dark:before:border-amber-700">
                                    <span className="relative bg-white py-1 dark:bg-[#161615]">
                                        <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-amber-300 bg-amber-50 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-amber-700 dark:bg-amber-900/20">
                                            <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                                        </span>
                                    </span>
                                    <span className="text-amber-800 dark:text-amber-200">
                                        🤖 Recibe recomendaciones personalizadas basadas en tu perfil profesional
                                    </span>
                                </li>
                                {!auth.user && (
                                    <li className="relative flex items-center gap-4 py-2">
                                        <span className="relative bg-white py-1 dark:bg-[#161615]">
                                            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-amber-300 bg-amber-50 shadow-[0px_0px_1px_0px_rgba(0,0,0,0.03),0px_1px_2px_0px_rgba(0,0,0,0.06)] dark:border-amber-700 dark:bg-amber-900/20">
                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
                                            </span>
                                        </span>
                                        <span className="text-amber-800 dark:text-amber-200">
                                            📝 Crea tu perfil docente para postular a convocatorias
                                        </span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </main>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}
