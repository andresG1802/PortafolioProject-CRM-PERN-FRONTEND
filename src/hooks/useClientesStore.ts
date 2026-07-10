import Swal from 'sweetalert2';
import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onAddCliente,
    onAddContacto,
    onAddNota,
    onClearActiveCliente,
    onDeleteCliente,
    onDeleteContacto,
    onDeleteNota,
    onSetActiveCliente,
    onSetClientes,
    onSetContactos,
    onSetNotas,
    onUpdateCliente,
    onUpdateContacto,
} from '../store';
import { Cliente, ClientePayload, ContactoPayload } from '../types';

export const useClientesStore = () => {
    const dispatch = useAppDispatch();
    const { isLoadingClientes, clientes, activeCliente, contactos, notas } = useAppSelector((state) => state.clientes);

    const startLoadingClientes = async () => {
        try {
            const { data } = await crmApi.get('/clientes');
            dispatch(onSetClientes(data));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los clientes', 'error');
        }
    };

    const startSavingCliente = async (clienteData: ClientePayload): Promise<boolean> => {
        try {
            if (clienteData.id) {
                const { data } = await crmApi.put(`/clientes/${clienteData.id}`, clienteData);
                dispatch(onUpdateCliente(data));
            } else {
                const { data } = await crmApi.post('/clientes', clienteData);
                dispatch(onAddCliente(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo guardar el cliente', 'error');
            return false;
        }
    };

    const startDeletingCliente = async (id: number) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar cliente?',
            text: 'Se eliminarán también sus contactos, oportunidades, tareas y notas asociadas.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!isConfirmed) return;

        try {
            await crmApi.delete(`/clientes/${id}`);
            dispatch(onDeleteCliente(id));
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar el cliente', 'error');
        }
    };

    const startLoadingClienteDetail = async (id: number | string) => {
        try {
            const { data } = await crmApi.get(`/clientes/${id}`);
            dispatch(onSetActiveCliente(data));
            await Promise.all([startLoadingContactos(id), startLoadingNotas(id)]);
        } catch (error) {
            Swal.fire('Error', 'No se pudo cargar el cliente', 'error');
        }
    };

    const setActiveCliente = (cliente: Cliente) => dispatch(onSetActiveCliente(cliente));
    const clearActiveCliente = () => dispatch(onClearActiveCliente());

    const startLoadingContactos = async (clienteId: number | string) => {
        try {
            const { data } = await crmApi.get(`/contactos/cliente/${clienteId}`);
            dispatch(onSetContactos(data));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar los contactos', 'error');
        }
    };

    const startSavingContacto = async (contactoData: ContactoPayload): Promise<boolean> => {
        try {
            if (contactoData.id) {
                const { data } = await crmApi.put(`/contactos/${contactoData.id}`, contactoData);
                dispatch(onUpdateContacto(data));
            } else {
                const { data } = await crmApi.post('/contactos', { ...contactoData, clienteId: activeCliente?.id });
                dispatch(onAddContacto(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo guardar el contacto', 'error');
            return false;
        }
    };

    const startDeletingContacto = async (id: number) => {
        try {
            await crmApi.delete(`/contactos/${id}`);
            dispatch(onDeleteContacto(id));
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar el contacto', 'error');
        }
    };

    const startLoadingNotas = async (clienteId: number | string) => {
        try {
            const { data } = await crmApi.get('/notas');
            dispatch(onSetNotas(data.filter((nota: any) => nota.clienteId === Number(clienteId))));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las notas', 'error');
        }
    };

    const startSavingNota = async (contenido: string) => {
        try {
            const { data } = await crmApi.post('/notas', { contenido, clienteId: activeCliente?.id });
            dispatch(onAddNota(data));
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo guardar la nota', 'error');
        }
    };

    const startDeletingNota = async (id: number) => {
        try {
            await crmApi.delete(`/notas/${id}`);
            dispatch(onDeleteNota(id));
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar la nota', 'error');
        }
    };

    return {
        isLoadingClientes,
        clientes,
        activeCliente,
        contactos,
        notas,

        startLoadingClientes,
        startSavingCliente,
        startDeletingCliente,
        startLoadingClienteDetail,
        setActiveCliente,
        clearActiveCliente,

        startSavingContacto,
        startDeletingContacto,

        startSavingNota,
        startDeletingNota,
    };
};
