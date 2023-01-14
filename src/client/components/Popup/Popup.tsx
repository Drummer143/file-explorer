import { useEffect, useRef, useState } from 'react';

import GoogleIcon from '../GoogleIcon/GoogleIcon';
import usePopupStore from './../../stores/popupStore';

type Props = PopupInfo & { index: number };

function Popup({ message, type, id, index }: Props) {
    const { deletePopup, lifetime } = usePopupStore();

    const [ctime] = useState(new Date().getTime());
    const [timeLeft, setTimeLeft] = useState(lifetime);
    const [pauseTime, setPauseTime] = useState(0);
    const [delayTime, setDelayTime] = useState(0);
    const [isMinimized, setIsMinimized] = useState(true);

    const intervalRef = useRef<NodeJS.Timer>();

    const createInterval = (delay = 0) => setInterval(() => {
        const currentTime = (new Date().getTime() - ctime) / 1000;

        if (currentTime <= lifetime + delay) {
            setTimeLeft(lifetime + delay - currentTime);
        } else {
            deletePopup(id);
        }
    }, 1000);

    const handleMouseEnter = () => {
        setPauseTime(new Date().getTime());
        clearInterval(intervalRef.current);
    }

    const handleMouseLeave = () => {
        const delay = (new Date().getTime() - pauseTime) / 1000;
        setDelayTime(prev => prev + delay);
        intervalRef.current = createInterval(delayTime + delay);
    }

    useEffect(() => {
        intervalRef.current = createInterval();

        return () => {
            clearInterval(intervalRef.current);
        }
    }, []);

    return (
        <div className={'absolute bottom-0 w-64 bg-[var(--bottom-grey-dark)] rounded transition-transform'}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ transform: `translateY(calc(-${index * 100}% - ${index * 10}px))` }}
        >
            <div className={'pb-0.5 grid grid-cols-[1fr,_min-content] relative'}>
                <div className='absolute bottom-0 left-0 h-[1px] w-full transition-[width] flex'>
                    <div className={'h-full transition-[width] bg-white'
                        .concat(type === 'error' ? ' bg-red-500' : '')
                        .concat(type === 'info' ? ' bg-blue-500' : '')
                        .concat(type === 'warning' ? ' bg-yellow-500' : '')}
                        style={{ width: `${timeLeft / lifetime * 100}%` }}
                    ></div>
                    <div className='h-full transition-[width] bg-gray-500' style={{ width: `${100 - timeLeft / lifetime * 100}%` }}></div>
                </div>
                <p className={'px-2' +  /* border-solid border-0 border-b-[1px] */ ' cursor-pointer rounded-tl transition-[background-color]'
                    .concat(' hover:bg-[var(--top-grey-dark)]')}
                    onClick={() => setIsMinimized(prev => !prev)}
                >{type}</p>

                <button
                    className={'aspect-square place-self-center rounded-tr transition-[background-color] bg-transparent'
                        .concat(' hover:bg-[var(--top-grey-dark)]')}
                    onClick={() => deletePopup(id)}
                >
                    <GoogleIcon iconName='close' size={24} />
                </button>
            </div>

            <p className={'px-3 select-text bg-[var(--top-grey-dark)]'
                .concat(isMinimized ? ' text-ellipsis whitespace-nowrap overflow-hidden' : '')}
            >
                {message}
            </p>
        </div >
    )
}

export default Popup;