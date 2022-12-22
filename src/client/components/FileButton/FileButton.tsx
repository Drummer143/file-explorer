import { useRef, useState, useEffect } from 'react';

import GoogleIcon from '../GoogleIcon/GoogleIcon';

import styles from './FileButton.module.scss';

type Props = {
    file: CustomFile;

    onClick: React.MouseEventHandler<HTMLButtonElement>;
};

function FileButton({ file, onClick }: Props) {
    const { isFile, size, fileName, isDirectory } = file;
    // const buttonRef = useRef();
    const [ctx, setCtx] = useState('');

    useEffect(() => {
        if (isFile) {
            setCtx('file');
        } else if (isDirectory) {
            setCtx('folder');
        }
    }, []);

    return (
        <button
            // ref={buttonRef}
            data-ctx={ctx}
            data-info={fileName}
            onDoubleClick={onClick}
            onClick={e => (e.target as HTMLElement).focus()}
            className={'flex cursor-pointer items-center flex-row px-3 py-2 rounded-lg bg-[var(--top-grey-dark)] gap-x-2 gap-y-1 transition-[background-color] -outline-offset-1 outline-1'
                .concat(' hover:bg-[var(--bottom-grey-dark)]')
                .concat(' active:bg-[var(--bg-dark)]')
                .concat(' focus:outline focus:outline-gray-400')
                .concat(' ', styles.wrapper)
            }
        >
            <GoogleIcon
                className={`text-[50px] ${isDirectory && 'text-yellow-300'}`}
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
