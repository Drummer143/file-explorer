import { useEffect, useState } from 'react';

import TittleFrame from './components/TittleFrame/TittleFrame';
import ContextMenu from './components/ContextMenu/ContextMenu';
import FileExplorer from './components/FileExplorer/FileExplorerLayout/FileExplorerLayout';
import FrameWindowControlButtons from './components/FrameWindowControlButtons/FrameWindowControlButtons';

function App() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        window.electronAPI.isFullscreen((event, isFullscreen) => {
            setIsFullscreen(isFullscreen);
        });

        window.electronAPI.getIsFullscreen();
    }, []);

    return (
        <>
            <ContextMenu />
            <TittleFrame isFullScreen={isFullscreen} />
            <FrameWindowControlButtons
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
            />
            <FileExplorer />
        </>
    );
}

export default App;
