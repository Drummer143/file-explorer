// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types.d.ts" />
import React, { useEffect, useRef, useState } from 'react';

import styles from './App.module.scss';
import FileButton from './components/FileButton/FileButton';

function App() {
    const [data, setData] = useState<CustomFile[]>();
    const [currentPath, setCurrentPath] = useState<string>('');
    const [isWaitingFiles, setIsWaitingFiles] = useState(false);
    const [input, setInput] = useState(currentPath);
    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleOpenFile = (file: CustomFile) => {
        if (file.isDirectory) {
            setIsWaitingFiles(true);
            if (!currentPath) {
                setCurrentPath(file.fileName);
                window.electronAPI.readDirectory(file.fileName);
            } else {
                const newPath = `${currentPath}\\${file.fileName}`;
                window.electronAPI.readDirectory(newPath);
                setCurrentPath(newPath);
            }
        } else {
            const newPath = `${currentPath}\\${file.fileName}`;
            console.log(newPath);
            window.electronAPI.openFile(newPath);
            setCurrentPath(newPath);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    useEffect(() => {
        window.electronAPI.onDrivesLoaded((event, drives) => {
            setData(drives.map(drive => {
                return {
                    fileName: drive,
                    isFile: false,
                    isDirectory: true,
                    size: 0
                }
            }));
        })

        window.electronAPI.onReadDirectory((event, files) => {
            setData(files);
            setIsWaitingFiles(false);
        });

        window.electronAPI.getDrives();
    }, [])

    useEffect(() => {
        if (currentPath) {
            console.log(currentPath);
        }
        setInput(currentPath);
    }, [currentPath]);

    useEffect(() => {
        inputRef.current.style.width = `${spanRef.current.clientWidth + 20 + 80}px`
    })

    return (
        <>
            <span ref={spanRef} className={'absolute text-4xl px-0.5 top-[-1000px] left-[-1000px]'}>{input}</span>
            <div>
                <input ref={inputRef} value={input} onChange={handleChange} className={`absolute min-w-[400px] max-w-[80%] ${currentPath ? 'opacity-1' : 'opacity-0 pointer-events-none select-none'} text-[var(--secondary-text-dark)] px-2 py-1 border-solid border border-transparent text-center rounded-2xl transition delay-50 duration-300 top-4 left-1/2 -translate-x-1/2 text-4xl leading-[3rem] hover:border-[var(--top-grey-dark)] focus:text-[var(--primary-text-dark)] ${styles.path}`} />

                <div className={`${currentPath ? 'top-24' : 'top-1/2 -translate-y-1/2'} ${isWaitingFiles && 'opacity-0'} absolute overflow-y-auto max-h-[calc(100vh_-_150px)] left-1/2 -translate-x-1/2 transition-[transform, top, left, opacity] duration-500 flex justify-center flex-wrap gap-x-2 gap-y-3 max-w-3/4 text-xl ${styles.filesContainer}`}>
                    {data && data.map(file => <FileButton key={file.fileName} file={file} onClick={() => handleOpenFile(file)} />)}
                </div>
            </div>
        </>
    )
}

export default App;
