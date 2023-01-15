type FileInfo = {
    fileName: string;
    size: number;
};

type CDrive = FileInfo & {
    isDrive: boolean;

    isDirectory?: never;
    isFile?: never;
};

type CFile = FileInfo & {
    isFile: boolean;
    type: string;

    isDirectory?: never;
    isDrive?: never;
};

type CDirectory = FileInfo & {
    isDirectory: boolean;

    isFile?: never;
    isDrive?: never;
};

type CustomFile = CDirectory | CFile | CDrive;

type UpdatedFiles = {
    delete: string[];
    update: CustomFile[];
    create: CustomFile[];
};

type FileCreatingModalParams = {
    type: 'file' | 'folder'
    path: string
}

type PopupInfo = {
    type: ErrorType
    message: string
    id: string
}

type ElectronErrorType = 'error' | 'warning' | 'info';

type ElectronErrorKind = 'invalidPath' | 'onOpenFile' | 'onGetInfo'

type ElectronErrorAdditionalData = Partial<{
    path: string
}>

type ContextMenuProps = {
    shouldDisplay: boolean;
    x: string;
    y: string;
};

type SectionProps = {
    name: string;
    onClick: (info?: string) => void;
};

type MenuSections = {
    [key: string]: SectionProps[];
};