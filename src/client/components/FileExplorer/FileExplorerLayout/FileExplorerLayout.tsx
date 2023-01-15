import { useCallback, useEffect, useState } from 'react';

import PathInput from '../PathInput/PathInput';
import useListenElectronEvents from '../../../hooks/useListenElectronEvents';

import FileList from '../FileList/FileList';
import { useHistoryStore } from '../../../stores/historyStore';

function FileExplorerLayout() {
    const { currentPath } = useHistoryStore();
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [isFilesLoading, setIsFilesLoading] = useState(true);

    useListenElectronEvents({
        setFiles,
        setIsFilesLoading
    });

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.shiftKey && e.code === 'KeyE') {
            window.electronAPI.openInExplorer(currentPath);
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [currentPath]);

    return (
        <>
            <PathInput setIsFilesLoading={setIsFilesLoading} />

            <FileList
                isFilesLoading={isFilesLoading}
                setIsFilesLoading={setIsFilesLoading}
                files={files}
            />
        </>
    );
}

export default FileExplorerLayout;
