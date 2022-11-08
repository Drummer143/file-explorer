// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    getDrives: () => ipcRenderer.send('get-drives'),
    // eslint-disable-next-line @typescript-eslint/ban-types
    onDrivesLoaded: (callback: Function) => ipcRenderer.once('drives-loaded', (event: Electron.IpcRendererEvent, drives: string[]) => callback(event, drives))
})