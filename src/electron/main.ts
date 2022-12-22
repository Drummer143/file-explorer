import * as fs from 'fs';
import * as path from 'path';
import isDev from 'electron-is-dev';
import { exec } from 'child_process';
import { enable, initialize } from '@electron/remote/main';
import { app, BrowserWindow, ipcMain, IpcMainEvent, ipcRenderer } from 'electron';
import watcher from '@parcel/watcher';
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

initialize();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
    app.quit();
}

// const PATH_TO_WINDOW_LOGS = isDev
//     ? 'C:\\Users\\berge\\source\\repos\\file-explorer\\logs\\windowConfig.json'
//     : __dirname + 'windowConfig.json'; 

const createWindow = (): void => {
    // let windowConfig: Electron.BrowserWindowConstructorOptions;

    // try {
    //     windowConfig = JSON.parse(fs.readFileSync(PATH_TO_WINDOW_LOGS, { encoding: 'utf-8' }))
    // } catch (err) {
    //     console.error(err);
    // }

    // Create the browser window.
    const mainWindow = new BrowserWindow({
        height: 600,
        width: 800,
        frame: false,
        fullscreen: true,
        title: 'File Explorer',
        webPreferences: {
            devTools: isDev,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            // nodeIntegration: true,
            contextIsolation: true
        }
        // ...windowConfig
    });

    // and load the index.html of the app.
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.webContents.send;

    // Open the DevTools.
    if (isDev /*  && windowConfig.webPreferences.devTools */) {
        mainWindow.webContents.openDevTools();
    }

    // mainWindow.on('close', () => {
    //     const windowConfig: Electron.BrowserWindowConstructorOptions = {
    //         width: mainWindow.getBounds().width,
    //         height: mainWindow.getBounds().height,
    //         x: mainWindow.getBounds().x,
    //         y: mainWindow.getBounds().y,
    //         fullscreen: mainWindow.isFullScreen()
    //         // webPreferences: {
    //         //     devTools: mainWindow.webContents.isDevToolsOpened()
    //         // }
    //     };

    //     fs.writeFileSync(PATH_TO_WINDOW_LOGS, JSON.stringify(windowConfig, null, '\t'));
    // });

    ipcMain.on('get-is-fullscreen', event =>
        event.sender.send('is-fullscreen', mainWindow.isFullScreen())
    );

    ipcMain.on('minimize', () => mainWindow.minimize());
    ipcMain.on('restore-to-window', () => mainWindow.setFullScreen(false));
    ipcMain.on('maximize', () => mainWindow.setFullScreen(true));
    ipcMain.on('close', () => mainWindow.close());
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// let watcher: fs.FSWatcher;
let unsubscribe: () => void;

const getFileInfo = (path: string, name: string) => {
    try {
        const stats = fs.statSync(path);
        return {
            fileName: name,
            isFile: stats.isFile(),
            isDirectory: stats.isDirectory(),
            size: stats.size
        } as CustomFile;
    } catch (error) {
        console.error(error);
    }
}

const watchForDirectory = (event: IpcMainEvent, pathToDir: string, error: Error, events: watcher.Event[]) => {
    if (error) { console.error(error) }
    if (!events || events.length === 0) { return }

    const updatedFiles: UpdatedFiles = { create: [], delete: [], update: [] };

    events
        .filter(event => {
            const parentDir = path.basename(path.join(event.path, '..'))

            return parentDir === path.basename(pathToDir);
        })
        .forEach(event => {
            switch (event.type) {
                case 'delete':
                    updatedFiles.delete.push(path.basename(event.path));
                    break;
                case 'create':
                    updatedFiles.create.push(getFileInfo(event.path, path.basename(event.path)));
                // TODO: CASE FOR UPDATE EVENT
            }
        });

    updatedFiles.create = updatedFiles.create.filter(file => file);

    if (updatedFiles.create.length > 0 || updatedFiles.delete.length > 0) {
        event.sender.send('in-dir-change', updatedFiles);
    }
}

// handlers

const readDrives = (event: IpcMainEvent) => {
    if (unsubscribe) { unsubscribe() }

    exec('wmic logicaldisk get name', (error, stdout) => {
        if (error) {
            console.error(error);
        } else {
            const info = stdout
                .split('\r\r\n')
                .filter((value: string) => /[A-Za-z]:/.test(value))
                .map((value: string) => value.trim());

            event.sender.send('drives-loaded', info);
        }
    });
}

const readDirectory = (event: IpcMainEvent, pathToDir: string) => {
    if (unsubscribe) { unsubscribe() }

    if (pathToDir) {
        const files: CustomFile[] = fs.readdirSync(`${pathToDir}\\`, { encoding: 'utf-8' })
            .map(file => getFileInfo(`${pathToDir}\\${file}`, file))
            .filter(file => file);

        event.sender.send('directory', files);
    }

    const watch = (error: Error, events: watcher.Event[]) => watchForDirectory(event, pathToDir, error, events);

    watcher.subscribe(`${pathToDir}\\`, watch);

    unsubscribe = () => {
        watcher.unsubscribe(`${pathToDir}\\`, watch)
        unsubscribe = null;
    };
}

const openFile = (event: IpcMainEvent, pathToFile: string) => {
    exec(pathToFile, (error, stdout) => {
        if (error) {
            console.error(error);
        } else {
            console.info(stdout);
        }
    });
}

const deleteFile = (event: IpcMainEvent, pathToFile: string) => fs.rmSync(pathToFile, { recursive: true })

ipcMain.on('get-drives', readDrives);
ipcMain.on('read-directory', readDirectory);
ipcMain.on('open-file', openFile);
ipcMain.on('delete-file', deleteFile);