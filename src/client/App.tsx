import { useEffect, useRef, useState } from 'react';

import styles from './App.module.scss';

type File = {
    fileName: string,
    isFile: boolean,
    isDirectory: boolean
}

function App() {
    const [data, setData] = useState<File[]>();
    const [currentPath, setCurrentPath] = useState<string>('');
    const filesContainerRef = useRef<HTMLDivElement>(null);
    const [status, setStatus] = useState<'normal' | 'hiding' | 'appearing'>('normal');

    const updatePath = (newFolder: File) => {
        if (newFolder.isDirectory) {
            if (!currentPath) {
                setCurrentPath(newFolder.fileName);
            } else {
                const newPath = `${currentPath}/${newFolder.fileName}`;
                setCurrentPath(newPath);
            }
        }
    }

    const handleOpenFile = (file: File) => {
        if (file.isDirectory) {
            if (!currentPath) {
                setCurrentPath(file.fileName);
                window.electronAPI.readDirectory(file.fileName);
            } else {
                const newPath = `${currentPath}/${file.fileName}`;
                window.electronAPI.readDirectory(newPath);
                setCurrentPath(newPath);
            }
        } else {
            const newPath = `${currentPath}/${file.fileName}`;
            console.log(newPath);
            window.electronAPI.openFile(newPath);
            setCurrentPath(newPath);
        }
    }

    useEffect(() => {
        window.electronAPI.onDrivesLoaded((event, drives) => {
            setData(drives.map(drive => {
                return {
                    fileName: drive,
                    isFile: false,
                    isDirectory: true
                }
            }));
        })

        window.electronAPI.onReadDirectory((event, files) => setData(files));

        window.electronAPI.getDrives();
    }, [])

    useEffect(() => {
        if (currentPath) {
            console.log(currentPath);
        }
    }, [currentPath]);

    const animation = () => {
        filesContainerRef.current.className = styles.roll.concat(' ' + filesContainerRef.current.className);
    }

    return (
        <>
            {<h1 className={styles.path}>{currentPath || 'empty'}</h1>}

            <div ref={filesContainerRef} className={styles.filesContainer}>
                {data && data.map((file, i) => <button key={i + file.fileName[0]} className={styles.file}>{file.fileName}</button>)}
            </div>
        </>
    )
}

export default App;
