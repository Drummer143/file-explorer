import { useTranslation } from 'react-i18next';
import { FormEvent, useState } from 'react';
import { useCMCStore } from '../../../stores/CMCStore';

function FileCreatingModal({ path, type }: FileCreatingModalParams) {
    const { t } = useTranslation();
    const { setModal } = useCMCStore();

    // const [pathInput, setPathInput] = useState(path);
    const [filenameInput, setFilenameInput] = useState(t(type === 'file' ? 'newFile' : 'newFolder'));

    const handleCreateFolder = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (type === 'file') {
            window.electronAPI.createFile(`${path}/${filenameInput}`);
        } else {
            window.electronAPI.createFolder(`${path}/${filenameInput}`);
        }
        setModal();
    }

    return (
        <form onSubmit={handleCreateFolder} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(0,_0,_0,_0.85)] rounded-lg p-4 grid gap-2">
            {/* <input
                    className={'bg-[var(--bottom-grey-dark)] px-1 py-0.5 rounded'}
                    value={pathInput}
                    onChange={e => setPathInput(e.target.value)}
                /> */}

            <p className='text-center'>{t(type === 'file' ? 'enterFileName' : 'enterFolderName')}:</p>

            <input
                ref={ref => ref?.focus()}
                className={'bg-[var(--top-grey-dark)] px-1 py-0.5 rounded'}
                value={filenameInput}
                onChange={e => setFilenameInput(e.target.value)}
            />

            <button
                className={'bg-green-800 w-fit rounded justify-self-center px-2 transition-[background-color]'
                    .concat(' hover:bg-green-700')
                    .concat(' active:bg-green-900')}
                type='submit'
            >{t('create')}</button>
        </form>
    )
}

export default FileCreatingModal;