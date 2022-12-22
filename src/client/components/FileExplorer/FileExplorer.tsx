import React, { useEffect, useRef, useState } from 'react';

import { useHistoryStore, usePathStore } from '../../zustand/explorerStores';
import FileButton from '../FileButton/FileButton';
import GoBackButton from '../GoBackButton/GoBackButton';

import styles from './FileExplorer.module.scss';

function FileExplorer() {
    const { path: currentPath, updatePath } = usePathStore(state => state);
    const { pushRoute } = useHistoryStore(state => state);

    const [data, setData] = useState<CustomFile[]>([]);
    const [isWaitingFiles, setIsWaitingFiles] = useState(true);
    const [input, setInput] = useState(currentPath);
    const [canChangeNavBarSize, setCanChangeNavBarSize] = useState(true);

    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileContainerRef = useRef<HTMLDivElement>(null);

    const handleOpenFile = (file: CustomFile) => {
        let newPath = currentPath ? `${currentPath}/${file.fileName}` : file.fileName;
        newPath = newPath.replace(/[\\/]{2,}|\//g, '/');

        if (file.isDirectory) {
            pushRoute(currentPath);
            setIsWaitingFiles(true);
            updatePath(newPath);

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

    const handlePathInputEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.code === 'Enter' && currentPath !== input) {
            if (input) {
                window.electronAPI.readDirectory(input);
            } else {
                window.electronAPI.getDrives();
            }
            inputRef.current.blur();
            updatePath(input);
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
            setData(files.reverse().sort(file => file.isFile ? 1 : -1));
            setIsWaitingFiles(false);
        });

        window.electronAPI.onInDirChange((event, changes) => {
            setData(prev => {
                prev = prev.filter(file => !changes.delete.find(f => f === file.fileName));
                changes.create.forEach(file => {
                    if (!prev.find(f => f.fileName === file.fileName)) {
                        prev.push(file);
                    }
                })
                setData(prev);

                return prev;
            })
        })

        if (currentPath) {
            window.electronAPI.readDirectory(currentPath);
        } else {
            window.electronAPI.getDrives();
        }
    }, []);

    useEffect(() => setInput(currentPath), [currentPath]);

    useEffect(() => {
        if (canChangeNavBarSize) {
            inputRef.current.style.width = `${spanRef.current.clientWidth + 20 + 100}px`;
        }
    }, [input, canChangeNavBarSize]);

    return (
        <>
            <span ref={spanRef} className={'absolute text-4xl px-0.5 top-[-1000px] left-[-1000px] invisible pointer-events-none'}>
                {input}
            </span>
            <div>
                <nav
                    ref={inputRef}
                    onMouseLeave={() => setCanChangeNavBarSize(true)}
                    className={'absolute top-16 left-1/2 -translate-x-[calc(50%_+_25px)] min-w-[400px] max-w-[80%]'
                        .concat(' gap-5 transition-[opacity,_width] grid grid-cols-[58px,_1fr] place-items-center')
                    }
                >
                    <GoBackButton onClickAdditional={() => setCanChangeNavBarSize(false)} />

                    <input
                        tabIndex={2}
                        value={input}
                        onChange={handlePathInputChange}
                        onKeyDown={handlePathInputEnterPress}
                        onFocus={() => setCanChangeNavBarSize(true)}
                        className={'text-[var(--secondary-text-dark)] w-full px-5 pt-1 pb-2 border-solid border border-transparent'
                            .concat(' text-center rounded-2xl transition delay-50 duration-300 text-4xl leading-[3rem]')
                            .concat(' hover:border-[var(--top-grey-dark)]')
                            .concat(' focus:text-[var(--primary-text-dark)]')
                            .concat(' ', styles.pathInput)
                        }
                    />
                </nav>

                <div
                    tabIndex={3}
                    data-ctx="explorer"
                    ref={fileContainerRef}
                    className={'max-xl:w-3/4 absolute overflow-y-auto max-h-[calc(100vh_-_14rem)] left-1/2 transition-[transform,_top,_left_,opacity] duration-500'
                        .concat(' scroll-smooth -translate-x-1/2 flex w-7/12 justify-center flex-wrap gap-2 text-xl')
                        .concat(' ', (currentPath && data.length !== 0) ? 'top-40' : 'top-1/2 -translate-y-1/2')
                        .concat(isWaitingFiles ? ' opacity-0' : '')
                        .concat(data.length === 0 ? ' min-h-[100px]' : '')
                        .concat(' ', styles.filesContainer)
                    }
                >
                    {data.length ? (
                        data.map((file, i) => (
                            <FileButton
                                key={file.fileName + i}
                                file={file}
                                onDoubleClick={() => handleOpenFile(file)}
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
