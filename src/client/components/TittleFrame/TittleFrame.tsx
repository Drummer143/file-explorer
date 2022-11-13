import styles from './TittleFrame.module.scss';

type Props = {
    isFullScreen: boolean;
};

function TittleFrame({ isFullScreen }: Props) {
    return (
        <div
            className={`absolute ${
                isFullScreen ? '-top-11' : 'top-0'
            } transition-[top] left-1/2 -translate-x-1/2 text-xl bg-[var(--menu-dark)] w-48 h-11 rounded-b-lg grid place-items-center ${
                styles.wrapper
            }`}
        >
            {document.title}
        </div>
    );
}

export default TittleFrame;
