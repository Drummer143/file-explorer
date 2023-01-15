import { useState, useEffect } from 'react';
import xbytes from 'xbytes';

import { useCMCStore } from '../../../stores/CMCStore';
import { useHistoryStore } from '../../../stores/historyStore';
import GoogleIcon from '../../GoogleIcon/GoogleIcon';

import styles from './FileButton.module.scss';

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
        if (name !== filenameInput) {
            window.electronAPI.renameFile(`${currentPath}\\${name}`, `${currentPath}\\${filenameInput}`)
        }

        setCurrentEditingFile(undefined);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        switch (e.code) {
            case 'Enter':
                handleRenameFile();
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
            onClick={e => (e.target as HTMLElement).focus()}
            className={'flex cursor-pointer items-center flex-row px-3 py-2 rounded-lg bg-[var(--top-grey-dark)]'
                .concat(' gap-x-2 gap-y-1 transition-[background-color] -outline-offset-1 outline-1')
                .concat(' hover:bg-[var(--bottom-grey-dark)]')
                .concat(' active:bg-[var(--bg-dark)]')
                .concat(' focus:outline focus:outline-gray-400')
                .concat(' ', styles.wrapper)}
        >
            {file.isFile && file.type === 'image' ?
                <img width={50} height={50} src={`${currentPath}/${file.fileName}`} alt={file.fileName} />
                :
                <GoogleIcon
                    className={`text-[50px]`.concat(isDirectory || isDrive ? ' text-yellow-300' : '')}
                    iconName={isFile ? 'draft' : 'folder'}
                />
            }

            <div>
                {currentEditingFile !== name ?
                    <p>{name}</p>
                    :
                    <input
                        ref={ref => ref?.focus()}
                        className='block bg-white text-black rounded-lg px-2'
                        value={filenameInput}
                        onFocus={() => setFilenameInput(currentEditingFile)}
                        onBlur={handleRenameFile}
                        onKeyDown={handleKeyDown}
                        onChange={e => setFilenameInput(e.target.value)}
                    />
                }
                {isFile && (
                    <p className={`text-[var(--secondary-text-dark)] text-[0.8rem]`}>{xbytes(size)}</p>
                )}
            </div>
        </button>
    );
}

export default FileButton;
