import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { type NavGroup } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface NavCollapsibleProps {
    groups: NavGroup[];
}

export function NavCollapsible({ groups = [] }: NavCollapsibleProps) {
    const page = usePage();
    const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

    // Cargar estado persistente del localStorage
    useEffect(() => {
        const savedState = localStorage.getItem('sidebar-nav-state');
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState);
                setOpenGroups(parsedState);
            } catch (error) {
                console.warn('Error loading sidebar state:', error);
            }
        }
    }, []);

    const toggleGroup = (groupTitle: string) => {
        setOpenGroups(prev => {
            const newState = {
                ...prev,
                [groupTitle]: !prev[groupTitle]
            };

            // Guardar estado en localStorage
            localStorage.setItem('sidebar-nav-state', JSON.stringify(newState));

            return newState;
        });
    };

    const isGroupActive = (group: NavGroup): boolean => {
        return group.items.some(item =>
            page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)
        );
    };

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {groups.map((group) => {
                    const isActive = isGroupActive(group);
                    const isOpen = openGroups[group.title] || false;

                    return (
                        <Collapsible
                            key={group.title}
                            open={isOpen}
                            onOpenChange={() => toggleGroup(group.title)}
                        >
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        className="cursor-pointer"
                                        isActive={isActive}
                                        tooltip={{ children: group.title }}
                                    >
                                        {group.icon && <group.icon />}
                                        <span>{group.title}</span>
                                        <ChevronRight
                                            className={`h-4 w-4 transition-all duration-300 ease-out group-hover:scale-110 group-data-[collapsible=icon]:hidden ml-auto ${
                                                isOpen ? 'rotate-90 text-sidebar-accent-foreground' : 'rotate-0 text-muted-foreground'
                                            }`}
                                        />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent
                                    className="overflow-hidden transition-all duration-300 ease-in-out data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down group-data-[collapsible=icon]:hidden"
                                    style={{
                                        '--collapsible-height': `${group.items.length * 40}px`,
                                    } as React.CSSProperties}
                                >
                                    <SidebarMenuSub className="ml-4 border-l border-sidebar-border/50 pl-2 space-y-1">
                                        {group.items.map((item, index) => (
                                            <SidebarMenuSubItem
                                                key={item.title}
                                                className="animate-in fade-in slide-in-from-left-2"
                                                style={{
                                                    animationDelay: `${index * 50}ms`,
                                                    animationFillMode: 'both'
                                                }}
                                            >
                                                <SidebarMenuSubButton
                                                    asChild
                                                    isActive={page.url.startsWith(typeof item.href === 'string' ? item.href : item.href.url)}
                                                    className="transition-all duration-200 hover:bg-sidebar-accent/60 hover:translate-x-1 hover:shadow-sm group cursor-pointer"
                                                >
                                                    <Link href={item.href} prefetch>
                                                        {item.icon && (
                                                            <item.icon className="h-4 w-4 transition-colors duration-200 group-hover:text-sidebar-accent-foreground" />
                                                        )}
                                                        <span className="text-sm transition-colors duration-200 group-hover:font-medium">
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                </SidebarMenuSubButton>
                                            </SidebarMenuSubItem>
                                        ))}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
