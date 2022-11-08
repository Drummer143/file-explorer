export interface IElectronAPI {
    getDrives: () => void,
    // eslint-disable-next-line @typescript-eslint/ban-types
    onDrivesLoaded: (callback: (event: Electron.IpcRendererEvent, drives: string[]) => void) => void
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}