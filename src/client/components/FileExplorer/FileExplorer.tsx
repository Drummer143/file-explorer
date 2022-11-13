import React, { useState, useRef, useEffect } from 'react';

import FileButton from '../FileButton/FileButton';
import GoogleIcon from '../GoogleIcon/GoogleIcon';

import styles from './FileExplorer.module.scss';

function FileExplorer() {
    const [data, setData] = useState<CustomFile[]>([]);
    const [currentPath, setCurrentPath] = useState<string>('');
    const [isWaitingFiles, setIsWaitingFiles] = useState(true);
    const [input, setInput] = useState(currentPath);
    const [history] = useState<string[]>([]);

    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileContainerRef = useRef<HTMLDivElement>(null);

    const handleOpenFile = (file: CustomFile) => {
        let newPath = currentPath ? `${currentPath}/${file.fileName}` : file.fileName;
        newPath = newPath.replace(/[\\/]{2,}|\//g, '/');

        if (file.isDirectory) {
            history.push(currentPath);
            setIsWaitingFiles(true);
            setCurrentPath(newPath);

            fileContainerRef.current.scrollTo({ top: 0 });

            if (!currentPath) {
                window.electronAPI.readDirectory(newPath);
            } else {
                window.electronAPI.readDirectory(newPath);
            }
        } else {
            window.electronAPI.openFile(newPath);
        }
    };

    const handlePathInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handleGoBack = () => {
        const prevPath = history.pop();
        if (prevPath) {
            window.electronAPI.readDirectory(prevPath);
        } else {
            window.electronAPI.getDrives();
        }
        setCurrentPath(prevPath);
    }

    const handlePathInputEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' && currentPath !== input) {
            if (input) {
                window.electronAPI.readDirectory(input);
            } else {
                window.electronAPI.getDrives();
            }
            inputRef.current.blur();
            setCurrentPath(input);
        }
    };

    useEffect(() => {
        window.electronAPI.onDrivesLoaded((event, drives) => {
            setData(
                drives.map(drive => {
                    return {
                        fileName: drive,
                        isFile: false,
                        isDirectory: true,
                        size: 0
                    };
                })
            );

            setIsWaitingFiles(false);
        });

        window.electronAPI.onReadDirectory((event, files) => {
            setData(files);
            setIsWaitingFiles(false);
        });

        window.electronAPI.getDrives();
    }, []);

    useEffect(() => setInput(currentPath), [currentPath]);

    useEffect(() => {
        inputRef.current.style.width = `${spanRef.current.clientWidth + 20 + 80}px`;
    }, [input]);

    return (
        <>
            <span ref={spanRef} className={'absolute text-4xl px-0.5 top-[-1000px] left-[-1000px]'}>
                {input}
            </span>
            <div>
                <div
                    ref={inputRef}
                    className={`absolute top-16 left-1/2 -translate-x-[calc(50%_+_25px)] min-w-[400px] max-w-[80%] gap-5 transition-[opacity,_width] grid grid-cols-[58px,_1fr] place-items-center`}
                >
                    <button onClick={handleGoBack} className={`h-[3.25rem] ${history.length === 0 && 'opacity-0 pointer-events-none'} w-[3.25rem] hover:`}><GoogleIcon iconName='arrow_back' size={40} /></button>
                    <input
                        value={input}
                        onChange={handlePathInputChange}
                        onKeyDown={handlePathInputEnterPress}
                        className={`text-[var(--secondary-text-dark)] w-full px-2 pt-1 pb-2 border-solid border border-transparent text-center rounded-2xl transition delay-50 duration-300 text-4xl leading-[3rem] hover:border-[var(--top-grey-dark)] focus:text-[var(--primary-text-dark)] ${styles.path}`}
                    />
                </div>

                <div
                    ref={fileContainerRef}
                    className={`${currentPath && data.length !== 0 ? 'top-40' : 'top-1/2 -translate-y-1/2'
                        } ${isWaitingFiles && 'opacity-0'} ${data.length === 0 && 'min-h-[100px]'
                        } max-xl:w-3/4 absolute overflow-y-auto max-h-[calc(100vh_-_14rem)] left-1/2 scroll-smooth -translate-x-1/2 flex w-7/12 justify-center flex-wrap gap-2 text-xl ${styles.filesContainer
                        }`}
                >
                    {data.length ? (
                        data.map(file => (
                            <FileButton
                                key={file.fileName}
                                file={file}
                                onClick={() => handleOpenFile(file)}
                            />
                        ))
                    ) : (
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                            Folder is empty
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FileExplorer;
