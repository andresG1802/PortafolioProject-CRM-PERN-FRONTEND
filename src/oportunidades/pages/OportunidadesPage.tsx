import { useEffect, useMemo, useState } from 'react';

import { useClientesStore, useOportunidadesStore, useUiStore } from '../../hooks';
import { formatCurrency, formatDate, ETAPAS_OPORTUNIDAD } from '../../helpers';
import { EtapaOportunidad, Oportunidad } from '../../types';
import { OportunidadModal } from '../components/OportunidadModal';

const ETAPA_BADGE: Record<EtapaOportunidad, string> = {
    NUEVO: 'badge-secondary',
    CONTACTADO: 'badge-info',
    PROPUESTA: 'badge-warning',
    NEGOCIACION: 'badge-primary',
    GANADA: 'badge-success',
    PERDIDA: 'badge-danger',
};

export const OportunidadesPage = () => {
    const { openOportunidadModal } = useUiStore();
    const {
        oportunidades,
        isLoadingOportunidades,
        startLoadingOportunidades,
        setActiveOportunidad,
        clearActiveOportunidad,
        startDeletingOportunidad,
    } = useOportunidadesStore();
    const { clientes, startLoadingClientes } = useClientesStore();

    const [etapaFiltro, setEtapaFiltro] = useState<EtapaOportunidad | ''>('');

    useEffect(() => {
        startLoadingOportunidades();
        startLoadingClientes();
    }, []);

    const clienteNombre = (clienteId: number) => clientes.find((cliente) => cliente.id === clienteId)?.nombre || '—';

    const oportunidadesFiltradas = useMemo(() => {
        if (!etapaFiltro) return oportunidades;
        return oportunidades.filter((oportunidad) => oportunidad.etapa === etapaFiltro);
    }, [oportunidades, etapaFiltro]);

    const onNewOportunidad = () => {
        clearActiveOportunidad();
        openOportunidadModal();
    };

    const onEditOportunidad = (oportunidad: Oportunidad) => {
        setActiveOportunidad(oportunidad);
        openOportunidadModal();
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="m-0 text-2xl">Oportunidades</h3>
                    <span className="text-sm text-app-muted">{oportunidadesFiltradas.length} en el pipeline</span>
                </div>
                <button className="btn-primary" onClick={onNewOportunidad}>
                    <i className="fas fa-plus"></i> Nueva oportunidad
                </button>
            </div>

            <div className="mb-4">
                <select
                    className="form-select w-auto"
                    value={etapaFiltro}
                    onChange={(e) => setEtapaFiltro(e.target.value as EtapaOportunidad | '')}
                >
                    <option value="">Todas las etapas</option>
                    {ETAPAS_OPORTUNIDAD.map((etapa) => (
                        <option key={etapa} value={etapa}>
                            {etapa}
                        </option>
                    ))}
                </select>
            </div>

            {isLoadingOportunidades ? (
                <p>Cargando...</p>
            ) : (
                <div className="table-surface">
                    <table className="app-table">
                        <thead>
                            <tr>
                                <th>Título</th>
                                <th>Cliente</th>
                                <th>Monto</th>
                                <th>Etapa</th>
                                <th>Cierre estimado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {oportunidadesFiltradas.map((oportunidad) => (
                                <tr key={oportunidad.id}>
                                    <td className="font-semibold">{oportunidad.titulo}</td>
                                    <td>{clienteNombre(oportunidad.clienteId)}</td>
                                    <td>{formatCurrency(oportunidad.monto)}</td>
                                    <td>
                                        <span className={ETAPA_BADGE[oportunidad.etapa]}>
                                            {oportunidad.etapa}
                                        </span>
                                    </td>
                                    <td>{formatDate(oportunidad.fechaCierreEstimada)}</td>
                                    <td className="text-right">
                                        <button
                                            className="btn-outline-primary btn-sm mr-2"
                                            onClick={() => onEditOportunidad(oportunidad)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn-outline-danger btn-sm"
                                            onClick={() => startDeletingOportunidad(oportunidad.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {oportunidadesFiltradas.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <i className="fas fa-chart-line"></i>
                                            No hay oportunidades para mostrar.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <OportunidadModal />
        </div>
    );
};
