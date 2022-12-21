import { Event as WatcherEventType } from '@parcel/watcher'

interface IElectronAPI {
    getDrives: () => void;
    onDrivesLoaded: (
        callback: (event: Electron.IpcRendererEvent, drives: string[]) => void
    ) => void;

    readDirectory: (path: string) => void;
    onReadDirectory: (
        callback: (event: Electron.IpcRendererEvent, files: CustomFile[]) => void
    ) => void;

    // onNewFile: (callback: (event: Electron.IpcRendererEvent, file: CustomFile) => void) => void;
    // onDeleteFile: (callback: (event: Electron.IpcRendererEvent, file: string) => void) => void;

    openFile: (path: string) => void;

    minimize: () => void;
    restoreToWindow: () => void;
    maximize: () => void;
    close: () => void;

    getIsFullscreen: () => void;
    isFullscreen: (
        callback: (event: Electron.IpcRendererEvent, isFullscreen: boolean) => void
    ) => void;

    onInDirChange: (callback: (event: Electron.IpcRendererEvent, changes: OnInDirChangeProps) => void) => void
}

declare global {
    type OnInDirChangeProps = {
        delete: string[]
        update: CustomFile[]
        create: CustomFile[]
    }

    interface Window {
        electronAPI: IElectronAPI;
    }
}
