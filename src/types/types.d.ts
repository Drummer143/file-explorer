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

type ActionFieldProps = {
    name: string;
    onClick: (info?: string) => void;
    type: 'action'
}

type SubsectionFieldProps = {
    type: 'section'
    name: string,
    children: ActionFieldProps[]
}

type MenuSections = {
    [key: string]: (SubsectionFieldProps | ActionFieldProps)[];
};