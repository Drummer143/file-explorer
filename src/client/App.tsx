import React, { useEffect, useState } from 'react';

import Settings from './components/Settings/Settings';
import TittleFrame from './components/TittleFrame/TittleFrame';
import ContextMenu from './components/ContextMenu/ContextMenu';
import ModalLayout from './components/Modals/ModalLayout/ModalLayout';
import FileExplorer from './components/FileExplorer/FileExplorerLayout/FileExplorerLayout';
import FrameWindowControlButtons from './components/FrameWindowControlButtons/FrameWindowControlButtons';
import PopupContainer from './components/popups/PopupContainer/PopupContainer';

function App() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        window.electronAPI.isFullscreen((event, isFullscreen) => {
            setIsFullscreen(isFullscreen);
        });

        window.electronAPI.getIsFullscreen();
    }, []);

    return (
        <React.StrictMode>
            <Settings />
            <ModalLayout />
            <ContextMenu />
            <FileExplorer />
            <PopupContainer />
            <TittleFrame isFullScreen={isFullscreen} />
            <FrameWindowControlButtons
                isFullscreen={isFullscreen}
                setIsFullscreen={setIsFullscreen}
            />
        </React.StrictMode>
    );
}

export default App;
