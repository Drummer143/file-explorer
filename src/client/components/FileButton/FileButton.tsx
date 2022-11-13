import GoogleIcon from '../GoogleIcon/GoogleIcon';

import styles from './FileButton.module.scss';

type Props = {
    file: CustomFile;

    onClick: React.MouseEventHandler<HTMLDivElement>;
};

function FileButton({ file, onClick }: Props) {
    const { isFile, size, fileName, isDirectory } = file;

    return (
        <div
            onClick={onClick}
            className={`flex cursor-pointer items-center flex-row px-3 py-2 rounded-lg bg-[var(--top-grey-dark)] gap-x-2 gap-y-1 transition hover:bg-[var(--bottom-grey-dark)] active:bg-[var(--bg-dark)] ${styles.wrapper}`}
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
        </div>
    );
}

export default FileButton;
