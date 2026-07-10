import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Cliente, Contacto, Nota } from '../../types';

interface ClientesState {
    isLoadingClientes: boolean;
    clientes: Cliente[];
    activeCliente: Cliente | null;
    contactos: Contacto[];
    notas: Nota[];
}

const initialState: ClientesState = {
    isLoadingClientes: true,
    clientes: [],
    activeCliente: null,
    contactos: [],
    notas: [],
};

export const clientesSlice = createSlice({
    name: 'clientes',
    initialState,
    reducers: {
        onSetClientes: (state, { payload }: PayloadAction<Cliente[]>) => {
            state.isLoadingClientes = false;
            state.clientes = payload;
        },
        onAddCliente: (state, { payload }: PayloadAction<Cliente>) => {
            state.clientes.push(payload);
        },
        onUpdateCliente: (state, { payload }: PayloadAction<Cliente>) => {
            state.clientes = state.clientes.map((cliente) => (cliente.id === payload.id ? payload : cliente));
            if (state.activeCliente?.id === payload.id) state.activeCliente = payload;
        },
        onDeleteCliente: (state, { payload }: PayloadAction<number>) => {
            state.clientes = state.clientes.filter((cliente) => cliente.id !== payload);
        },
        onSetActiveCliente: (state, { payload }: PayloadAction<Cliente>) => {
            state.activeCliente = payload;
            state.contactos = [];
            state.notas = [];
        },
        onClearActiveCliente: (state) => {
            state.activeCliente = null;
            state.contactos = [];
            state.notas = [];
        },
        onSetContactos: (state, { payload }: PayloadAction<Contacto[]>) => {
            state.contactos = payload;
        },
        onAddContacto: (state, { payload }: PayloadAction<Contacto>) => {
            state.contactos.push(payload);
        },
        onUpdateContacto: (state, { payload }: PayloadAction<Contacto>) => {
            state.contactos = state.contactos.map((contacto) => (contacto.id === payload.id ? payload : contacto));
        },
        onDeleteContacto: (state, { payload }: PayloadAction<number>) => {
            state.contactos = state.contactos.filter((contacto) => contacto.id !== payload);
        },
        onSetNotas: (state, { payload }: PayloadAction<Nota[]>) => {
            state.notas = payload;
        },
        onAddNota: (state, { payload }: PayloadAction<Nota>) => {
            state.notas.unshift(payload);
        },
        onDeleteNota: (state, { payload }: PayloadAction<number>) => {
            state.notas = state.notas.filter((nota) => nota.id !== payload);
        },
    },
});

export const {
    onSetClientes,
    onAddCliente,
    onUpdateCliente,
    onDeleteCliente,
    onSetActiveCliente,
    onClearActiveCliente,
    onSetContactos,
    onAddContacto,
    onUpdateContacto,
    onDeleteContacto,
    onSetNotas,
    onAddNota,
    onDeleteNota,
} = clientesSlice.actions;
