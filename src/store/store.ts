import { configureStore } from '@reduxjs/toolkit';
import { authSlice, clientesSlice, oportunidadesSlice, tareasSlice, uiSlice } from './';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        clientes: clientesSlice.reducer,
        oportunidades: oportunidadesSlice.reducer,
        tareas: tareasSlice.reducer,
        ui: uiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
