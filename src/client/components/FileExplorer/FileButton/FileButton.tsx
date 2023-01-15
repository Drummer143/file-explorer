import { useState, useEffect, KeyboardEvent, FormEvent } from 'react';
import xbytes from 'xbytes';

import { useCMCStore } from '../../../stores/CMCStore';
import { useHistoryStore } from '../../../stores/historyStore';
import GoogleIcon from '../../GoogleIcon/GoogleIcon';

type Props = {
    file: CustomFile;

    onDoubleClick: () => void;
};

function FileButton({ file, onDoubleClick }: Props) {
    const { currentPath } = useHistoryStore(state => state)
    const { currentEditingFile, setCurrentEditingFile } = useCMCStore(state => state)

    const [ctx, setCtx] = useState('');
    const [filenameInput, setFilenameInput] = useState('');

    const { isFile, size, fileName: name, isDirectory, isDrive } = file;

    const handleRenameFile = () => {
        if (filenameInput && name !== filenameInput) {
            window.electronAPI.renameFile(`${currentPath}\\${name}`, `${currentPath}\\${filenameInput}`)
        }

        setCurrentEditingFile(undefined);
    }

    const handleRenameFileSubmit = () => (e: FormEvent) => {
        e.preventDefault();
        if (filenameInput) {
            handleRenameFile();
        }
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
        switch (e.code) {
            case 'Enter':
                if (currentEditingFile !== file.fileName) {
                    onDoubleClick();
                }
                break;
        }
    }

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
            data-info={name}
            onDoubleClick={onDoubleClick}
            onKeyDown={handleKeyDown}
            onClick={e => (e.target as HTMLElement).focus()}
            className={'flex cursor-pointer items-center flex-row px-3 py-2 rounded-lg bg-[var(--top-grey-dark)]'
                .concat(' gap-x-2 gap-y-1 transition-[background-color] -outline-offset-1 outline-1')
                .concat(' hover:bg-[var(--bottom-grey-dark)]')
                .concat(' active:bg-[var(--bg-dark)]')
                .concat(' focus:outline focus:outline-gray-400')}
        >
            {file.isFile && file.type === 'image' ?
                <img
                    width={50}
                    height={50}
                    src={`${currentPath}/${file.fileName}`}
                    alt={file.fileName}
                    className={'max-w-[50px] max-h-[50px]'}

                />
                :
                <GoogleIcon
                    className={`text-[50px]`.concat(isDirectory || isDrive ? ' text-yellow-300' : '')}
                    iconName={isFile ? 'draft' : 'folder'}
                />
            }

            <form onSubmit={handleRenameFileSubmit}>
                {currentEditingFile !== name ?
                    <p>{name}</p>
                    :
                    <input
                        required
                        ref={ref => ref?.focus()}
                        value={filenameInput}
                        onInvalid={e => e.preventDefault()}
                        onFocus={() => setFilenameInput(currentEditingFile)}
                        onBlur={handleRenameFile}
                        onChange={e => setFilenameInput(e.target.value)}
                        className={'block bg-white text-black rounded-lg px-2 outline outline-1 outline-transparent transition-[outline-color,_background-color]'
                            .concat(' invalid:outline-red-400 invalid:bg-red-100')}
                    />
                }

                {isFile && (
                    <p className={`text-[var(--secondary-text-dark)] text-[0.8rem]`}>{xbytes(size)}</p>
                )}
            </form>
        </button>
    );
}

export default FileButton;
