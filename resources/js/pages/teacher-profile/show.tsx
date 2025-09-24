import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { type SharedData } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { User, Brain, Star, CheckCircle, AlertCircle, Save, ArrowLeft, Home, GraduationCap } from 'lucide-react';
import { useState } from 'react';

interface TeacherProfile {
    id: number;
    user_id: number;
    especialidad_principal: string | null;
    experiencia_anos: number;
    niveles_experiencia: string[] | null;
    ubicacion_actual: string | null;
    ubicaciones_interes: string[] | null;
    disponibilidad_horaria: string;
    tipo_contrato_preferido: string;
    telefono: string | null;
    sobre_mi: string | null;
    score_perfil: number;
    perfil_completo: boolean;
    created_at: string;
    updated_at: string;
}

interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    user_type: string;
}

interface TeacherProfileShowProps extends SharedData {
    profile: TeacherProfile;
    user: User;
    especialidades: Record<string, string>;
    nivelesEducativos: Record<string, string>;
}

export default function TeacherProfileShow() {
    const { profile, user, especialidades, nivelesEducativos } = usePage<TeacherProfileShowProps>().props;
    const [selectedNiveles, setSelectedNiveles] = useState<string[]>(profile.niveles_experiencia || []);
    const [selectedUbicaciones, setSelectedUbicaciones] = useState<string[]>(profile.ubicaciones_interes || []);

    const { data, setData, post, processing, errors } = useForm({
        especialidad_principal: profile.especialidad_principal || '',
        experiencia_anos: profile.experiencia_anos || 0,
        niveles_experiencia: profile.niveles_experiencia || [],
        ubicacion_actual: profile.ubicacion_actual || '',
        ubicaciones_interes: profile.ubicaciones_interes || [],
        disponibilidad_horaria: profile.disponibilidad_horaria || 'tiempo_completo',
        tipo_contrato_preferido: profile.tipo_contrato_preferido || 'ambos',
        telefono: profile.telefono || '',
        sobre_mi: profile.sobre_mi || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/mi-perfil-docente');
    };

    const handleNivelChange = (nivel: string, checked: boolean) => {
        const newNiveles = checked
            ? [...selectedNiveles, nivel]
            : selectedNiveles.filter(n => n !== nivel);

        setSelectedNiveles(newNiveles);
        setData('niveles_experiencia', newNiveles);
    };

    const addUbicacion = () => {
        const input = document.getElementById('nueva-ubicacion') as HTMLInputElement;
        const nuevaUbicacion = input.value.trim();

        if (nuevaUbicacion && !selectedUbicaciones.includes(nuevaUbicacion)) {
            const newUbicaciones = [...selectedUbicaciones, nuevaUbicacion];
            setSelectedUbicaciones(newUbicaciones);
            setData('ubicaciones_interes', newUbicaciones);
            input.value = '';
        }
    };

    const removeUbicacion = (ubicacion: string) => {
        const newUbicaciones = selectedUbicaciones.filter(u => u !== ubicacion);
        setSelectedUbicaciones(newUbicaciones);
        setData('ubicaciones_interes', newUbicaciones);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBg = (score: number) => {
        if (score >= 80) return 'bg-green-100 border-green-200';
        if (score >= 60) return 'bg-yellow-100 border-yellow-200';
        return 'bg-red-100 border-red-200';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
            <Head title="Mi Perfil Docente - Sistema de IA" />

            <div className="w-full max-w-4xl">
                {/* Botón para volver a convocatorias */}
                <div className="flex justify-center mb-6">
                    <a
                        href="/"
                        className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-lg transition-all duration-200 text-sm font-medium"
                    >
                        <Home className="h-4 w-4" />
                        <span>Volver a Convocatorias</span>
                    </a>
                </div>

                {/* Header con Logo */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-full flex items-center justify-center shadow-xl mb-4">
                        <Brain className="text-white h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-blue-900 mb-2">
                        🤖 Mi Perfil Docente
                    </h1>
                    <p className="text-blue-700 text-lg">
                        Completa tu información para recibir recomendaciones personalizadas con IA
                    </p>
                </div>

                {/* Score del perfil */}
                <div className={`mb-8 p-6 rounded-xl border shadow-lg ${getScoreBg(profile.score_perfil)}`}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <Brain className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Score del Perfil para IA</h3>
                                <p className="text-sm text-gray-600">
                                    {profile.perfil_completo
                                        ? 'Tu perfil está completo para recibir recomendaciones'
                                        : 'Completa más información para mejores recomendaciones'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className={`text-3xl font-bold ${getScoreColor(profile.score_perfil)}`}>
                                {profile.score_perfil}%
                            </div>
                            {profile.perfil_completo ? (
                                <CheckCircle className="h-6 w-6 text-green-600 mx-auto mt-1" />
                            ) : (
                                <AlertCircle className="h-6 w-6 text-amber-600 mx-auto mt-1" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Card Principal del Formulario */}
                <div className="bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden">
                    {/* Header del Card */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6">
                        <h2 className="text-xl font-semibold text-white text-center">
                            Completa tu Perfil Profesional
                        </h2>
                        <p className="text-blue-100 text-sm text-center mt-1">
                            Información necesaria para recomendaciones personalizadas
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="px-8 py-8 space-y-8">
                        {/* Información Básica */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 border-b border-blue-100 pb-2">
                                <User className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-blue-900">Información Personal</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="nombre" className="text-sm font-medium text-blue-900">
                                        Nombre Completo
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={`${user.first_name} ${user.last_name}`}
                                        disabled
                                        className="h-11 border-2 border-blue-200 bg-blue-50 text-gray-600 rounded-lg"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telefono" className="text-sm font-medium text-blue-900">
                                        Teléfono *
                                    </Label>
                                    <Input
                                        id="telefono"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                        placeholder="987654321"
                                        maxLength={9}
                                        className={`h-11 border-2 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-blue-50 ${
                                            errors.telefono ? 'border-red-500' : 'border-blue-200'
                                        }`}
                                    />
                                    {errors.telefono && (
                                        <p className="text-sm text-red-600 mt-1">{errors.telefono}</p>
                                    )}
                                    <p className="text-xs text-blue-600">9 dígitos del número celular</p>
                                </div>
                            </div>
                        </div>

                        {/* Especialización (40% del algoritmo) */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 border-b border-blue-100 pb-2">
                                <GraduationCap className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-blue-900">🎓 Especialización (Factor principal - 40%)</h3>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="especialidad_principal" className="text-sm font-medium text-blue-900">
                                    Especialidad Principal *
                                </Label>
                                <Select value={data.especialidad_principal} onValueChange={(value) => setData('especialidad_principal', value)}>
                                    <SelectTrigger className={`h-11 border-2 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-blue-50 ${
                                        errors.especialidad_principal ? 'border-red-500' : 'border-blue-200'
                                    }`}>
                                        <SelectValue placeholder="Selecciona tu especialidad principal" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(especialidades).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.especialidad_principal && (
                                    <p className="text-sm text-red-600 mt-1">{errors.especialidad_principal}</p>
                                )}
                                <p className="text-xs text-blue-600">Esta especialidad es el factor más importante para las recomendaciones</p>
                            </div>
                        </div>

                        {/* Experiencia (25% del algoritmo) */}
                        <div className="space-y-6">
                            <div className="flex items-center space-x-2 border-b border-blue-100 pb-2">
                                <Star className="h-5 w-5 text-blue-600" />
                                <h3 className="text-lg font-semibold text-blue-900">⏱️ Experiencia (25% del algoritmo)</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="experiencia_anos" className="text-sm font-medium text-blue-900">
                                        Años de Experiencia *
                                    </Label>
                                    <Input
                                        id="experiencia_anos"
                                        type="number"
                                        min="0"
                                        max="50"
                                        value={data.experiencia_anos}
                                        onChange={(e) => setData('experiencia_anos', parseInt(e.target.value) || 0)}
                                        className={`h-11 border-2 focus:border-blue-500 focus:ring-blue-500 rounded-lg bg-blue-50 ${
                                            errors.experiencia_anos ? 'border-red-500' : 'border-blue-200'
                                        }`}
                                        placeholder="0"
                                    />
                                    {errors.experiencia_anos && (
                                        <p className="text-sm text-red-600 mt-1">{errors.experiencia_anos}</p>
                                    )}
                                    <p className="text-xs text-blue-600">Años como docente en instituciones educativas</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-blue-900">
                                        Niveles donde has trabajado *
                                    </Label>
                                    <div className="space-y-3 mt-2 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
                                        {Object.entries(nivelesEducativos).map(([key, label]) => (
                                            <div key={key} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`nivel-${key}`}
                                                    checked={selectedNiveles.includes(key)}
                                                    onChange={(e) => handleNivelChange(key, e.target.checked)}
                                                    className="rounded border-blue-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                                                />
                                                <Label htmlFor={`nivel-${key}`} className="ml-3 cursor-pointer text-sm text-blue-900">
                                                    {label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.niveles_experiencia && (
                                        <p className="text-sm text-red-600 mt-1">{errors.niveles_experiencia}</p>
                                    )}
                                    <p className="text-xs text-blue-600">Selecciona todos los niveles donde tienes experiencia</p>
                                </div>
                            </div>
                        </div>

                        {/* Ubicación (15% del algoritmo) */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                📍 Ubicación (15% del algoritmo)
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="ubicacion_actual">Ubicación Actual *</Label>
                                    <Input
                                        id="ubicacion_actual"
                                        value={data.ubicacion_actual}
                                        onChange={(e) => setData('ubicacion_actual', e.target.value)}
                                        placeholder="Ej: Chiclayo, Lambayeque"
                                        className={errors.ubicacion_actual ? 'border-red-500' : ''}
                                    />
                                    {errors.ubicacion_actual && (
                                        <p className="text-sm text-red-600 mt-1">{errors.ubicacion_actual}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="nueva-ubicacion">Ubicaciones de Interés</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="nueva-ubicacion"
                                            placeholder="Agregar ubicación de interés"
                                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addUbicacion())}
                                        />
                                        <Button type="button" onClick={addUbicacion} variant="outline">
                                            Agregar
                                        </Button>
                                    </div>

                                    {selectedUbicaciones.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {selectedUbicaciones.map((ubicacion, index) => (
                                                <span
                                                    key={index}
                                                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                                >
                                                    {ubicacion}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeUbicacion(ubicacion)}
                                                        className="ml-2 text-blue-600 hover:text-blue-800"
                                                    >
                                                        ×
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Disponibilidad (10% del algoritmo) */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                ⏰ Disponibilidad (10% del algoritmo)
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="disponibilidad_horaria">Disponibilidad Horaria</Label>
                                    <Select value={data.disponibilidad_horaria} onValueChange={(value) => setData('disponibilidad_horaria', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="tiempo_completo">Tiempo Completo</SelectItem>
                                            <SelectItem value="medio_tiempo">Medio Tiempo</SelectItem>
                                            <SelectItem value="flexible">Flexible</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="tipo_contrato_preferido">Tipo de Contrato Preferido</Label>
                                    <Select value={data.tipo_contrato_preferido} onValueChange={(value) => setData('tipo_contrato_preferido', value)}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="contratacion">Contratación</SelectItem>
                                            <SelectItem value="nombramiento">Nombramiento</SelectItem>
                                            <SelectItem value="ambos">Ambos</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>

                        {/* Información Adicional */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                📝 Información Adicional
                            </h2>

                            <div>
                                <Label htmlFor="sobre_mi">Sobre Mí</Label>
                                <textarea
                                    id="sobre_mi"
                                    value={data.sobre_mi}
                                    onChange={(e) => setData('sobre_mi', e.target.value)}
                                    rows={4}
                                    placeholder="Cuéntanos sobre tu experiencia, logros, metodologías que manejas, etc."
                                    className={`w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                                        errors.sobre_mi ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.sobre_mi && (
                                    <p className="text-sm text-red-600 mt-1">{errors.sobre_mi}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                    Máximo 1000 caracteres
                                </p>
                            </div>
                        </div>

                        {/* Botón de guardar */}
                        <div className="pt-6 border-t border-blue-100">
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] focus:scale-[1.02]"
                            >
                                {processing ? (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Save className="h-5 w-5 animate-spin" />
                                        <span>Guardando perfil...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center space-x-2">
                                        <Brain className="h-5 w-5" />
                                        <span>Guardar Perfil para IA</span>
                                    </div>
                                )}
                            </Button>

                            <p className="text-xs text-blue-600 text-center mt-3">
                                Tu información se usa exclusivamente para generar recomendaciones personalizadas
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer */}
                <div className="text-center mt-8 text-xs text-blue-600">
                    <p>© 2025 UGEL Lambayeque - Sistema de Convocatorias Docentes</p>
                    <p className="mt-1">Powered by IA - Gobierno Regional de Lambayeque - Perú 🇵🇪</p>
                </div>
            </div>
        </div>
    );
}
