import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Oportunidad } from '../../types';

interface OportunidadesState {
    isLoadingOportunidades: boolean;
    oportunidades: Oportunidad[];
    activeOportunidad: Oportunidad | null;
}

const initialState: OportunidadesState = {
    isLoadingOportunidades: true,
    oportunidades: [],
    activeOportunidad: null,
};

export const oportunidadesSlice = createSlice({
    name: 'oportunidades',
    initialState,
    reducers: {
        onSetOportunidades: (state, { payload }: PayloadAction<Oportunidad[]>) => {
            state.isLoadingOportunidades = false;
            state.oportunidades = payload;
        },
        onAddOportunidad: (state, { payload }: PayloadAction<Oportunidad>) => {
            state.oportunidades.push(payload);
        },
        onUpdateOportunidad: (state, { payload }: PayloadAction<Oportunidad>) => {
            state.oportunidades = state.oportunidades.map((oportunidad) =>
                oportunidad.id === payload.id ? payload : oportunidad,
            );
        },
        onDeleteOportunidad: (state, { payload }: PayloadAction<number>) => {
            state.oportunidades = state.oportunidades.filter((oportunidad) => oportunidad.id !== payload);
        },
        onSetActiveOportunidad: (state, { payload }: PayloadAction<Oportunidad>) => {
            state.activeOportunidad = payload;
        },
        onClearActiveOportunidad: (state) => {
            state.activeOportunidad = null;
        },
    },
});

export const {
    onSetOportunidades,
    onAddOportunidad,
    onUpdateOportunidad,
    onDeleteOportunidad,
    onSetActiveOportunidad,
    onClearActiveOportunidad,
} = oportunidadesSlice.actions;
