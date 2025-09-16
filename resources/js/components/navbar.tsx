import { type SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import DropdownAccess from './dropdown-access';

export default function Navbar() {
    const { auth } = usePage<SharedData>().props;

    return (
        <nav className="bg-white shadow-lg border-b border-amber-200 dark:bg-[#161615] dark:border-amber-700/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo y Título */}
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            {/* Logo con colores oficiales UGEL */}
                            <div className="w-12 h-12 bg-gradient-to-br from-amber-700 via-amber-800 to-red-900 rounded-lg flex items-center justify-center shadow-md">
                                <span className="text-white font-bold text-lg">UL</span>
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-semibold text-amber-900 dark:text-amber-100">
                                UGEL Lambayeque
                            </h1>
                            <p className="text-sm text-amber-700 dark:text-amber-300">
                                Convocatorias Docentes
                            </p>
                        </div>
                    </div>

                    {/* Componente Dropdown de Acceso */}
                    <DropdownAccess user={auth.user} />
                </div>
            </div>
        </nav>
    );
}
