import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    icon?: LucideIcon | null;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    warning?: string;
    info?: string;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    flash?: FlashMessages;
    [key: string]: unknown;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    dni: string;
    email: string;
    phone?: string;
    user_type: 'admin' | 'docente';
    status: 'active' | 'inactive' | 'pending';
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Region {
    id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface Ugel {
    id: number;
    region_id: number;
    name: string;
    code: string;
    address?: string;
    phone?: string;
    email?: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface District {
    id: number;
    ugel_id: number;
    name: string;
    code: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface Institution {
    id: number;
    district_id: number;
    name: string;
    code: string;
    level: 'inicial' | 'primaria' | 'secundaria';
    modality: 'EBR' | 'EBA' | 'EBE';
    address?: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface Convocatoria {
    id: number;
    title: string;
    description?: string;
    year: number;
    process_type: 'contratacion' | 'nombramiento';
    ugel_id: number;
    start_date: string;
    end_date: string;
    registration_start: string;
    registration_end: string;
    status: 'draft' | 'published' | 'active' | 'closed' | 'cancelled';
    total_plazas: number;
    created_by: number;
    ugel: Ugel;
    creator: {
        id: number;
        first_name: string;
        last_name: string;
    };
    plazas_count?: number;
    plazas_disponibles?: number;
    created_at: string;
    updated_at: string;
}

export interface Plaza {
    id: number;
    convocatoria_id: number;
    institution_id: number;
    codigo_plaza: string;
    cargo: string;
    nivel: 'inicial' | 'primaria' | 'secundaria';
    especialidad?: string;
    jornada: '25' | '30' | '40';
    vacantes: number;
    motivo_vacante: string;
    requisitos?: string;
    status: 'active' | 'filled' | 'cancelled';
    convocatoria: Convocatoria;
    institution: Institution;
    created_at: string;
    updated_at: string;
}

export interface TeacherProfile {
    id: number;
    user_id: number;
    especialidad_principal: string | null;
    experiencia_anos: number;
    niveles_experiencia: string[] | null;
    ubicacion_actual: string | null;
    ubicaciones_interes: string[] | null;
    disponibilidad_horaria: 'tiempo_completo' | 'medio_tiempo' | 'flexible';
    tipo_contrato_preferido: 'contratacion' | 'nombramiento' | 'ambos';
    telefono: string | null;
    sobre_mi: string | null;
    score_perfil: number;
    perfil_completo: boolean;
    created_at: string;
    updated_at: string;
}
