// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types.d.ts" />

import { useState } from 'react';

import TittleFrame from './components/TittleFrame/TittleFrame';
import FileExplorer from './components/FileExplorer/FileExplorer';
import FrameWindowControlButtons from './components/FrameWindowControlButtons/FrameWindowControlButtons';

// import styles from './App.module.scss';

function App() {
    const [isFullscreen, setIsFullscreen] = useState(false);
    return (
        <>
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
