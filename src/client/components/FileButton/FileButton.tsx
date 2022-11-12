type Props = {
    file: CustomFile

    onClick: React.MouseEventHandler<HTMLDivElement>
}

function FileButton({ file, onClick }: Props) {
    const { isFile, size, fileName } = file;

    return (
        <div onClick={onClick} className={`flex justify-center items-center cursor-pointer flex-col px-3 py-2 rounded-lg bg-[var(--top-grey-dark)]`}>
            <p>{fileName}</p>
            {isFile && <p>size: <span>{size}</span></p>}
        </div>
    );
}

export default FileButton;