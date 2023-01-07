import GoogleIcon from '../GoogleIcon/GoogleIcon';

import styles from './FrameWindowControlButtons.module.scss';
import { useTranslation } from 'react-i18next';

type Props = {
    isFullscreen: boolean;
    setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
};

function FrameWindowControlButtons({ isFullscreen, setIsFullscreen }: Props) {
    const { t } = useTranslation();

    const handleMinimize = () => window.electronAPI.minimize();

    const handleWindowViewButtonClick = () => {
        if (!isFullscreen) {
            window.electronAPI.maximize();
        } else {
            window.electronAPI.restoreToWindow();
        }
        setIsFullscreen(prev => !prev);
    };

    const handleClose = () => window.electronAPI.close();

    return (
        <div
            className={'absolute flex gap-1 p-1 rounded-bl-lg right-0 top-0 z-[100] bg-[var(--menu-dark)] transition-transform'
                .concat(isFullscreen ? ` -translate-y-[100%] hover:translate-y-0` : '')
                .concat(' ', styles.wrapper)}
        >
            <button
                title={t('windowControlButtons.minimize')}
                onClick={handleMinimize}
                className={"grid rounded-lg place-items-center cursor-pointer transition w-9 h-9"
                    .concat(' hover:bg-[var(--top-grey-dark)]')}
            >
                <GoogleIcon iconName="minimize" size={34} />
            </button>

            <button
                title={t(`windowControlButtons.${isFullscreen ? 'restoreToWindow' : 'maximize'}`)}
                onClick={handleWindowViewButtonClick}
                className={"grid rounded-lg place-items-center cursor-pointer transition w-9 h-9"
                    .concat(' hover:bg-[var(--top-grey-dark)]')}
            >
                <GoogleIcon iconName={isFullscreen ? 'fullscreen_exit' : 'fullscreen'} size={34} />
            </button>

            <button
                title={t('windowControlButtons.close')}
                onClick={handleClose}
                className={"grid rounded-lg place-items-center cursor-pointer transition w-9 h-9"
                    .concat(' hover:bg-[var(--top-grey-dark)]')}
            >
                <GoogleIcon iconName="close" size={34} />
            </button>
        </div >
    );
}

export default FrameWindowControlButtons;
