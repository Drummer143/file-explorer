import { useEffect, useState } from 'react';

import GoogleIcon from '../GoogleIcon/GoogleIcon';

import styles from './FrameWindowControlButtons.module.scss';

function FrameWindowControlButtons() {
    const [isFullscreen, setFullscreen] = useState(true);

    const handleMinimize = () => window.electronAPI.minimize();
    const handleWindowViewButtonClick = () => {
        if (!isFullscreen) {
            window.electronAPI.maximize();
        } else {
            window.electronAPI.restoreToWindow();
        }
        setFullscreen(prev => !prev);
    }
    const handleClose = () => window.electronAPI.close();

    useEffect(() => {
        window.electronAPI.isFullscreen((event, isFullscreen) => {
            setFullscreen(isFullscreen);
            console.log(event, isFullscreen);
        });

        window.electronAPI.getIsFullscreen();
    }, [])

    return (
        <div className={`absolute flex gap-1 p-1 rounded-bl-lg right-0 top-0 z-[1] bg-[var(--menu-dark)] transition-transform ${isFullscreen && `-translate-y-[100%] hover:translate-y-0`} ${styles.wrapper}`}>
            <button onClick={handleMinimize} className='grid rounded-lg place-items-center cursor-pointer transition hover:bg-[var(--top-grey-dark)] w-9 h-9'><GoogleIcon iconName='minimize' size={34} /></button>
            <button onClick={handleWindowViewButtonClick} className='grid rounded-lg place-items-center cursor-pointer transition hover:bg-[var(--top-grey-dark)] w-9 h-9'><GoogleIcon iconName={isFullscreen ? 'fullscreen_exit' : 'fullscreen'} size={34} /></button>
            <button onClick={handleClose} className='grid rounded-lg place-items-center cursor-pointer transition hover:bg-[var(--top-grey-dark)] w-9 h-9'><GoogleIcon iconName='close' size={34} /></button>
        </div>
    )
}

export default FrameWindowControlButtons;