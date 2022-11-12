import React, { useState, useRef, useEffect } from "react";

import FileButton from "../FileButton/FileButton";

import styles from './FileExplorer.module.scss';

function FileExplorer() {
    const [data, setData] = useState<CustomFile[]>();
    const [currentPath, setCurrentPath] = useState<string>('');
    const [isWaitingFiles, setIsWaitingFiles] = useState(false);
    const [input, setInput] = useState(currentPath);

    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileContainerRef = useRef<HTMLDivElement>(null);

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

            fileContainerRef.current.scrollTo({ top: 0 });
        } else {
            const pathToFile = `${currentPath}\\${file.fileName}`;
            window.electronAPI.openFile(pathToFile);
        }
    }

    const handlePathInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    }

    const handlePathInputEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' && currentPath !== input) {
            console.log(input);
            window.electronAPI.readDirectory(input);
            inputRef.current.blur();
            setCurrentPath(input);
        }
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

    useEffect(() => setInput(currentPath), [currentPath]);

    useEffect(() => {
        inputRef.current.style.width = `${spanRef.current.clientWidth + 20 + 80}px`
    }, [input])

    return (
        <>
            <span ref={spanRef} className={'absolute text-4xl px-0.5 top-[-1000px] left-[-1000px]'}>{input}</span>
            <div>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={handlePathInputChange}
                    onKeyDown={handlePathInputEnterPress}
                    className={`absolute min-w-[400px] max-w-[80%] text-[var(--secondary-text-dark)] px-2 py-1 border-solid border border-transparent text-center rounded-2xl transition delay-50 duration-300 top-4 left-1/2 -translate-x-1/2 text-4xl leading-[3rem] hover:border-[var(--top-grey-dark)] focus:text-[var(--primary-text-dark)] ${styles.path}`}
                />

                <div
                    ref={fileContainerRef}
                    className={`${currentPath ? 'top-24' : 'top-1/2 -translate-y-1/2'} ${isWaitingFiles && 'opacity-0'} max-xl:w-3/4 absolute overflow-y-auto max-h-[calc(100vh_-_150px)] left-1/2 scroll-smooth -translate-x-1/2 flex w-7/12 justify-center flex-wrap gap-2 text-xl ${styles.filesContainer}`}
                >
                    {data && data.map(file => <FileButton key={file.fileName} file={file} onClick={() => handleOpenFile(file)} />)}
                </div>
            </div>
        </>
    )
}

export default FileExplorer;