export interface IElectronAPI {
    getDrives: () => void,
    onDrivesLoaded: (callback: (event: Electron.IpcRendererEvent, drives: string[]) => void) => void,

    readDirectory: (path: string) => void,
    onReadDirectory: (callback: (event: Electron.IpcRendererEvent, files: any) => void) => void,

    openFile: (path: string) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}