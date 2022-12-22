import React, { useEffect } from "react";

type Props = {
    setFiles: React.Dispatch<React.SetStateAction<CustomFile[]>>
    setIsFilesLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const useListenElectronEvents = ({ setFiles, setIsFilesLoading }: Props) => {
    const onDrivesLoaded = (event: Electron.IpcRendererEvent, drives: string[]) => {
        setFiles(
            drives.map(drive => ({
                fileName: drive,
                size: 0,
                isDrive: true
            }))
        );
        setIsFilesLoading(false);
    }

    const onReadDirectory = (event: Electron.IpcRendererEvent, files: CustomFile[]) => {
        setFiles(files.reverse().sort(file => file.isFile ? 1 : -1));
        setIsFilesLoading(false);
    }

    const onInDirChange = (event: Electron.IpcRendererEvent, changes: UpdatedFiles) => {
        setFiles(prev => {
            prev = prev.filter(file => !changes.delete.find(f => f === file.fileName));
            changes.create.forEach(file => {
                if (!prev.find(f => f.fileName === file.fileName)) {
                    prev.push(file);
                }
            })

            return prev;
        })
        setIsFilesLoading(false);
    }

    useEffect(() => {
        window.electronAPI.onDrivesLoaded(onDrivesLoaded);
        window.electronAPI.onReadDirectory(onReadDirectory);
        window.electronAPI.onInDirChange(onInDirChange);

        return () => {
            window.electronAPI.unsubscribe('directory');
            window.electronAPI.unsubscribe('in-dir-change');
            window.electronAPI.unsubscribe('drives-loaded');
        }
    }, []);
}

export default useListenElectronEvents;