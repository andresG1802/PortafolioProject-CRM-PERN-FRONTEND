import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { useAuthStore } from '../hooks';
import { LoginPage } from '../auth';
import { DashboardLayout } from '../layout';
import { ClientesPage, ClienteDetailPage } from '../clientes';
import { OportunidadesPage } from '../oportunidades';
import { TareasPage } from '../tareas';

export const AppRouter = () => {
    const { status, checkAuthToken } = useAuthStore();

    useEffect(() => {
        checkAuthToken();
    }, []);

    if (status === 'checking') {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" role="status" />
            </div>
        );
    }

    return (
        <Routes>
            {status === 'not-authenticated' ? (
                <>
                    <Route path="/auth/*" element={<LoginPage />} />
                    <Route path="/*" element={<Navigate to="/auth/login" />} />
                </>
            ) : (
                <>
                    <Route path="/" element={<DashboardLayout />}>
                        <Route index element={<Navigate to="/clientes" />} />
                        <Route path="clientes" element={<ClientesPage />} />
                        <Route path="clientes/:id" element={<ClienteDetailPage />} />
                        <Route path="oportunidades" element={<OportunidadesPage />} />
                        <Route path="tareas" element={<TareasPage />} />
                    </Route>
                    <Route path="/*" element={<Navigate to="/" />} />
                </>
            )}
        </Routes>
    );
};
