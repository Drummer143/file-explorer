import * as fs from 'fs';
import * as path from 'path';
import isDev from 'electron-is-dev';
import watcher from '@parcel/watcher';
import { exec } from 'child_process';
import { initialize } from '@electron/remote/main';
import { FileTypeResult } from 'file-type/core';
import { fileTypeFromFile } from 'file-type';
import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';

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

let mainWindow: BrowserWindow;

const createWindow = (): void => {
    // let windowConfig: Electron.BrowserWindowConstructorOptions;

    // try {
    //     windowConfig = JSON.parse(fs.readFileSync(PATH_TO_WINDOW_LOGS, { encoding: 'utf-8' }))
    // } catch (err) {
    //     console.error(err);
    // }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        frame: false,
        fullscreen: true,
        height: 600,
        title: 'File Explorer',
        width: 800,
        webPreferences: {
            devTools: isDev,
            contextIsolation: true,
            // nodeIntegration: true,
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
            webSecurity: false,
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

const getFileType = async (event: IpcMainEvent, pathToFile: string): Promise<FileTypeResult | undefined> => {
    try {
        return await fileTypeFromFile(pathToFile);
    } catch (error) {
        sendError(event.sender, 'onGetInfo', 'warning', { path: pathToFile });
        // console.error(error);

        return;
    }
}

const getFileInfo = async (event: IpcMainEvent, pathToFile: string, name: string): Promise<CustomFile> => {
    try {
        const stats = fs.statSync(pathToFile);

        if (stats.isFile()) {
            let fileType = await getFileType(event, pathToFile);

            return {
                isFile: true,
                fileName: name,
                size: stats.size,
                type: fileType?.mime.split('/')[0] || ''
            };
        }

        return {
            fileName: name,
            isDirectory: stats.isDirectory(),
            size: stats.size
        };
    } catch (error) {
        sendError(event.sender, 'onGetInfo', 'warning', { path: pathToFile });
        // console.error(error);
    }
};

const watchForDirectory = async (
    event: IpcMainEvent,
    pathToDir: string,
    error: Error,
    events: watcher.Event[]
) => {
    if (error) {
        sendError(event.sender, 'onGetInfo', 'warning', { path: pathToDir });
        // console.error(error);
    }

    const nonRecursiveEvents = events
        .filter(event => {
            const parentDir = path.basename(path.join(event.path, '..'));

            return parentDir === path.basename(pathToDir);
        })

    if (nonRecursiveEvents.length === 0) {
        return;
    }

    const updatedFiles: UpdatedFiles = { create: [], delete: [], update: [] };

    for await (const e of nonRecursiveEvents) {
        switch (e.type) {
            case 'delete':
                updatedFiles.delete.push(path.basename(e.path));
                break;
            case 'create':
                const f = await getFileInfo(event, e.path, path.basename(e.path));
                updatedFiles.create.push(f);
            // TODO: CASE FOR UPDATE EVENT
        }
    }

    updatedFiles.create = updatedFiles.create.filter(file => file);

    if (updatedFiles.create.length > 0 || updatedFiles.delete.length > 0) {
        event.sender.send('in-dir-change', updatedFiles);
    }
};

// handlers

const readDrives = (event: IpcMainEvent) => {
    if (unsubscribe) {
        unsubscribe();
    }

    exec('wmic logicaldisk get name', (error, stdout) => {
        if (error) {
            console.error(error); // TODO: ADD ERROR SENDER
        } else {
            const info = stdout
                .split('\r\r\n')
                .filter((value: string) => /[A-Za-z]:/.test(value))
                .map((value: string) => value.trim());

            event.sender.send('drives-loaded', info);
        }
    });
};

const readDirectory = async (event: IpcMainEvent, pathToDir: string) => {
    if (!fs.existsSync(pathToDir)) {
        sendError(event.sender, 'invalidPath', 'error', { path: pathToDir });
        return;
    }

    if (unsubscribe) {
        unsubscribe();
    }

    const files = fs.readdirSync(`${pathToDir}\\`, { encoding: 'utf-8' });

    const filesWithInfo = await Promise.all(
        files.map(async (file) =>
            await getFileInfo(event, `${pathToDir}\\${file}`, file)
        )
    )
        .then(res => {
            return res.filter(file => file)
        })

    event.sender.send('directory', filesWithInfo, pathToDir);

    const watch = (error: Error, events: watcher.Event[]) =>
        watchForDirectory(event, pathToDir, error, events);

    watcher.subscribe(`${pathToDir}\\`, watch);

    unsubscribe = () => {
        watcher.unsubscribe(`${pathToDir}\\`, watch);
        unsubscribe = null;
    };
};

const openFile = (event: IpcMainEvent, pathToFile: string) => {
    pathToFile = pathToFile.replace('\\', '/').split('/').map(part => part.includes(' ') ? `"${part}"` : part).join('/');

    exec(`${pathToFile}`, (error, stdout) => {
        if (error) {
            sendError(event.sender, 'onOpenFile', 'error', { path: pathToFile });
            // console.error(error);
        } else {
            console.info(stdout);
        }
    });
};

const deleteFile = (event: IpcMainEvent, pathToFile: string) => {
    fs.rmSync(pathToFile, { recursive: true });
}

const renameFile = (event: IpcMainEvent, oldPath: string, newPath: string) => {
    fs.renameSync(oldPath, newPath);
}

const createFolder = (event: IpcMainEvent, pathToFolder: string) => {
    fs.mkdirSync(pathToFolder);
}

const createFile = (event: IpcMainEvent, pathToFile: string) => {
    fs.openSync(pathToFile, 'w');
}

const sendError = (sender: Electron.WebContents, error: ElectronErrorKind, type: ElectronErrorType, data: ElectronErrorAdditionalData) => {
    sender.send('error', error, type, data)
}

const openInExplorer = (event: IpcMainEvent, pathToDir: string) => {
    exec(`explorer "${pathToDir}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(error);
        }

        if (stderr) {
            console.error(stderr);
        }

        if (stdout) {
            console.log(stdout);
        }
    })
}

ipcMain.on('get-drives', readDrives);
ipcMain.on('read-directory', readDirectory);
ipcMain.on('open-file', openFile);
ipcMain.on('delete-file', deleteFile);
ipcMain.on('rename-file', renameFile)
ipcMain.on('create-folder', createFolder);
ipcMain.on('create-file', createFile);
ipcMain.on('open-in-explorer', openInExplorer);