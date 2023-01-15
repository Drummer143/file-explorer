import { useRef } from 'react';

import { useHistoryStore } from '../../../stores/historyStore';
import FileButton from '../FileButton/FileButton';

import styles from './FileList.module.scss';

type Props = {
    isFilesLoading: boolean

    setIsFilesLoading: React.Dispatch<React.SetStateAction<boolean>>
    files: CustomFile[]
}

function FileList({ files, isFilesLoading, setIsFilesLoading }: Props) {
    const { pushRoute, currentPath } = useHistoryStore(state => state);

    const fileContainerRef = useRef<HTMLDivElement>(null);

    const handleOpenFile = (file: CustomFile) => {
        let newPath = currentPath ? `${currentPath}\\${file.fileName}` : file.fileName;
        newPath = newPath.replace(/[\\/]{2,}|\//g, '\\');

        if (file.isDirectory || file.isDrive) {
            pushRoute(newPath);
            setIsFilesLoading(true);

            fileContainerRef.current.scrollTo({ top: 0 });
        } else {
            window.electronAPI.openFile(newPath);
        }
    };

    return (
        <div
            data-ctx={currentPath ? 'explorer' : null}
            ref={fileContainerRef}
            className={'max-xl:w-3/4 absolute overflow-y-auto max-h-[calc(100vh_-_14rem)] left-1/2 transition-[transform,_top,_left_,opacity,_border-color] duration-500'
                .concat(' scroll-smooth -translate-x-1/2 flex w-3/4 justify-center flex-wrap gap-2 text-xl border border-solid border-transparent rounded-xl p-3')
                .concat(' ', currentPath && files.length !== 0 ? 'top-40 border-slate-800 h-full content-start' : 'top-1/2 -translate-y-1/2')
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
    );
}

export default FileList;