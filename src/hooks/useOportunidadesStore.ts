import Swal from 'sweetalert2';
import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onAddOportunidad,
    onClearActiveOportunidad,
    onDeleteOportunidad,
    onSetActiveOportunidad,
    onSetOportunidades,
    onUpdateOportunidad,
} from '../store';
import { Oportunidad, OportunidadPayload } from '../types';

export const useOportunidadesStore = () => {
    const dispatch = useAppDispatch();
    const { isLoadingOportunidades, oportunidades, activeOportunidad } = useAppSelector((state) => state.oportunidades);

    const startLoadingOportunidades = async () => {
        try {
            const { data } = await crmApi.get('/oportunidades');
            dispatch(onSetOportunidades(data));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las oportunidades', 'error');
        }
    };

    const startSavingOportunidad = async (oportunidadData: OportunidadPayload): Promise<boolean> => {
        try {
            if (oportunidadData.id) {
                const { data } = await crmApi.put(`/oportunidades/${oportunidadData.id}`, oportunidadData);
                dispatch(onUpdateOportunidad(data));
            } else {
                const { data } = await crmApi.post('/oportunidades', oportunidadData);
                dispatch(onAddOportunidad(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo guardar la oportunidad', 'error');
            return false;
        }
    };

    const startDeletingOportunidad = async (id: number) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar oportunidad?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!isConfirmed) return;

        try {
            await crmApi.delete(`/oportunidades/${id}`);
            dispatch(onDeleteOportunidad(id));
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar la oportunidad', 'error');
        }
    };

    const setActiveOportunidad = (oportunidad: Oportunidad) => dispatch(onSetActiveOportunidad(oportunidad));
    const clearActiveOportunidad = () => dispatch(onClearActiveOportunidad());

    return {
        isLoadingOportunidades,
        oportunidades,
        activeOportunidad,

        startLoadingOportunidades,
        startSavingOportunidad,
        startDeletingOportunidad,
        setActiveOportunidad,
        clearActiveOportunidad,
    };
};
