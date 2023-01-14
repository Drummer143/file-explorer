import create from 'zustand';

interface PopupStore {
    maxPopups: number
    popups: (PopupInfo & { id: string })[]
    lifetime: number

    setMaxPopups: (count: number) => void
    addPopups: (newPopups: PopupInfo | PopupInfo[]) => void
    deletePopup: (id: string) => void
    setLifetime: (seconds: number) => void
}

const usePopupStore = create<PopupStore>((set, get) => ({
    maxPopups: 3,
    popups: [],
    lifetime: 10,

    setMaxPopups: (count) => set(() => ({
        maxPopups: count
    })),

    addPopups: (newPopups) => {
        let popups = Array.isArray(newPopups) ? newPopups : [newPopups]

        set(state => ({
            popups: [...state.popups, ...popups].slice(-1 * state.maxPopups)
        }))
    },

    deletePopup: (id) => set(({ popups }) => ({
        popups: popups.filter(p => p.id !== id)
    })),

    setLifetime: (seconds) => set(() => ({ lifetime: seconds }))
}))

export default usePopupStore;