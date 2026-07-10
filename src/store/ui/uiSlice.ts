import { createSlice } from '@reduxjs/toolkit';

interface UiState {
    isClienteModalOpen: boolean;
    isContactoModalOpen: boolean;
    isOportunidadModalOpen: boolean;
    isTareaModalOpen: boolean;
}

const initialState: UiState = {
    isClienteModalOpen: false,
    isContactoModalOpen: false,
    isOportunidadModalOpen: false,
    isTareaModalOpen: false,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        onOpenClienteModal: (state) => { state.isClienteModalOpen = true; },
        onCloseClienteModal: (state) => { state.isClienteModalOpen = false; },
        onOpenContactoModal: (state) => { state.isContactoModalOpen = true; },
        onCloseContactoModal: (state) => { state.isContactoModalOpen = false; },
        onOpenOportunidadModal: (state) => { state.isOportunidadModalOpen = true; },
        onCloseOportunidadModal: (state) => { state.isOportunidadModalOpen = false; },
        onOpenTareaModal: (state) => { state.isTareaModalOpen = true; },
        onCloseTareaModal: (state) => { state.isTareaModalOpen = false; },
    },
});

export const {
    onOpenClienteModal,
    onCloseClienteModal,
    onOpenContactoModal,
    onCloseContactoModal,
    onOpenOportunidadModal,
    onCloseOportunidadModal,
    onOpenTareaModal,
    onCloseTareaModal,
} = uiSlice.actions;
