import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: true,
        fallbackLng: ['en', 'ru'],
        interpolation: {
            escapeValue: false
        },
        resources: {
            en: {
                translation: {
                    settings: 'Settings',
                    language: 'Language',
                    title: 'File Explorer',
                    ctx: {
                        buttons: {
                            open: 'Open',
                            delete: 'Delete',
                            rename: 'Rename'
                        },
                        sections: {
                            drive: 'drive',
                            folder: 'folder',
                            file: 'file'
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
                    settings: 'Настройки',
                    language: 'Язык',
                    title: 'Проводник',
                    ctx: {
                        buttons: {
                            open: 'Открыть',
                            delete: 'Удалить',
                            rename: 'Переименовать'
                        },
                        sections: {
                            drive: 'диск',
                            folder: 'папка',
                            file: 'файл'
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