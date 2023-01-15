import React, { useEffect } from 'react';

import { useHistoryStore } from '../stores/historyStore';

type Props = {
    setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>;
    setIsFilesLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const useListenElectronEvents = ({ setFiles, setIsFilesLoading }: Props) => {
    const { currentPath } = useHistoryStore();

    const onDrivesLoaded = (event: Electron.IpcRendererEvent, drives: string[]) => {
        setFiles(
            drives.map(drive => ({
                fileName: drive,
                size: 0,
                isDrive: true
            }))
        );
        setIsFilesLoading(false);
    };

    const onReadDirectory = (event: Electron.IpcRendererEvent, files: CustomFile[], pathToParentDir: string) => {
        if (currentPath === pathToParentDir) {
            setFiles(files.reverse().sort(file => (file.isFile ? 1 : -1)));
            setIsFilesLoading(false);
        }
    };

    const onInDirChange = (event: Electron.IpcRendererEvent, changes: UpdatedFiles) => {
        setFiles(prev => prev
            .filter(file => !changes.delete.find(f => f === file.fileName))
            .concat(changes.create)
        );
        setIsFilesLoading(false);
    };

    useEffect(() => {
        window.electronAPI.onDrivesLoaded(onDrivesLoaded);
        window.electronAPI.onInDirChange(onInDirChange);

        return () => {
            window.electronAPI.unsubscribe('in-dir-change');
            window.electronAPI.unsubscribe('drives-loaded');
        };
    }, []);

    useEffect(() => {
        window.electronAPI.onReadDirectory(onReadDirectory);

        return () => {
            window.electronAPI.unsubscribe('directory');
        }
    })

    useEffect(() => {
        if (currentPath) {
            window.electronAPI.readDirectory(currentPath)
        } else {
            window.electronAPI.getDrives();
        }
    }, [currentPath]);
};

export default useListenElectronEvents;
