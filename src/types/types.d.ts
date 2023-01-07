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