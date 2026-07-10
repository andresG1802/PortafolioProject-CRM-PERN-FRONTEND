import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useClientesStore, useOportunidadesStore, useUiStore } from '../../hooks';
import { formatCurrency, formatDate, formatDateTime, getInitials } from '../../helpers';
import { Contacto, EtapaOportunidad, Oportunidad } from '../../types';
import { ClienteModal } from '../components/ClienteModal';
import { ContactoModal } from '../components/ContactoModal';
import { OportunidadModal } from '../../oportunidades';

const ETAPA_BADGE: Record<EtapaOportunidad, string> = {
    NUEVO: 'badge-secondary',
    CONTACTADO: 'badge-info',
    PROPUESTA: 'badge-warning',
    NEGOCIACION: 'badge-primary',
    GANADA: 'badge-success',
    PERDIDA: 'badge-danger',
};

export const ClienteDetailPage = () => {
    const { id = '' } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        activeCliente,
        contactos,
        notas,
        startLoadingClienteDetail,
        clearActiveCliente,
        setActiveCliente,
        startDeletingContacto,
        startSavingNota,
        startDeletingNota,
    } = useClientesStore();

    const { oportunidades, startLoadingOportunidades, setActiveOportunidad, clearActiveOportunidad } = useOportunidadesStore();
    const { openClienteModal, openContactoModal, openOportunidadModal } = useUiStore();

    const [editingContacto, setEditingContacto] = useState<Contacto | null>(null);
    const [notaTexto, setNotaTexto] = useState('');

    useEffect(() => {
        startLoadingClienteDetail(id);
        startLoadingOportunidades();

        return () => { clearActiveCliente(); };
    }, [id]);

    const oportunidadesDelCliente = useMemo(
        () => oportunidades.filter((oportunidad) => oportunidad.clienteId === Number(id)),
        [oportunidades, id],
    );

    if (!activeCliente) {
        return <p>Cargando...</p>;
    }

    const onEditCliente = () => {
        setActiveCliente(activeCliente);
        openClienteModal();
    };

    const onNewContacto = () => {
        setEditingContacto(null);
        openContactoModal();
    };

    const onEditContacto = (contacto: Contacto) => {
        setEditingContacto(contacto);
        openContactoModal();
    };

    const onNewOportunidad = () => {
        clearActiveOportunidad();
        openOportunidadModal();
    };

    const onEditOportunidad = (oportunidad: Oportunidad) => {
        setActiveOportunidad(oportunidad);
        openOportunidadModal();
    };

    const onSubmitNota = async (event: FormEvent) => {
        event.preventDefault();
        if (!notaTexto.trim()) return;

        await startSavingNota(notaTexto.trim());
        setNotaTexto('');
    };

    return (
        <div>
            <button className="btn-link mb-2 pl-0" onClick={() => navigate('/clientes')}>
                <i className="fas fa-arrow-left"></i> Volver a clientes
            </button>

            <div className="card-surface mb-6 p-5">
                <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                        <span className="avatar-chip h-[52px] w-[52px] text-[1.1rem]">
                            {getInitials(activeCliente.nombre)}
                        </span>
                        <div>
                            <h3 className="mb-1 text-xl">{activeCliente.nombre}</h3>
                            {activeCliente.empresa && <p className="mb-1 text-app-muted">{activeCliente.empresa}</p>}
                            <p className="mb-1"><i className="fas fa-envelope mr-2"></i>{activeCliente.email || '—'}</p>
                            <p className="mb-1"><i className="fas fa-phone mr-2"></i>{activeCliente.telefono || '—'}</p>
                            <p className="mb-1"><i className="fas fa-map-marker-alt mr-2"></i>{activeCliente.direccion || '—'}</p>
                            <span className={activeCliente.estado === 'ACTIVO' ? 'badge-success' : 'badge-secondary'}>
                                {activeCliente.estado}
                            </span>
                        </div>
                    </div>
                    <button className="btn-outline-primary" onClick={onEditCliente}>
                        <i className="fas fa-edit"></i> Editar
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h5 className="m-0 text-lg">Contactos</h5>
                        <button className="btn-primary btn-sm" onClick={onNewContacto}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                    <ul className="list-group">
                        {contactos.map((contacto) => (
                            <li key={contacto.id} className="list-group-item">
                                <div>
                                    <strong>{contacto.nombre}</strong>
                                    {contacto.cargo && <span className="text-app-muted"> — {contacto.cargo}</span>}
                                    <div className="text-sm text-app-muted">{contacto.email} {contacto.telefono}</div>
                                </div>
                                <div>
                                    <button className="btn-outline-primary btn-sm mr-1" onClick={() => onEditContacto(contacto)}>
                                        <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                        className="btn-outline-danger btn-sm"
                                        onClick={() => startDeletingContacto(contacto.id)}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </button>
                                </div>
                            </li>
                        ))}
                        {contactos.length === 0 && (
                            <li>
                                <div className="empty-state py-2">
                                    <i className="fas fa-address-book"></i>
                                    Sin contactos
                                </div>
                            </li>
                        )}
                    </ul>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between">
                        <h5 className="m-0 text-lg">Oportunidades</h5>
                        <button className="btn-primary btn-sm" onClick={onNewOportunidad}>
                            <i className="fas fa-plus"></i>
                        </button>
                    </div>
                    <ul className="list-group">
                        {oportunidadesDelCliente.map((oportunidad) => (
                            <li key={oportunidad.id} className="list-group-item">
                                <div>
                                    <strong>{oportunidad.titulo}</strong>{' '}
                                    <span className={ETAPA_BADGE[oportunidad.etapa]}>{oportunidad.etapa}</span>
                                    <div className="text-sm text-app-muted">
                                        {formatCurrency(oportunidad.monto)} · cierre {formatDate(oportunidad.fechaCierreEstimada)}
                                    </div>
                                </div>
                                <button className="btn-outline-primary btn-sm" onClick={() => onEditOportunidad(oportunidad)}>
                                    <i className="fas fa-edit"></i>
                                </button>
                            </li>
                        ))}
                        {oportunidadesDelCliente.length === 0 && (
                            <li>
                                <div className="empty-state py-2">
                                    <i className="fas fa-chart-line"></i>
                                    Sin oportunidades
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
            </div>

            <div className="mt-6">
                <h5 className="mb-2 text-lg">Notas</h5>
                <form onSubmit={onSubmitNota} className="mb-2 flex gap-2">
                    <input
                        className="form-control"
                        placeholder="Escribe una nota..."
                        value={notaTexto}
                        onChange={(e) => setNotaTexto(e.target.value)}
                    />
                    <button className="btn-primary" type="submit">Agregar</button>
                </form>
                <ul className="list-group">
                    {notas.map((nota) => (
                        <li key={nota.id} className="list-group-item items-start">
                            <div>
                                <div>{nota.contenido}</div>
                                <div className="text-sm text-app-muted">{formatDateTime(nota.createdAt)}</div>
                            </div>
                            <button className="btn-outline-danger btn-sm" onClick={() => startDeletingNota(nota.id)}>
                                <i className="fas fa-trash-alt"></i>
                            </button>
                        </li>
                    ))}
                    {notas.length === 0 && (
                        <li>
                            <div className="empty-state py-2">
                                <i className="fas fa-sticky-note"></i>
                                Sin notas
                            </div>
                        </li>
                    )}
                </ul>
            </div>

            <ClienteModal />
            <ContactoModal activeContacto={editingContacto} onAfterClose={() => setEditingContacto(null)} />
            <OportunidadModal lockedClienteId={Number(id)} />
        </div>
    );
};
