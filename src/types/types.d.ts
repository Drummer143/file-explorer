type CustomFile = {
    fileName: string;
    isFile: boolean;
    isDirectory: boolean;
    size: number;
};

type UpdatedFiles = {
    delete: string[]
    update: CustomFile[]
    create: CustomFile[]
}
