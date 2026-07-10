import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
    onOpenClienteModal,
    onCloseClienteModal,
    onOpenContactoModal,
    onCloseContactoModal,
    onOpenOportunidadModal,
    onCloseOportunidadModal,
    onOpenTareaModal,
    onCloseTareaModal,
} from '../store';

export const useUiStore = () => {
    const dispatch = useAppDispatch();
    const {
        isClienteModalOpen,
        isContactoModalOpen,
        isOportunidadModalOpen,
        isTareaModalOpen,
    } = useAppSelector((state) => state.ui);

    return {
        isClienteModalOpen,
        isContactoModalOpen,
        isOportunidadModalOpen,
        isTareaModalOpen,

        openClienteModal: () => dispatch(onOpenClienteModal()),
        closeClienteModal: () => dispatch(onCloseClienteModal()),
        openContactoModal: () => dispatch(onOpenContactoModal()),
        closeContactoModal: () => dispatch(onCloseContactoModal()),
        openOportunidadModal: () => dispatch(onOpenOportunidadModal()),
        closeOportunidadModal: () => dispatch(onCloseOportunidadModal()),
        openTareaModal: () => dispatch(onOpenTareaModal()),
        closeTareaModal: () => dispatch(onCloseTareaModal()),
    };
};
