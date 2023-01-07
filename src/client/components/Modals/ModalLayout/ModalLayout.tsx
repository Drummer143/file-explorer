import { createPortal } from "react-dom";
import { useState, useEffect, ReactNode, useRef } from 'react';

import { useCMCStore } from "../../../stores/CMCStore";
import FileCreatingModal from '../FileCreatingModal/FileCreatingModal';

const modalRoot = document.getElementById('modal-root');

function ModalLayout() {
    const { modalInfo, setModal } = useCMCStore();
    const layoutRef = useRef<HTMLDivElement>();

    const [currentModal, setCurrentModal] = useState<ReactNode>();

    const selectModal = () => {
        let currentModal;

        if (!modalInfo) { return }

        switch (modalInfo.name) {
            case 'fileCreating':
                setCurrentModal(<FileCreatingModal {...modalInfo.data} />);
        }

        return currentModal;
    }

    const hideModal = (e: MouseEvent) => {
        if (e.target === layoutRef.current) {
            console.log('hiding');
            setModal();
            document.removeEventListener('click', hideModal);
        }
    }

    useEffect(() => {
        if (modalInfo?.name) {
            selectModal()

            document.addEventListener('click', hideModal);
        } else {
            setCurrentModal(null);
        }

        return () => {
            document.removeEventListener('click', hideModal);
        }
    }, [modalInfo?.name])

    return createPortal(
        (
            <div
                ref={layoutRef}
                className={"absolute top-0 left-0 w-screen h-screen bg-transparent z-50"
                    .concat(modalInfo ? '' : ' hidden')}
            >
                {currentModal}
            </div>
        ),
        modalRoot
    )
}

export default ModalLayout;