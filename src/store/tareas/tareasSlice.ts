import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Tarea } from '../../types';

interface TareasState {
    isLoadingTareas: boolean;
    tareas: Tarea[];
    activeTarea: Tarea | null;
}

const initialState: TareasState = {
    isLoadingTareas: true,
    tareas: [],
    activeTarea: null,
};

export const tareasSlice = createSlice({
    name: 'tareas',
    initialState,
    reducers: {
        onSetTareas: (state, { payload }: PayloadAction<Tarea[]>) => {
            state.isLoadingTareas = false;
            state.tareas = payload;
        },
        onAddTarea: (state, { payload }: PayloadAction<Tarea>) => {
            state.tareas.push(payload);
        },
        onUpdateTarea: (state, { payload }: PayloadAction<Tarea>) => {
            state.tareas = state.tareas.map((tarea) => (tarea.id === payload.id ? payload : tarea));
        },
        onDeleteTarea: (state, { payload }: PayloadAction<number>) => {
            state.tareas = state.tareas.filter((tarea) => tarea.id !== payload);
        },
        onSetActiveTarea: (state, { payload }: PayloadAction<Tarea>) => {
            state.activeTarea = payload;
        },
        onClearActiveTarea: (state) => {
            state.activeTarea = null;
        },
    },
});

export const {
    onSetTareas,
    onAddTarea,
    onUpdateTarea,
    onDeleteTarea,
    onSetActiveTarea,
    onClearActiveTarea,
} = tareasSlice.actions;
