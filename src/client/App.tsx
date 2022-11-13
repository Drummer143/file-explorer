// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../types.d.ts" />

import FileExplorer from './components/FileExplorer/FileExplorer';

// import styles from './App.module.scss';
import FrameWindowControlButtons from './components/FrameWindowControlButtons/FrameWindowControlButtons';

function App() {
    return (
        <>
            <FrameWindowControlButtons />
            <FileExplorer />
        </>
    )
}

export default App;
