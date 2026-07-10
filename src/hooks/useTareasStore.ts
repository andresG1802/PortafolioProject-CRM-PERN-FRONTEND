import Swal from 'sweetalert2';
import crmApi from '../api/crmApi';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onAddTarea,
    onClearActiveTarea,
    onDeleteTarea,
    onSetActiveTarea,
    onSetTareas,
    onUpdateTarea,
} from '../store';
import { Tarea, TareaPayload } from '../types';

export const useTareasStore = () => {
    const dispatch = useAppDispatch();
    const { isLoadingTareas, tareas, activeTarea } = useAppSelector((state) => state.tareas);

    const startLoadingTareas = async () => {
        try {
            const { data } = await crmApi.get('/tareas');
            dispatch(onSetTareas(data));
        } catch (error) {
            Swal.fire('Error', 'No se pudieron cargar las tareas', 'error');
        }
    };

    const startSavingTarea = async (tareaData: TareaPayload): Promise<boolean> => {
        try {
            if (tareaData.id) {
                const { data } = await crmApi.put(`/tareas/${tareaData.id}`, tareaData);
                dispatch(onUpdateTarea(data));
            } else {
                const { data } = await crmApi.post('/tareas', tareaData);
                dispatch(onAddTarea(data));
            }
            return true;
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo guardar la tarea', 'error');
            return false;
        }
    };

    const startTogglingCompletada = async (tarea: Tarea) => {
        try {
            const { data } = await crmApi.put(`/tareas/${tarea.id}`, { completada: !tarea.completada });
            dispatch(onUpdateTarea(data));
        } catch (error) {
            Swal.fire('Error', 'No se pudo actualizar la tarea', 'error');
        }
    };

    const startDeletingTarea = async (id: number) => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Eliminar tarea?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
        });
        if (!isConfirmed) return;

        try {
            await crmApi.delete(`/tareas/${id}`);
            dispatch(onDeleteTarea(id));
        } catch (error: any) {
            Swal.fire('Error', error.response?.data?.error || 'No se pudo eliminar la tarea', 'error');
        }
    };

    const setActiveTarea = (tarea: Tarea) => dispatch(onSetActiveTarea(tarea));
    const clearActiveTarea = () => dispatch(onClearActiveTarea());

    return {
        isLoadingTareas,
        tareas,
        activeTarea,

        startLoadingTareas,
        startSavingTarea,
        startTogglingCompletada,
        startDeletingTarea,
        setActiveTarea,
        clearActiveTarea,
    };
};
