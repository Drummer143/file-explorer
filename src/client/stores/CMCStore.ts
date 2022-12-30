// CMC - context menu communication

import create from "zustand";

interface CMCStore {
    currentEditingFile: string | undefined

    setCurrentEditingFile: (filename: string) => void
}

const useCMCStore = create<CMCStore>((set, get) => ({
    currentEditingFile: undefined,

    setCurrentEditingFile: filename => set({ currentEditingFile: filename })
}))

export { useCMCStore };