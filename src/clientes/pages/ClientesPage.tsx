import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useClientesStore, useUiStore } from '../../hooks';
import { getInitials } from '../../helpers';
import { Cliente } from '../../types';
import { ClienteModal } from '../components/ClienteModal';

export const ClientesPage = () => {
    const navigate = useNavigate();
    const { openClienteModal } = useUiStore();
    const {
        clientes,
        isLoadingClientes,
        startLoadingClientes,
        setActiveCliente,
        clearActiveCliente,
        startDeletingCliente,
    } = useClientesStore();

    useEffect(() => {
        startLoadingClientes();
    }, []);

    const onNewCliente = () => {
        clearActiveCliente();
        openClienteModal();
    };

    const onEditCliente = (cliente: Cliente) => {
        setActiveCliente(cliente);
        openClienteModal();
    };

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h3 className="m-0 text-2xl">Clientes</h3>
                    <span className="text-sm text-app-muted">{clientes.length} cliente{clientes.length === 1 ? '' : 's'} registrados</span>
                </div>
                <button className="btn-primary" onClick={onNewCliente}>
                    <i className="fas fa-plus"></i> Nuevo cliente
                </button>
            </div>

            {isLoadingClientes ? (
                <p>Cargando...</p>
            ) : (
                <div className="table-surface">
                    <table className="app-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Empresa</th>
                                <th>Email</th>
                                <th>Teléfono</th>
                                <th>Estado</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente) => (
                                <tr key={cliente.id} className="cursor-pointer">
                                    <td onClick={() => navigate(`/clientes/${cliente.id}`)}>
                                        <div className="flex items-center gap-2.5">
                                            <span className="avatar-chip">{getInitials(cliente.nombre)}</span>
                                            <span className="font-semibold">{cliente.nombre}</span>
                                        </div>
                                    </td>
                                    <td onClick={() => navigate(`/clientes/${cliente.id}`)}>{cliente.empresa}</td>
                                    <td onClick={() => navigate(`/clientes/${cliente.id}`)}>{cliente.email}</td>
                                    <td onClick={() => navigate(`/clientes/${cliente.id}`)}>{cliente.telefono}</td>
                                    <td onClick={() => navigate(`/clientes/${cliente.id}`)}>
                                        <span className={cliente.estado === 'ACTIVO' ? 'badge-success' : 'badge-secondary'}>
                                            {cliente.estado}
                                        </span>
                                    </td>
                                    <td className="text-right">
                                        <button className="btn-outline-primary btn-sm mr-2" onClick={() => onEditCliente(cliente)}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn-outline-danger btn-sm"
                                            onClick={() => startDeletingCliente(cliente.id)}
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}

                            {clientes.length === 0 && (
                                <tr>
                                    <td colSpan={6}>
                                        <div className="empty-state">
                                            <i className="fas fa-users"></i>
                                            No hay clientes registrados todavía.
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <ClienteModal />
        </div>
    );
};
