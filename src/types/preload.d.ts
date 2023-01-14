import { Event as WatcherEventType } from '@parcel/watcher';

interface IElectronAPI {
    getDrives: () => void;
    onDrivesLoaded: (
        callback: (event: Electron.IpcRendererEvent, drives: string[]) => void
    ) => void;

    readDirectory: (path: string) => void;
    onReadDirectory: (
        callback: (event: Electron.IpcRendererEvent, files: CustomFile[], pathToParentDir: string) => void
    ) => void;

    // onNewFile: (callback: (event: Electron.IpcRendererEvent, file: CustomFile) => void) => void;
    // onDeleteFile: (callback: (event: Electron.IpcRendererEvent, file: string) => void) => void;

    openFile: (path: string) => void;
    deleteFile: (path: string) => void;
    renameFile: (oldPath: string, newPath: string) => void

    createFolder: (path: string) => void
    createFile: (path: string) => void

    minimize: () => void;
    restoreToWindow: () => void;
    maximize: () => void;
    close: () => void;

    getIsFullscreen: () => void;
    isFullscreen: (
        callback: (event: Electron.IpcRendererEvent, isFullscreen: boolean) => void
    ) => void;

    onInDirChange: (
        callback: (event: Electron.IpcRendererEvent, changes: UpdatedFiles) => void
    ) => void;

    unsubscribe: (event: 'drives-loaded' | 'directory' | 'in-dir-change') => void;

    onError: (
        callback: (event: Electron.IpcRendererEvent, error: ElectronErrorKind, type: ErrorType, ...rest: any[]) => void
    ) => void;

    openInExplorer: (path: string) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI;
    }
}
