import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: ['en', 'ru'],
        interpolation: {
            escapeValue: false
        },
        resources: {
            en: {
                translation: {
                    enterFileName: 'Enter file name',
                    enterFolderName: 'Enter folder name',
                    create: 'Create',
                    newFolder: 'New folder',
                    newFile: 'New file',
                    settings: 'Settings',
                    language: 'Language',
                    title: 'File Explorer',
                    explorerErrors: {
                        invalidPath: "Can't find !<path!<. Check correctness of the path",
                        onOpenFile: "Can't open file",
                        onGetInfo: "Can't get information about file",
                    },
                    ctx: {
                        buttons: {
                            open: 'Open',
                            delete: 'Delete',
                            rename: 'Rename',
                            createFolder: 'Create folder',
                            createFile: 'Create file',
                            openInExplorer: 'Open in Windows explorer',
                            appearance: 'Appearance'
                        },
                        sections: {
                            drive: 'drive',
                            folder: 'folder',
                            file: 'file',
                            explorer: 'explorer'
                        }
                    },
                    windowControlButtons: {
                        minimize: 'Minimize',
                        restoreToWindow: 'Restore to window',
                        maximize: 'Maximize',
                        close: 'Close'
                    }
                }
            },
            ru: {
                translation: {
                    enterFileName: 'Введите имя файла',
                    enterFolderName: 'Введите имя папки',
                    create: 'Создать',
                    newFolder: 'Новая папка',
                    newFile: 'Новый файл',
                    settings: 'Настройки',
                    language: 'Язык',
                    title: 'Проводник',
                    explorerErrors: {
                        invalidPath: "Не удаётся найти !<path>. Проверьте правильность указанного пути",
                        onOpenFile: 'Не удалось открыть файл',
                        onGetInfo: 'Не удалось получить информацию о файле',
                    },
                    ctx: {
                        buttons: {
                            open: 'Открыть',
                            delete: 'Удалить',
                            rename: 'Переименовать',
                            createFolder: 'Создать папку',
                            createFile: 'Создать файл',
                            openInExplorer: 'Открыть в проводнике Windows',
                            appearance: 'Вид'
                        },
                        sections: {
                            drive: 'диск',
                            folder: 'папка',
                            file: 'файл',
                            explorer: 'проводник'
                        }
                    },
                    windowControlButtons: {
                        minimize: 'Свернуть',
                        restoreToWindow: 'Свернуть в окно',
                        maximize: 'Развернуть',
                        close: 'Закрыть'
                    }
                }
            }
        }
    })

export default i18n;