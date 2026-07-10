export type Role = 'ADMIN' | 'VENDEDOR';
export type EstadoCliente = 'ACTIVO' | 'INACTIVO';
export type EtapaOportunidad = 'NUEVO' | 'CONTACTADO' | 'PROPUESTA' | 'NEGOCIACION' | 'GANADA' | 'PERDIDA';
export type TipoTarea = 'LLAMADA' | 'REUNION' | 'EMAIL' | 'OTRO';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: Role;
}

export interface Cliente {
    id: number;
    nombre: string;
    empresa?: string | null;
    email?: string | null;
    telefono?: string | null;
    direccion?: string | null;
    estado: EstadoCliente;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Contacto {
    id: number;
    nombre: string;
    cargo?: string | null;
    email?: string | null;
    telefono?: string | null;
    clienteId: number;
}

export interface Oportunidad {
    id: number;
    titulo: string;
    descripcion?: string | null;
    monto: number;
    etapa: EtapaOportunidad;
    fechaCierreEstimada?: string | null;
    clienteId: number;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Tarea {
    id: number;
    titulo: string;
    descripcion?: string | null;
    tipo: TipoTarea;
    fechaVencimiento: string;
    completada: boolean;
    clienteId?: number | null;
    oportunidadId?: number | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Nota {
    id: number;
    contenido: string;
    clienteId?: number | null;
    oportunidadId?: number | null;
    userId: number;
    createdAt: string;
}

export type ClientePayload = Partial<Omit<Cliente, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> & { id?: number };
export type ContactoPayload = Partial<Omit<Contacto, 'id'>> & { id?: number };
export type OportunidadPayload = Partial<Omit<Oportunidad, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> & { id?: number };
export type TareaPayload = Partial<Omit<Tarea, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> & { id?: number };
