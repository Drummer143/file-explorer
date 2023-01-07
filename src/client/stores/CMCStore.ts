// CMC - context menu communication

import create from "zustand";

type ModalInfo = {
    name: 'fileCreating'
    data: FileCreatingModalParams
}

interface CMCStore {
    currentEditingFile?: string
    modalInfo?: ModalInfo

    setCurrentEditingFile: (filename: string) => void
    setModal: (options?: ModalInfo) => void
}

const useCMCStore = create<CMCStore>((set, get) => ({
    setCurrentEditingFile: filename => set({ currentEditingFile: filename }),

    setModal: (options?: ModalInfo) => set({
        modalInfo: options
    })
}))

export { useCMCStore };