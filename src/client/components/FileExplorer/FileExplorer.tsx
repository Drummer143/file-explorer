import React, { useEffect, useRef, useState } from 'react';

import { useHistoryStore } from '../../stores/explorerStores';
import FileButton from '../FileButton/FileButton';
import GoBackButton from '../GoBackButton/GoBackButton';
import useListenElectronEvents from '../../hooks/useListenElectronEvents';

import styles from './FileExplorer.module.scss';
import GoForwardButton from '../GoForwardButton/GoForwardButton';

function FileExplorer() {
    const { pushRoute, currentPath } = useHistoryStore(state => state);

    const [files, setFiles] = useState<CustomFile[]>([]);
    const [isFilesLoading, setIsFilesLoading] = useState(true);
    const [input, setInput] = useState<string>(currentPath);
    const [canChangeNavBarSize, setCanChangeNavBarSize] = useState(true);

    const spanRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileContainerRef = useRef<HTMLDivElement>(null);

    const handleOpenFile = (file: CustomFile) => {
        let newPath = currentPath ? `${currentPath}/${file.fileName}` : file.fileName;
        newPath = newPath.replace(/[\\/]{2,}|\//g, '/');

        if (file.isDirectory || file.isDrive) {
            pushRoute(newPath);
            setIsFilesLoading(true);

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
            setIsFilesLoading(true);
            if (input) {
                window.electronAPI.readDirectory(input);
            } else {
                window.electronAPI.getDrives();
            }
            pushRoute(input);
            inputRef.current.blur();
        }
    };

    useListenElectronEvents({
        setFiles,
        setIsFilesLoading
    });

    useEffect(() => window.electronAPI.getDrives(), []);

    useEffect(() => setInput(currentPath), [currentPath]);

    useEffect(() => {
        if (canChangeNavBarSize) {
            inputRef.current.style.width = `${spanRef.current.clientWidth + 200}px`;
        }
    }, [input, canChangeNavBarSize]);

    return (
        <>
            <span
                ref={spanRef}
                className={
                    'absolute text-4xl px-0.5 top-[-1000px] left-[-1000px] invisible pointer-events-none'
                }
            >
                {input}
            </span>
            <div>
                <nav
                    ref={inputRef}
                    onMouseLeave={() => setCanChangeNavBarSize(true)}
                    className={'absolute top-16 left-1/2 -translate-x-1/2 min-w-[400px] max-w-[80%]'.concat(
                        ' gap-5 transition-[opacity,_width] grid grid-cols-[min-content,_1fr,_min-content] place-items-center'
                    )}
                >
                    <GoBackButton onClickAdditional={() => setCanChangeNavBarSize(false)} />

                    <input
                        value={input}
                        onChange={handlePathInputChange}
                        onKeyDown={handlePathInputEnterPress}
                        onFocus={() => setCanChangeNavBarSize(true)}
                        className={'text-[var(--secondary-text-dark)] w-full px-5 pt-1 pb-2 border-solid border border-transparent'
                            .concat(
                                ' text-center rounded-2xl transition delay-50 duration-300 text-4xl leading-[3rem]'
                            )
                            .concat(' hover:border-[var(--top-grey-dark)]')
                            .concat(' focus:text-[var(--primary-text-dark)]')
                            .concat(' ', styles.pathInput)}
                    />

                    <GoForwardButton onClickAdditional={() => setCanChangeNavBarSize(false)} />
                </nav>

                <div
                    data-ctx="explorer"
                    ref={fileContainerRef}
                    className={'max-xl:w-3/4 absolute overflow-y-auto max-h-[calc(100vh_-_14rem)] left-1/2 transition-[transform,_top,_left_,opacity] duration-500'
                        .concat(
                            ' scroll-smooth -translate-x-1/2 flex w-7/12 justify-center flex-wrap gap-2 text-xl'
                        )
                        .concat(
                            ' ',
                            currentPath && files.length !== 0
                                ? 'top-40'
                                : 'top-1/2 -translate-y-1/2'
                        )
                        .concat(isFilesLoading ? ' opacity-0' : '')
                        .concat(files.length === 0 ? ' min-h-[100px]' : '')
                        .concat(' ', styles.filesContainer)}
                >
                    {files.length ? (
                        files.map((file, i) => (
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
