import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

import { useClientesStore, useOportunidadesStore, useTareasStore, useUiStore } from '../../hooks';
import { TIPOS_TAREA, toDateInputValue } from '../../helpers';
import { TipoTarea } from '../../types';
import { AppModal as Modal } from '../../shared/AppModal';

interface TareaForm {
    titulo: string;
    descripcion: string;
    tipo: TipoTarea;
    fechaVencimiento: string;
    clienteId: string;
    oportunidadId: string;
}

const initialForm: TareaForm = {
    titulo: '',
    descripcion: '',
    tipo: 'OTRO',
    fechaVencimiento: '',
    clienteId: '',
    oportunidadId: '',
};

export const TareaModal = () => {
    const { isTareaModalOpen, closeTareaModal } = useUiStore();
    const { activeTarea, startSavingTarea, clearActiveTarea } = useTareasStore();
    const { clientes } = useClientesStore();
    const { oportunidades } = useOportunidadesStore();

    const [formValues, setFormValues] = useState<TareaForm>(initialForm);

    useEffect(() => {
        if (activeTarea) {
            setFormValues({
                titulo: activeTarea.titulo,
                descripcion: activeTarea.descripcion || '',
                tipo: activeTarea.tipo,
                fechaVencimiento: toDateInputValue(activeTarea.fechaVencimiento),
                clienteId: activeTarea.clienteId ? String(activeTarea.clienteId) : '',
                oportunidadId: activeTarea.oportunidadId ? String(activeTarea.oportunidadId) : '',
            });
        } else {
            setFormValues(initialForm);
        }
    }, [activeTarea, isTareaModalOpen]);

    const onInputChanged = ({ target }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormValues({ ...formValues, [target.name]: target.value });
    };

    const onCloseModal = () => {
        closeTareaModal();
        clearActiveTarea();
    };

    const onSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const ok = await startSavingTarea({
            ...formValues,
            id: activeTarea?.id,
            clienteId: formValues.clienteId ? Number(formValues.clienteId) : undefined,
            oportunidadId: formValues.oportunidadId ? Number(formValues.oportunidadId) : undefined,
        });
        if (ok) onCloseModal();
    };

    return (
        <Modal
            isOpen={isTareaModalOpen}
            onRequestClose={onCloseModal}
            className="app-modal"
            overlayClassName="modal-fondo"
            closeTimeoutMS={200}
        >
            <button type="button" className="modal-close-btn" onClick={onCloseModal} aria-label="Cerrar">
                <i className="fas fa-times"></i>
            </button>
            <h4>{activeTarea?.id ? 'Editar tarea' : 'Nueva tarea'}</h4>
            <hr />
            <form onSubmit={onSubmit}>
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
                        <label className="form-label">Tipo</label>
                        <select className="form-select" name="tipo" value={formValues.tipo} onChange={onInputChanged}>
                            {TIPOS_TAREA.map((tipo) => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="form-label">Vencimiento</label>
                        <input
                            type="datetime-local"
                            className="form-control"
                            name="fechaVencimiento"
                            value={formValues.fechaVencimiento}
                            onChange={onInputChanged}
                            required
                        />
                    </div>
                </div>

                <div className="mb-2">
                    <label className="form-label">Cliente (opcional)</label>
                    <select className="form-select" name="clienteId" value={formValues.clienteId} onChange={onInputChanged}>
                        <option value="">Sin cliente</option>
                        {clientes.map((cliente) => (
                            <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-2">
                    <label className="form-label">Oportunidad (opcional)</label>
                    <select className="form-select" name="oportunidadId" value={formValues.oportunidadId} onChange={onInputChanged}>
                        <option value="">Sin oportunidad</option>
                        {oportunidades.map((oportunidad) => (
                            <option key={oportunidad.id} value={oportunidad.id}>{oportunidad.titulo}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn-primary mt-2 w-full">
                    Guardar
                </button>
            </form>
        </Modal>
    );
};
