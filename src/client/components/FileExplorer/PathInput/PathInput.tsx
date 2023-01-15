import React, { useEffect, useRef, useState } from "react";

import { useHistoryStore } from "../../../stores/historyStore";
import GoBackButton from "../GoBackButton/GoBackButton";
import GoForwardButton from "../GoForwardButton/GoForwardButton";

import styles from './PathInput.module.scss';

type Props = {
    setIsFilesLoading: React.Dispatch<React.SetStateAction<boolean>>
}

function PathInput({ setIsFilesLoading }: Props) {
    const { pushRoute, currentPath } = useHistoryStore(state => state);

    const [input, setInput] = useState<string>(currentPath);
    const [canChangeNavBarSize, setCanChangeNavBarSize] = useState(true);

    const inputRef = useRef<HTMLInputElement>(null);
    const spanRef = useRef<HTMLSpanElement>(null);

    const handlePathInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    const handlePathInputEnterPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const newPath = input.replace('/', '\\');

        if (e.code === 'Enter' && currentPath !== newPath) {
            setIsFilesLoading(true);
            pushRoute(newPath);
            inputRef.current.blur();
        }
    };

    useEffect(() => {
        if (canChangeNavBarSize) {
            inputRef.current.style.width = `${spanRef.current.clientWidth + 200}px`;
        }
    }, [input, canChangeNavBarSize]);

    useEffect(() => setInput(currentPath), [currentPath]);

    return (
        <>
            <span
                ref={spanRef}
                className={'absolute text-4xl px-0.5 top-[-1000vmax] left-[-1000vmax] invisible pointer-events-none'}
            >
                {input}
            </span>
            <div
                ref={inputRef}
                onMouseLeave={() => setCanChangeNavBarSize(true)}
                className={'absolute top-16 left-1/2 -translate-x-1/2 min-w-[400px] max-w-[80%] place-items-center'
                    .concat(' gap-5 transition-[opacity,_width] grid grid-cols-[min-content,_1fr,_min-content]')
                }
            >
                <GoBackButton onClickAdditional={() => setCanChangeNavBarSize(false)} />

                <input
                    value={input}
                    onChange={handlePathInputChange}
                    onKeyDown={handlePathInputEnterPress}
                    onFocus={() => setCanChangeNavBarSize(true)}
                    className={'text-[var(--secondary-text-dark)] w-full px-5 pt-1 pb-2 border-solid border border-transparent'
                        .concat(' text-center rounded-2xl transition delay-50 duration-300 text-4xl leading-[3rem]')
                        .concat(' hover:border-[var(--top-grey-dark)]')
                        .concat(' focus:text-[var(--primary-text-dark)]')
                        .concat(' ', styles.pathInput)}
                />

                <GoForwardButton onClickAdditional={() => setCanChangeNavBarSize(false)} />
            </div>
        </>
    );
}

export default PathInput;