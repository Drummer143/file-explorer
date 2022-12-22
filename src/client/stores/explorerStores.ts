import create from 'zustand';

interface HistoryStore {
    history: string[];
    pushRoute: (newPath: string) => void;
    popRoute: () => string;
    reset: () => void;
    currentPath: string;
}

const useHistoryStore = create<HistoryStore>(
    (set, get) => ({
        history: [],
        currentPath: '',
        pushRoute: newPath => set(state => ({
            history: state.history.concat(newPath),
            currentPath: newPath
        })),
        popRoute: () => {
            set(state => ({
                history: state.history.slice(0, -1),
                currentPath: state.history.at(-2) || ''
            }));

            return get().currentPath;
        },
        reset: () => set(() => ({ history: [] })),
    })
);

export { useHistoryStore };
