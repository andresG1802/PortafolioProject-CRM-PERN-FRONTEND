import { EtapaOportunidad, TipoTarea } from '../types';

export const formatDate = (date?: string | Date | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
};

export const formatDateTime = (date?: string | Date | null): string => {
    if (!date) return '';
    return new Date(date).toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const formatCurrency = (amount?: number | null): string => {
    return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(amount ?? 0);
};

export const toDateInputValue = (date?: string | Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60000);
    return local.toISOString().slice(0, 16);
};

export const ETAPAS_OPORTUNIDAD: EtapaOportunidad[] = ['NUEVO', 'CONTACTADO', 'PROPUESTA', 'NEGOCIACION', 'GANADA', 'PERDIDA'];
export const TIPOS_TAREA: TipoTarea[] = ['LLAMADA', 'REUNION', 'EMAIL', 'OTRO'];

export const getInitials = (name?: string | null): string => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const initials = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : parts[0].slice(0, 2);
    return initials.toUpperCase();
};
