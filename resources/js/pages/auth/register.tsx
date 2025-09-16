import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle, Eye, EyeOff, GraduationCap, Users, Clock, Home } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(!showPassword);
    const togglePasswordConfirmationVisibility = () => setShowPasswordConfirmation(!showPasswordConfirmation);

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center p-4">
            <Head title="Registro de Docente - UGEL Lambayeque" />

            <div className="w-full max-w-4xl">
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
                    <div className="mx-auto w-20 h-20 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center shadow-xl mb-4">
                        <GraduationCap className="text-white text-2xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-amber-900 mb-2">
                        Registro de Docente
                    </h1>
                    <p className="text-amber-700 text-sm">
                        Completa tu perfil para acceder a convocatorias personalizadas
                    </p>
                </div>

                {/* Card Principal */}
                <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 overflow-hidden">
                    {/* Header del Card */}
                    <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-8 py-6">
                        <h2 className="text-xl font-semibold text-white text-center">
                            Crear Cuenta de Docente
                        </h2>
                        <p className="text-amber-100 text-sm text-center mt-1">
                            Tu información nos ayudará a recomendarte las mejores oportunidades
                        </p>
                    </div>

                    {/* Formulario */}
                    <div className="px-8 py-8">
                        <Form
                            {...RegisteredUserController.store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-8"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {/* Sección 1: Datos Personales */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2 border-b border-amber-100 pb-2">
                                            <Users className="h-5 w-5 text-amber-600" />
                                            <h3 className="text-lg font-semibold text-amber-900">Datos Personales</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="first_name" className="text-sm font-medium text-amber-900">
                                                    Nombres *
                                                </Label>
                                                <Input
                                                    id="first_name"
                                                    type="text"
                                                    name="first_name"
                                                    required
                                                    autoFocus
                                                    tabIndex={1}
                                                    autoComplete="given-name"
                                                    placeholder="Ej: Juan Carlos"
                                                    className="h-11 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg bg-amber-50"
                                                />
                                                <InputError message={errors.first_name} />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="last_name" className="text-sm font-medium text-amber-900">
                                                    Apellidos *
                                                </Label>
                                                <Input
                                                    id="last_name"
                                                    type="text"
                                                    name="last_name"
                                                    required
                                                    tabIndex={2}
                                                    autoComplete="family-name"
                                                    placeholder="Ej: García López"
                                                    className="h-11 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg bg-amber-50"
                                                />
                                                <InputError message={errors.last_name} />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="dni" className="text-sm font-medium text-amber-900">
                                                    DNI *
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="dni"
                                                        type="text"
                                                        name="dni"
                                                        required
                                                        tabIndex={3}
                                                        autoComplete="username"
                                                        placeholder="12345678"
                                                        maxLength={8}
                                                        pattern="[0-9]{8}"
                                                        className="text-center text-lg tracking-widest font-mono h-11 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg bg-amber-50"
                                                    />
                                                    <div className="absolute inset-y-0 left-3 flex items-center">
                                                        <span className="text-amber-600 text-xs font-semibold">DNI</span>
                                                    </div>
                                                </div>
                                                <InputError message={errors.dni} />
                                                <p className="text-xs text-amber-600">8 dígitos del Documento Nacional de Identidad</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="phone" className="text-sm font-medium text-amber-900">
                                                    Teléfono Móvil
                                                </Label>
                                                <Input
                                                    id="phone"
                                                    type="text"
                                                    name="phone"
                                                    tabIndex={4}
                                                    autoComplete="tel"
                                                    placeholder="987654321"
                                                    maxLength={9}
                                                    pattern="[0-9]{9}"
                                                    className="h-11 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg bg-amber-50"
                                                />
                                                <InputError message={errors.phone} />
                                                <p className="text-xs text-amber-600">9 dígitos del número celular</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-sm font-medium text-amber-900">
                                                Correo Electrónico *
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                tabIndex={5}
                                                autoComplete="email"
                                                placeholder="juan.garcia@ejemplo.com"
                                                className="h-11 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg bg-amber-50"
                                            />
                                            <InputError message={errors.email} />
                                        </div>
                                    </div>

                                    {/* Sección 2: Configuración de Cuenta */}
                                    <div className="space-y-6">
                                        <div className="flex items-center space-x-2 border-b border-amber-100 pb-2">
                                            <Clock className="h-5 w-5 text-amber-600" />
                                            <h3 className="text-lg font-semibold text-amber-900">Configuración de Cuenta</h3>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="password" className="text-sm font-medium text-amber-900">
                                                    Contraseña *
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={showPassword ? "text" : "password"}
                                                        name="password"
                                                        required
                                                        tabIndex={6}
                                                        autoComplete="new-password"
                                                        placeholder="••••••••••••"
                                                        className="h-11 pr-12 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg bg-amber-50"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={togglePasswordVisibility}
                                                        className="absolute inset-y-0 right-3 flex items-center text-amber-600 hover:text-amber-800 transition-colors duration-200 cursor-pointer"
                                                        tabIndex={-1}
                                                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                    >
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                <InputError message={errors.password} />
                                                <p className="text-xs text-amber-600">Mínimo 8 caracteres</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation" className="text-sm font-medium text-amber-900">
                                                    Confirmar Contraseña *
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password_confirmation"
                                                        type={showPasswordConfirmation ? "text" : "password"}
                                                        name="password_confirmation"
                                                        required
                                                        tabIndex={7}
                                                        autoComplete="new-password"
                                                        placeholder="••••••••••••"
                                                        className="h-11 pr-12 border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500 rounded-lg bg-amber-50"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={togglePasswordConfirmationVisibility}
                                                        className="absolute inset-y-0 right-3 flex items-center text-amber-600 hover:text-amber-800 transition-colors duration-200 cursor-pointer"
                                                        tabIndex={-1}
                                                        aria-label={showPasswordConfirmation ? "Ocultar contraseña" : "Mostrar contraseña"}
                                                    >
                                                        {showPasswordConfirmation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </button>
                                                </div>
                                                <InputError message={errors.password_confirmation} />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón de Registro */}
                                    <div className="pt-6 border-t border-amber-100">
                                        <Button
                                            type="submit"
                                            className="w-full h-12 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                                            tabIndex={8}
                                            disabled={processing}
                                            data-test="register-user-button"
                                        >
                                            {processing ? (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <LoaderCircle className="h-5 w-5 animate-spin" />
                                                    <span>Creando cuenta...</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-center space-x-2">
                                                    <GraduationCap className="h-5 w-5" />
                                                    <span>Crear Cuenta de Docente</span>
                                                </div>
                                            )}
                                        </Button>

                                        <p className="text-xs text-amber-600 text-center mt-3">
                                            Al registrarte, podrás completar tu perfil profesional para recibir recomendaciones personalizadas
                                        </p>
                                    </div>

                                    {/* Link de Login */}
                                    <div className="text-center pt-4 border-t border-amber-100">
                                        <p className="text-sm text-amber-700">
                                            ¿Ya tienes cuenta?
                                        </p>
                                        <TextLink
                                            href={login()}
                                            tabIndex={9}
                                            className="text-amber-600 hover:text-amber-800 font-semibold text-sm mt-1 inline-block"
                                        >
                                            Iniciar Sesión →
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
        </div>
    );
}
