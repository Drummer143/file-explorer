import create from 'zustand';

interface HistoryStore {
    history: string[];
    pushPath: (newPath: string) => void;
    popPath: () => string;
    reset: () => void;
}

const useHistoryStore = create<HistoryStore>(
    set => ({
        history: [],
        pushPath: newPath => set(state => ({ history: state.history.concat(newPath) })),
        popPath: () => {
            let lastPath = '';
            set(state => {
                const hist = state.history.concat();
                lastPath = hist.pop();
                return { history: hist };
            });
            return lastPath;
        },
        reset: () => set(() => ({ history: [] }))
    })
);

interface PathStore {
    path: string;
    updatePath: (newPath: string) => void;
    reset: () => void;
}

//@ts-ignore
const usePathStore = create<PathStore>(
    set => ({
        path: '',
        updatePath: newPath => set(() => ({ path: newPath })),
        reset: () => set({ path: '' })
    })
);

export { useHistoryStore, usePathStore };
