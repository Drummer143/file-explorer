import create from 'zustand';

interface HistoryStore {
    history: string[];
    currentPath: string;
    currentPathIndex: number;

    reset: () => void;
    pushRoute: (newPath: string) => void;
    goBack: () => string;
    goForward: () => string;
    deleteLastRoute: () => void
}

const useHistoryStore = create<HistoryStore>((set, get) => ({
    history: [''],
    currentPath: '',
    currentPathIndex: 0,

    pushRoute: newPath =>
        set(state => ({
            history: state.history.slice(0, state.currentPathIndex + 1).concat(newPath),
            currentPath: newPath,
            currentPathIndex: state.currentPathIndex + 1
        })),

    goBack: () => {
        if (get().currentPathIndex - 1 < 0) {
            return;
        }

        set(state => ({
            currentPath: state.history[state.currentPathIndex - 1] || '',
            currentPathIndex: state.currentPathIndex - 1
        }));

        return get().currentPath;
    },

    goForward: () => {
        const { history, currentPathIndex } = get();
        if (currentPathIndex === history.length - 1) {
            return;
        }

        set(state => ({
            currentPathIndex: state.currentPathIndex + 1,
            currentPath: state.history[currentPathIndex + 1]
        }));

        return get().currentPath;
    },

    deleteLastRoute: () => {
        const { history, currentPath, currentPathIndex } = get();

        let h = history.slice(0, -1);
        let cp = h.at(-1);
        let cpi = h.length;

        console.log(history.slice(), h);
        console.log(currentPath, cp);
        console.log(currentPathIndex, cpi);

        set(() => ({
            history: h,
            currentPath: cp,
            currentPathIndex: cpi
        }))
    },
    // set(({ history }) => ({
    //     history: history.slice(0, -1),
    //     currentPath: history.at(-1) || '',
    //     currentPathIndex: history.length - 1
    // })),

    reset: () => set(() => ({ history: [], currentPath: '' }))
}));

export { useHistoryStore };
