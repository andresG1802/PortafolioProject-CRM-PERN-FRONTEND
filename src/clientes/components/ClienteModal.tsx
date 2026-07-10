import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useClientesStore, useUiStore } from '../../hooks';
import { EstadoCliente } from '../../types';
import { AppModal as Modal } from '../../shared/AppModal';

interface ClienteForm {
    nombre: string;
    empresa: string;
    email: string;
    telefono: string;
    direccion: string;
    estado: EstadoCliente;
}

const initialForm: ClienteForm = {
    nombre: '',
    empresa: '',
    email: '',
    telefono: '',
    direccion: '',
    estado: 'ACTIVO',
};

export const ClienteModal = () => {
    const { isClienteModalOpen, closeClienteModal } = useUiStore();
    const { activeCliente, startSavingCliente, clearActiveCliente } = useClientesStore();

    const [formValues, setFormValues] = useState<ClienteForm>(initialForm);

    useEffect(() => {
        setFormValues(
            activeCliente
                ? {
                      nombre: activeCliente.nombre,
                      empresa: activeCliente.empresa || '',
                      email: activeCliente.email || '',
                      telefono: activeCliente.telefono || '',
                      direccion: activeCliente.direccion || '',
                      estado: activeCliente.estado,
                  }
                : initialForm,
        );
    }, [activeCliente, isClienteModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeClienteModal();
        clearActiveCliente();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingCliente({ ...formValues, id: activeCliente?.id });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isClienteModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeCliente?.id ? 'Editar cliente' : 'Nuevo cliente'}</h4>
            <hr />
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input
                        className="form-control"
                        name="nombre"
                        value={formValues.nombre}
                        onChange={onInputChanged}
                        required
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Empresa</label>
                    <input className="form-control" name="empresa" value={formValues.empresa || ''} onChange={onInputChanged} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formValues.email || ''}
                        onChange={onInputChanged}
                    />
                </div>
                <div className="mb-2">
                    <label className="form-label">Teléfono</label>
                    <input className="form-control" name="telefono" value={formValues.telefono || ''} onChange={onInputChanged} />
                </div>
                <div className="mb-2">
                    <label className="form-label">Dirección</label>
                    <input className="form-control" name="direccion" value={formValues.direccion || ''} onChange={onInputChanged} />
                </div>

                {activeCliente?.id && (
                    <div className="mb-2">
                        <label className="form-label">Estado</label>
                        <select className="form-select" name="estado" value={formValues.estado} onChange={onInputChanged}>
                            <option value="ACTIVO">Activo</option>
                            <option value="INACTIVO">Inactivo</option>
                        </select>
                    </div>
                )}

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
