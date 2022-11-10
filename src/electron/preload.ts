/* eslint-disable @typescript-eslint/ban-types */
// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronAPI', {
    getDrives: () => ipcRenderer.send('get-drives'),
    onDrivesLoaded: (callback: Function) => ipcRenderer.on('drives-loaded', (event: Electron.IpcRendererEvent, drives: string[]) => callback(event, drives)),

    readDirectory: (path: string) => ipcRenderer.send('read-directory', path),
    onReadDirectory: (callback: Function) => ipcRenderer.on('directory', (event: Electron.IpcRendererEvent, files: any) => callback(event, files)),

    openFile: (path: string) => ipcRenderer.send('open-file', path)
})