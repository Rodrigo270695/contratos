import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { register } from '@/routes';
import { request } from '@/routes/password';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, Home } from 'lucide-react';
import { useState } from 'react';

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
            <Head title="Iniciar Sesión - UGEL Lambayeque" />

            <div className="w-full max-w-md">
                {/* Botón para ir a la página principal */}
                <div className="flex justify-center mb-6">
                    <a
                        href="/"
                        className="inline-flex items-center space-x-2 text-amber-600 hover:text-amber-800 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 text-sm font-medium"
                    >
                        <Home className="h-4 w-4" />
                        <span>Ver Convocatorias Públicas</span>
                    </a>
                </div>

                {/* Header con Logo */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-xl mb-4">
                        <div className="text-white text-2xl font-bold">UL</div>
                    </div>
                    <h1 className="text-2xl font-bold text-amber-900 mb-2">
                        Sistema de Convocatorias Docentes
                    </h1>
                    <p className="text-amber-700 text-sm">
                        UGEL Lambayeque - Chiclayo
                    </p>
                </div>

                {/* Card Principal */}
                <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
                    {/* Header del Card */}
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
                        <h2 className="text-xl font-semibold text-white text-center">
                            Iniciar Sesión
                        </h2>
                        <p className="text-amber-100 text-sm text-center mt-1">
                            Accede con tu DNI y contraseña
                        </p>
                    </div>

                    {/* Formulario */}
                    <div className="px-8 py-8">
                        <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="space-y-6">
                            {({ processing, errors }) => (
                                <>
                                    {/* Campo DNI */}
                                    <div className="space-y-2">
                                        <Label htmlFor="dni" className="text-sm font-medium text-amber-900">
                                            Documento Nacional de Identidad
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="dni"
                                                type="text"
                                                name="dni"
                                                required
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="username"
                                                placeholder="12345678"
                                                maxLength={8}
                                                pattern="[0-9]{8}"
                                                className="text-center text-lg tracking-widest font-mono h-12 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl bg-amber-50 transition-all duration-200"
                                            />
                                            <div className="absolute inset-y-0 left-3 flex items-center">
                                                <span className="text-amber-600 text-sm font-semibold">DNI</span>
                                            </div>
                                        </div>
                                        <InputError message={errors.dni} />
                                        <p className="text-xs text-amber-600 text-center">
                                            8 dígitos del Documento Nacional de Identidad
                                        </p>
                                    </div>

                                    {/* Campo Contraseña */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password" className="text-sm font-medium text-amber-900">
                                                Contraseña
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-amber-600 hover:text-amber-800 font-medium"
                                                    tabIndex={5}
                                                >
                                                    ¿Olvidaste tu contraseña?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="••••••••••••"
                                                className="h-12 pr-12 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-xl bg-amber-50 transition-all duration-200"
                                            />
                                            <button
                                                type="button"
                                                onClick={togglePasswordVisibility}
                                                className="absolute inset-y-0 right-3 flex items-center text-amber-600 hover:text-amber-800 transition-colors duration-200 cursor-pointer"
                                                tabIndex={-1}
                                                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    {/* Recordarme */}
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="border-amber-300 text-amber-600 focus:ring-amber-500"
                                        />
                                        <Label htmlFor="remember" className="text-sm text-amber-800 font-medium">
                                            Mantener sesión iniciada
                                        </Label>
                                    </div>

                                    {/* Botón de Login */}
                                    <Button
                                        type="submit"
                                        className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                                        tabIndex={4}
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <LoaderCircle className="h-5 w-5 animate-spin" />
                                                <span>Iniciando sesión...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <span>🎓</span>
                                                <span>Iniciar Sesión</span>
                                            </div>
                                        )}
                                    </Button>

                                    {/* Link de Registro */}
                                    <div className="text-center pt-4 border-t border-amber-100">
                                        <p className="text-sm text-amber-700">
                                            ¿Eres docente y no tienes cuenta?
                                        </p>
                                        <TextLink
                                            href={register()}
                                            tabIndex={5}
                                            className="text-amber-600 hover:text-amber-800 font-semibold text-sm mt-1 inline-block"
                                        >
                                            Regístrate para postular a convocatorias →
                                        </TextLink>
                                    </div>
                                </>
                            )}
                        </Form>
                    </div>
                </div>


                {/* Footer */}
                <div className="text-center mt-6 text-xs text-amber-600">
                    <p>© 2025 UGEL Lambayeque - Sistema de Convocatorias Docentes</p>
                    <p className="mt-1">Gobierno Regional de Lambayeque - Perú 🇵🇪</p>
                </div>
            </div>

            {/* Status Messages */}
            {status && (
                <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg shadow-lg">
                    {status}
                </div>
            )}
        </div>
    );
}
