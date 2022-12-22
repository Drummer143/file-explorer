import create from 'zustand';

interface HistoryStore {
    history: string[];
    pushRoute: (newPath: string) => void;
    popRoute: () => string;
    reset: () => void;
}

const useHistoryStore = create<HistoryStore>(
    set => ({
        history: [],
        pushRoute: newPath => set(state => ({ history: state.history.concat(newPath) })),
        popRoute    : () => {
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
