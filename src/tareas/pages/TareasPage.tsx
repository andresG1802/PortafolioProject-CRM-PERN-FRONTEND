import { useEffect, useMemo, useState } from 'react';

import { useClientesStore, useTareasStore, useUiStore } from '../../hooks';
import { formatDateTime } from '../../helpers';
import { Tarea, TipoTarea } from '../../types';
import { TareaModal } from '../components/TareaModal';

const TIPO_BADGE: Record<TipoTarea, string> = {
    LLAMADA: 'badge-info',
    REUNION: 'badge-primary',
    EMAIL: 'badge-secondary',
    OTRO: 'badge-dark',
};

type Filtro = 'pendientes' | 'completadas' | 'todas';

export const TareasPage = () => {
    const { openTareaModal } = useUiStore();
    const {
        tareas,
        isLoadingTareas,
        startLoadingTareas,
        setActiveTarea,
        clearActiveTarea,
        startTogglingCompletada,
        startDeletingTarea,
    } = useTareasStore();
    const { clientes, startLoadingClientes } = useClientesStore();

    const [filtro, setFiltro] = useState<Filtro>('pendientes');

    useEffect(() => {
        startLoadingTareas();
        startLoadingClientes();
    }, []);

    const clienteNombre = (clienteId: number) => clientes.find((cliente) => cliente.id === clienteId)?.nombre;

    const tareasFiltradas = useMemo(() => {
        if (filtro === 'pendientes') return tareas.filter((tarea) => !tarea.completada);
        if (filtro === 'completadas') return tareas.filter((tarea) => tarea.completada);
        return tareas;
    }, [tareas, filtro]);

    const onNewTarea = () => {
        clearActiveTarea();
        openTareaModal();
    };

    const onEditTarea = (tarea: Tarea) => {
        setActiveTarea(tarea);
        openTareaModal();
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="m-0 text-2xl">Tareas</h3>
                    <span className="text-sm text-app-muted">{tareasFiltradas.length} tarea{tareasFiltradas.length === 1 ? '' : 's'}</span>
                </div>
                <button className="btn-primary" onClick={onNewTarea}>
                    <i className="fas fa-plus"></i> Nueva tarea
                </button>
            </div>

            <div className="segmented mb-4">
                <button
                    className={`segmented-btn ${filtro === 'pendientes' ? 'active' : ''}`}
                    onClick={() => setFiltro('pendientes')}
                >
                    Pendientes
                </button>
                <button
                    className={`segmented-btn ${filtro === 'completadas' ? 'active' : ''}`}
                    onClick={() => setFiltro('completadas')}
                >
                    Completadas
                </button>
                <button
                    className={`segmented-btn ${filtro === 'todas' ? 'active' : ''}`}
                    onClick={() => setFiltro('todas')}
                >
                    Todas
                </button>
            </div>

            {isLoadingTareas ? (
                <p>Cargando...</p>
            ) : (
                <ul className="list-group">
                    {tareasFiltradas.map((tarea) => (
                        <li key={tarea.id} className="list-group-item">
                            <div className="flex items-start gap-2">
                                <input
                                    type="checkbox"
                                    className="mt-1 h-4 w-4 rounded accent-primary"
                                    checked={tarea.completada}
                                    onChange={() => startTogglingCompletada(tarea)}
                                />
                                <div>
                                    <span className={tarea.completada ? 'text-app-muted line-through' : ''}>
                                        {tarea.titulo}
                                    </span>{' '}
                                    <span className={TIPO_BADGE[tarea.tipo]}>{tarea.tipo}</span>
                                    <div className="text-sm text-app-muted">
                                        Vence {formatDateTime(tarea.fechaVencimiento)}
                                        {tarea.clienteId && ` · ${clienteNombre(tarea.clienteId)}`}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <button className="btn-outline-primary btn-sm mr-1" onClick={() => onEditTarea(tarea)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn-outline-danger btn-sm" onClick={() => startDeletingTarea(tarea.id)}>
                                    <i className="fas fa-trash-alt"></i>
                                </button>
                            </div>
                        </li>
                    ))}

                    {tareasFiltradas.length === 0 && (
                        <li>
                            <div className="empty-state py-2">
                                <i className="fas fa-check-square"></i>
                                No hay tareas para mostrar.
                            </div>
                        </li>
                    )}
                </ul>
            )}

            <TareaModal />
        </div>
    );
};
