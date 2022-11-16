import create from 'zustand';

interface HistoryState {
    history: string[],
    pushPath: (newPath: string) => void
    popPath: () => string
    reset: () => void
}

const useHistoryStore = create<HistoryState>(set => ({
    history: [],
    pushPath: (newPath) => set(state => ({ history: state.history.concat(newPath) })),
    popPath: () => {
        let lastPath = '';
        set(state => {
            const hist = state.history.concat();
            lastPath = hist.pop();
            return { history: hist };
        })
        return lastPath
    },
    reset: () => set(() => ({ history: [] }))
}))

interface PathState {
    path: string,
    updatePath: (newPath: string) => void
    reset: () => void
}

const usePathStore = create<PathState>(set => ({
    path: '',
    updatePath: (newPath) => set(() => ({ path: newPath })),
    reset: () => set({ path: '' })
}))

export { usePathStore, useHistoryStore };