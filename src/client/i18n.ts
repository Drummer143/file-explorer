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
                    }
                }
            },
            ru: {
                translation: {
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
                    }
                }
            }
        }
    })

export default i18n;