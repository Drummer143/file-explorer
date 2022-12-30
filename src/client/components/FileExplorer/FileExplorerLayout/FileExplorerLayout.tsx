import { useEffect, useState } from 'react';

import PathInput from '../PathInput/PathInput';
import useListenElectronEvents from '../../../hooks/useListenElectronEvents';

import FileList from '../FileList/FileList';

function FileExplorerLayout() {
    const [files, setFiles] = useState<CustomFile[]>([]);
    const [isFilesLoading, setIsFilesLoading] = useState(true);

    useListenElectronEvents({
        setFiles,
        setIsFilesLoading
    });

    useEffect(() => window.electronAPI.getDrives(), []);

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
