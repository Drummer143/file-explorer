// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
    getDrives: () => ipcRenderer.send('get-drives'),
    onDrivesLoaded: (callback: Function) => {
        ipcRenderer.on('drives-loaded', (event: Electron.IpcRendererEvent, drives: string[]) =>
            callback(event, drives)
        );
    },

    readDirectory: (path: string) => ipcRenderer.send('read-directory', path),
    onReadDirectory: (callback: Function) => {
        ipcRenderer.on('directory', (event: Electron.IpcRendererEvent, files: any) =>
            callback(event, files)
        );
    },

    openFile: (path: string) => ipcRenderer.send('open-file', path),
    deleteFile: (path: string) => ipcRenderer.send('delete-file', path),

    minimize: () => ipcRenderer.send('minimize'),
    restoreToWindow: () => ipcRenderer.send('restore-to-window'),
    maximize: () => ipcRenderer.send('maximize'),
    close: () => ipcRenderer.send('close'),

    getIsFullscreen: () => ipcRenderer.send('get-is-fullscreen'),
    isFullscreen: (callback: Function) => {
        ipcRenderer.once(
            'is-fullscreen',
            (event: Electron.IpcRendererEvent, isFullscreen: Boolean) =>
                callback(event, isFullscreen)
        );
    },

    onInDirChange: (callback: Function) => {
        ipcRenderer.on('in-dir-change', (event: Electron.IpcRendererEvent, changes: UpdatedFiles) => callback(event, changes))
    },

    unsubscribe: (event: 'drives-loaded' | 'directory' | 'in-dir-change') => ipcRenderer.removeAllListeners(event),
});
