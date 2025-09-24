import { dashboard, login, register } from '@/routes';
import { Link } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import { User, ChevronDown, LogIn, UserPlus, LayoutDashboard, LogOut, Brain } from 'lucide-react';

interface DropdownAccessProps {
    user?: {
        id: number;
        first_name: string;
        last_name: string;
        dni: string;
        email: string;
        user_type: 'admin' | 'docente';
        status: string;
    } | null;
}

export default function DropdownAccess({ user }: DropdownAccessProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón Principal */}
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2 bg-gradient-to-r from-amber-700 via-amber-800 to-red-900 hover:from-amber-800 hover:via-red-900 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
                {user ? (
                    <>
                        {/* Avatar del usuario */}
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">
                                {user.first_name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <span className="font-medium hidden sm:inline">
                            {user.first_name} {user.last_name}
                        </span>
                        <span className="font-medium sm:hidden">
                            {user.first_name}
                        </span>
                    </>
                ) : (
                    <>
                        <User className="w-5 h-5" />
                        <span className="font-medium">Acceder</span>
                    </>
                )}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-amber-200 dark:bg-[#161615] dark:border-amber-700/30 z-50">
                    <div className="py-2">
                        {user ? (
                            <>
                                {/* Información del usuario */}
                                <div className="px-4 py-3 border-b border-amber-200 dark:border-amber-700/30">
                                    <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                                        {user.first_name} {user.last_name}
                                    </p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300 capitalize">
                                        {user.user_type === 'admin' ? 'Administrador' : 'Docente'}
                                    </p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                        DNI: {user.dni}
                                    </p>
                                </div>

                                {/* Panel Admin (solo para administradores) */}
                                {user.user_type === 'admin' && (
                                    <Link
                                        href={dashboard()}
                                        className="flex items-center px-4 py-2 text-sm text-amber-800 hover:bg-amber-50 dark:text-amber-200 dark:hover:bg-amber-900/20 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-3" />
                                        Panel Administrativo
                                    </Link>
                                )}

                                {/* Sistema de IA (solo para docentes) */}
                                {user.user_type === 'docente' && (
                                    <Link
                                        href="/mi-perfil-docente"
                                        className="flex items-center px-4 py-2 text-sm text-blue-800 hover:bg-blue-50 dark:text-blue-200 dark:hover:bg-blue-900/20 transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <Brain className="w-4 h-4 mr-3" />
                                        🤖 Sistema de IA
                                    </Link>
                                )}

                                {/* Cerrar Sesión */}
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <LogOut className="w-4 h-4 mr-3" />
                                    Cerrar Sesión
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Iniciar Sesión */}
                                <Link
                                    href={login()}
                                    className="flex items-center px-4 py-2 text-sm text-amber-800 hover:bg-amber-50 dark:text-amber-200 dark:hover:bg-amber-900/20 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <LogIn className="w-4 h-4 mr-3" />
                                    Iniciar Sesión
                                </Link>

                                {/* Registrarse */}
                                <Link
                                    href={register()}
                                    className="flex items-center px-4 py-2 text-sm text-amber-800 hover:bg-amber-50 dark:text-amber-200 dark:hover:bg-amber-900/20 transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <UserPlus className="w-4 h-4 mr-3" />
                                    Registro Docente
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
