import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useClientesStore, useOportunidadesStore, useUiStore } from '../../hooks';
import { ETAPAS_OPORTUNIDAD, toDateInputValue } from '../../helpers';
import { EtapaOportunidad } from '../../types';
import { AppModal as Modal } from '../../shared/AppModal';

interface OportunidadForm {
    titulo: string;
    descripcion: string;
    monto: string;
    etapa: EtapaOportunidad;
    clienteId: string;
    fechaCierreEstimada: string;
}

const initialForm: OportunidadForm = {
    titulo: '',
    descripcion: '',
    monto: '',
    etapa: 'NUEVO',
    clienteId: '',
    fechaCierreEstimada: '',
};

interface Props {
    lockedClienteId?: number;
}

export const OportunidadModal = ({ lockedClienteId }: Props) => {
    const { isOportunidadModalOpen, closeOportunidadModal } = useUiStore();
    const { activeOportunidad, startSavingOportunidad, clearActiveOportunidad } = useOportunidadesStore();
    const { clientes } = useClientesStore();

    const [formValues, setFormValues] = useState<OportunidadForm>(initialForm);

    useEffect(() => {
        if (activeOportunidad) {
            setFormValues({
                titulo: activeOportunidad.titulo,
                descripcion: activeOportunidad.descripcion || '',
                monto: String(activeOportunidad.monto),
                etapa: activeOportunidad.etapa,
                clienteId: String(activeOportunidad.clienteId),
                fechaCierreEstimada: toDateInputValue(activeOportunidad.fechaCierreEstimada),
            });
        } else {
            setFormValues({ ...initialForm, clienteId: lockedClienteId ? String(lockedClienteId) : '' });
        }
    }, [activeOportunidad, isOportunidadModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeOportunidadModal();
        clearActiveOportunidad();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingOportunidad({
            ...formValues,
            id: activeOportunidad?.id,
            clienteId: Number(formValues.clienteId),
            monto: Number(formValues.monto),
            fechaCierreEstimada: formValues.fechaCierreEstimada || undefined,
        });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isOportunidadModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeOportunidad?.id ? 'Editar oportunidad' : 'Nueva oportunidad'}</h4>
            <hr />
            <form onSubmit={onSubmit}>
                <div className="mb-2">
                    <label className="form-label">Cliente</label>
                    <select
                        className="form-select"
                        name="clienteId"
                        value={formValues.clienteId}
                        onChange={onInputChanged}
                        disabled={!!activeOportunidad?.id}
                        required
                    >
                        <option value="" disabled>Selecciona un cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>
                                {cliente.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="form-label">Título</label>
                    <input className="form-control" name="titulo" value={formValues.titulo} onChange={onInputChanged} required />
                </div>

                <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <textarea
                        className="form-control"
                        name="descripcion"
                        rows={2}
                        value={formValues.descripcion || ''}
                        onChange={onInputChanged}
                    ></textarea>
                </div>

                <div className="mb-2 grid grid-cols-2 gap-3">
                    <div>
                        <label className="form-label">Monto</label>
                        <input
                            type="number"
                            step="0.01"
                            className="form-control"
                            name="monto"
                            value={formValues.monto}
                            onChange={onInputChanged}
                            required
                        />
                    </div>
                    <div>
                        <label className="form-label">Etapa</label>
                        <select className="form-select" name="etapa" value={formValues.etapa} onChange={onInputChanged}>
                            {ETAPAS_OPORTUNIDAD.map((etapa) => (
                                <option key={etapa} value={etapa}>
                                    {etapa}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label">Fecha de cierre estimada</label>
                    <input
                        type="date"
                        className="form-control"
                        name="fechaCierreEstimada"
                        value={formValues.fechaCierreEstimada?.slice(0, 10) || ''}
                        onChange={onInputChanged}
                    />
                </div>

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
