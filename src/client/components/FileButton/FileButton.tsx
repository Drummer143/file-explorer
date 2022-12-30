import { useState, useEffect } from 'react';

import GoogleIcon from '../GoogleIcon/GoogleIcon';

import styles from './FileButton.module.scss';

type Props = {
    file: CustomFile;

    onDoubleClick: () => void;
};

function FileButton({ file, onDoubleClick }: Props) {
    const { isFile, size, fileName, isDirectory, isDrive } = file;
    const [ctx, setCtx] = useState('');

    const getFileButtonFromPoint = (x: number, y: number): HTMLElement | undefined => {
        return (document.elementsFromPoint(x, y) as HTMLElement[]).find(
            elem => elem?.dataset?.ctx === 'file' || elem?.dataset?.ctx === 'folder'
        );
    };

    const handleArrowKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        const arrowKeyCodes = ['ArrowLeft', 'ArrowUp', 'ArrowRight', 'ArrowDown'];

        if (e.code === 'Enter') {
            onDoubleClick();
        } else if (!arrowKeyCodes.includes(e.code)) {
            return;
        }

        const rect = (e.target as HTMLElement).getBoundingClientRect();
        const listGapInRem = +getComputedStyle(document.documentElement)
            .getPropertyValue('--file-list-gap')
            .replace('rem', '');
        const oneGapInPixels = parseFloat(getComputedStyle(document.documentElement).fontSize);
        const listGapShift = listGapInRem * oneGapInPixels;

        let elem: HTMLElement | undefined;

        switch (e.code) {
            case 'ArrowLeft':
                elem = getFileButtonFromPoint(
                    rect.left - listGapShift - 1,
                    rect.top + rect.height / 2
                );
                break;
            case 'ArrowRight':
                elem = getFileButtonFromPoint(
                    rect.right + listGapShift + 1,
                    rect.top + rect.height / 2
                );
                break;
            case 'ArrowUp': {
                const x = rect.left + rect.width / 2,
                    y = rect.top - listGapShift - 1;
                elem = getFileButtonFromPoint(x, y);

                for (
                    let shiftFromMid = 0;
                    shiftFromMid <= rect.width / 2 && !elem;
                    shiftFromMid++
                ) {
                    elem = getFileButtonFromPoint(x + shiftFromMid, y);
                    if (!elem) {
                        elem = getFileButtonFromPoint(x - shiftFromMid, y);
                    }
                }
                break;
            }
            case 'ArrowDown': {
                const x = rect.left + rect.width / 2,
                    y = rect.bottom + listGapShift + 1;
                elem = getFileButtonFromPoint(x, y);

                for (
                    let shiftFromMid = 0;
                    shiftFromMid <= rect.width / 2 && !elem;
                    shiftFromMid++
                ) {
                    elem = getFileButtonFromPoint(x + shiftFromMid, y);
                    if (!elem) {
                        elem = getFileButtonFromPoint(x - shiftFromMid, y);
                    }
                }
                break;
            }
        }

        if (elem) {
            elem.focus();
        }
    };

    useEffect(() => {
        if (isFile) {
            setCtx('file');
        } else if (isDirectory) {
            setCtx('folder');
        } else if (isDrive) {
            setCtx('drive');
        }
    }, []);

    return (
        <button
            data-ctx={ctx}
            data-info={fileName}
            onDoubleClick={onDoubleClick}
            onClick={e => (e.target as HTMLElement).focus()}
            onKeyDown={handleArrowKeyDown}
            className={'flex cursor-pointer items-center flex-row px-3 py-2 rounded-lg bg-[var(--top-grey-dark)] gap-x-2 gap-y-1 transition-[background-color] -outline-offset-1 outline-1'
                .concat(' hover:bg-[var(--bottom-grey-dark)]')
                .concat(' active:bg-[var(--bg-dark)]')
                .concat(' focus:outline focus:outline-gray-400')
                .concat(' ', styles.wrapper)}
        >
            <GoogleIcon
                className={`text-[50px]`.concat(isDirectory || isDrive ? ' text-yellow-300' : '')}
                iconName={isFile ? 'draft' : 'folder'}
            />
            <div>
                <p>{fileName}</p>
                {isFile && (
                    <p className={`text-[var(--secondary-text-dark)] text-[0.8rem]`}>
                        size: <span>{size}</span>
                    </p>
                )}
            </div>
        </button>
    );
}

export default FileButton;
