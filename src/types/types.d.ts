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

type ErrorType = 'error' | 'warning' | 'info';

type PopupInfo = {
    type: ErrorType
    message: string
    id: string
}

type ElectronErrorKind = 'invalidPath' | 'onOpenFile' | 'onGetInfo'
