import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { onChecking, onLogin, onLogout } from '../store';

interface Credentials {
    email: string;
    password: string;
}

interface RegisterData extends Credentials {
    name: string;
}

export const useAuthStore = () => {
    const dispatch = useAppDispatch();
    const { status, user, errorMessage } = useAppSelector((state) => state.auth);

    const startLogin = async ({ email, password }: Credentials) => {
        dispatch(onChecking());
        try {
            const { data } = await crmApi.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            dispatch(onLogin(data.user));
        } catch (error: any) {
            dispatch(onLogout(error.response?.data?.error || 'Credenciales incorrectas'));
        }
    };

    const startRegister = async ({ name, email, password }: RegisterData) => {
        dispatch(onChecking());
        try {
            const { data } = await crmApi.post('/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            dispatch(onLogin(data.user));
        } catch (error: any) {
            dispatch(onLogout(error.response?.data?.error || 'No se pudo registrar el usuario'));
        }
    };

    const checkAuthToken = () => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (!token || !user) {
            dispatch(onLogout(undefined));
            return;
        }

        dispatch(onLogin(JSON.parse(user)));
    };

    const startLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch(onLogout(undefined));
    };

    return {
        status,
        user,
        errorMessage,

        checkAuthToken,
        startLogin,
        startLogout,
        startRegister,
    };
};
