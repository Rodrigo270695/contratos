import React from 'react';
import { router } from '@inertiajs/react';
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
    MoreHorizontal
} from 'lucide-react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: PaginationLink[];
}

interface PaginationProps {
    data: PaginationData;
    perPageOptions?: number[];
    onPerPageChange?: (perPage: number) => void;
    className?: string;
    showPerPageSelector?: boolean;
    showInfo?: boolean;
}

export default function Pagination({
    data,
    perPageOptions = [5, 10, 15, 25, 50, 100],
    onPerPageChange,
    className = '',
    showPerPageSelector = true,
    showInfo = true
}: PaginationProps) {
    const { current_page, last_page, per_page, total, from, to, links } = data;

    // Si no hay suficientes registros para paginar, no mostrar el componente
    if (total <= per_page) {
        return null;
    }

    const handlePageChange = (url: string | null) => {
        if (url) {
            router.visit(url, {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    const handlePerPageChange = (newPerPage: number) => {
        if (onPerPageChange) {
            onPerPageChange(newPerPage);
        } else {
            // Comportamiento por defecto: mantener filtros actuales y cambiar per_page
            const currentUrl = new URL(window.location.href);
            currentUrl.searchParams.set('per_page', newPerPage.toString());
            currentUrl.searchParams.set('page', '1'); // Resetear a la primera página

            router.visit(currentUrl.toString(), {
                preserveState: true,
                preserveScroll: true,
            });
        }
    };

    // Generar números de página visibles
    const generatePageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 7;

        if (last_page <= maxVisiblePages) {
            // Mostrar todas las páginas si son pocas
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Lógica para páginas con ellipsis
            if (current_page <= 4) {
                // Inicio: [1, 2, 3, 4, 5, ..., last]
                for (let i = 1; i <= 5; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(last_page);
            } else if (current_page >= last_page - 3) {
                // Final: [1, ..., last-4, last-3, last-2, last-1, last]
                pages.push(1);
                pages.push('ellipsis');
                for (let i = last_page - 4; i <= last_page; i++) {
                    pages.push(i);
                }
            } else {
                // Medio: [1, ..., current-1, current, current+1, ..., last]
                pages.push(1);
                pages.push('ellipsis');
                for (let i = current_page - 1; i <= current_page + 1; i++) {
                    pages.push(i);
                }
                pages.push('ellipsis');
                pages.push(last_page);
            }
        }

        return pages;
    };

    const pageNumbers = generatePageNumbers();

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            {/* Información de registros y selector - Mobile y Desktop */}
            {showInfo && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        Mostrando {from?.toLocaleString()} - {to?.toLocaleString()} de {total.toLocaleString()} registros
                    </span>

                    {/* Selector de registros por página */}
                    {showPerPageSelector && (
                        <div className="flex items-center space-x-2 text-sm">
                            <span className="text-gray-600 dark:text-gray-400 hidden sm:inline">
                                Mostrar:
                            </span>
                            <select
                                value={per_page}
                                onChange={(e) => handlePerPageChange(Number(e.target.value))}
                                className="rounded-lg border border-gray-300 bg-white px-2 py-1 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white cursor-pointer"
                            >
                                {perPageOptions.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <span className="text-gray-600 dark:text-gray-400">
                                por página
                            </span>
                        </div>
                    )}
                </div>
            )}

            {/* Controles de paginación */}
            <div className="flex items-center justify-center space-x-1 overflow-x-auto">
                {/* Botón Primera Página - Solo desktop */}
                <button
                    onClick={() => handlePageChange(links[0]?.url)}
                    disabled={current_page === 1}
                    className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    title="Primera página"
                >
                    <ChevronsLeft className="h-4 w-4" />
                </button>

                {/* Botón Página Anterior */}
                <button
                    onClick={() => handlePageChange(links.find(link => link.label === '&laquo; Previous')?.url || null)}
                    disabled={current_page === 1}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    title="Página anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Números de página */}
                <div className="flex items-center space-x-1">
                    {pageNumbers.map((page, index) => {
                        if (page === 'ellipsis') {
                            return (
                                <span
                                    key={`ellipsis-${index}`}
                                    className="hidden sm:flex items-center justify-center w-8 h-8 text-gray-400 dark:text-gray-500"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </span>
                            );
                        }

                        const pageNum = page as number;
                        const isActive = pageNum === current_page;
                        const pageLink = links.find(link =>
                            link.label === pageNum.toString()
                        );

                        // En móvil, mostrar solo página actual y adyacentes
                        const showOnMobile = Math.abs(pageNum - current_page) <= 1;

                        return (
                            <button
                                key={pageNum}
                                onClick={() => handlePageChange(pageLink?.url || null)}
                                className={`items-center justify-center w-8 h-8 rounded-lg border text-sm font-medium transition-colors cursor-pointer ${
                                    showOnMobile ? 'flex' : 'hidden sm:flex'
                                } ${
                                    isActive
                                        ? 'border-amber-500 bg-amber-500 text-white shadow-md'
                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                                }`}
                                title={`Página ${pageNum}`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}
                </div>

                {/* Información de página actual en móvil */}
                <div className="flex sm:hidden items-center px-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {current_page} / {last_page}
                    </span>
                </div>

                {/* Botón Página Siguiente */}
                <button
                    onClick={() => handlePageChange(links.find(link => link.label === 'Next &raquo;')?.url || null)}
                    disabled={current_page === last_page}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    title="Página siguiente"
                >
                    <ChevronRight className="h-4 w-4" />
                </button>

                {/* Botón Última Página - Solo desktop */}
                <button
                    onClick={() => handlePageChange(links[links.length - 1]?.url)}
                    disabled={current_page === last_page}
                    className="hidden sm:flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200 transition-colors cursor-pointer"
                    title="Última página"
                >
                    <ChevronsRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
