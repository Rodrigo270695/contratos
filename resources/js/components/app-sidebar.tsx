import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavCollapsible } from '@/components/nav-collapsible';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavItem, type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Users, MapPin, Building2, Map, School, Megaphone, Briefcase, UserCheck, ClipboardList, FileText } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
        icon: Users,
    },
];

// Menús desplegables para el sistema de convocatorias
const structureNavGroups: NavGroup[] = [
    {
        title: 'Estructura Organizacional',
        icon: Building2,
        items: [
            {
                title: 'Regiones',
                href: '/regiones',
                icon: MapPin,
            },
            {
                title: 'UGELs',
                href: '/ugels',
                icon: Building2,
            },
            {
                title: 'Distritos',
                href: '/distritos',
                icon: Map,
            },
            {
                title: 'Instituciones',
                href: '/instituciones',
                icon: School,
            },
        ],
    },
];

const convocatoriasNavGroups: NavGroup[] = [
    {
        title: 'Sistema de Convocatorias',
        icon: Megaphone,
        items: [
            {
                title: 'Convocatorias',
                href: '/convocatorias',
                icon: Megaphone,
            },
            {
                title: 'Plazas',
                href: '/plazas',
                icon: Briefcase,
            },
            {
                title: 'Postulaciones',
                href: '/postulaciones',
                icon: UserCheck,
            },
            {
                title: 'Evaluaciones',
                href: '/evaluaciones',
                icon: ClipboardList,
            },
            {
                title: 'Documentos',
                href: '/documentos',
                icon: FileText,
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
                <NavCollapsible groups={structureNavGroups} />
                <NavCollapsible groups={convocatoriasNavGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
