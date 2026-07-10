import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useClientesStore, useUiStore } from '../../hooks';
import { Contacto } from '../../types';
import { AppModal as Modal } from '../../shared/AppModal';

interface ContactoForm {
    nombre: string;
    cargo: string;
    email: string;
    telefono: string;
}

const initialForm: ContactoForm = { nombre: '', cargo: '', email: '', telefono: '' };

interface Props {
    activeContacto: Contacto | null;
    onAfterClose?: () => void;
}

export const ContactoModal = ({ activeContacto, onAfterClose }: Props) => {
    const { isContactoModalOpen, closeContactoModal } = useUiStore();
    const { startSavingContacto } = useClientesStore();

    const [formValues, setFormValues] = useState<ContactoForm>(initialForm);

    useEffect(() => {
        setFormValues(
            activeContacto
                ? {
                      nombre: activeContacto.nombre,
                      cargo: activeContacto.cargo || '',
                      email: activeContacto.email || '',
                      telefono: activeContacto.telefono || '',
                  }
                : initialForm,
        );
    }, [activeContacto, isContactoModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeContactoModal();
        onAfterClose?.();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingContacto({ ...formValues, id: activeContacto?.id });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isContactoModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeContacto?.id ? 'Editar contacto' : 'Nuevo contacto'}</h4>
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
                    <label className="form-label">Cargo</label>
                    <input className="form-control" name="cargo" value={formValues.cargo || ''} onChange={onInputChanged} />
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

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
