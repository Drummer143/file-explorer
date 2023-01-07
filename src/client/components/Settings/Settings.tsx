import { useEffect, useState, useRef } from 'react';
import i18n from './../../i18n';

import GoogleIcon from '../GoogleIcon/GoogleIcon';
import LocalizedText from '../LocalizedText/LocalizedText';

function Settings() {
    const [languages] = useState(i18n.languages.concat().sort());
    const [opened, setOpened] = useState(false);
    const [activeSection, setActiveSection] = useState('');
    const [languageNames, setLanguageNames] = useState<Intl.DisplayNames>(new Intl.DisplayNames(i18n.language, { type: 'language' }));

    const settingsRef = useRef<HTMLDivElement>();

    const handleLanguageChange = (language: string) => {
        i18n.changeLanguage(language).then(
            () => {
                setLanguageNames(new Intl.DisplayNames(i18n.language, { type: 'language' }))
            },
            (error) => console.error(error)
        );
    }

    const toggleSection = (section: string) =>
        setActiveSection(prev => prev ? '' : section);

    const handleOuterSettingsClick = (e: MouseEvent) => {
        if (!e.composedPath().includes(settingsRef.current)) {
            toggleSettings();
            document.removeEventListener('click', handleOuterSettingsClick);
        }
    }

    const toggleSettings = () => setOpened(prev => !prev);

    const handleEscapeKeyDown = (e: KeyboardEvent) => {
        if (e.code === 'Escape') { toggleSettings(); }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleEscapeKeyDown);

        return () => {
            document.removeEventListener('keydown', handleEscapeKeyDown);
        }
    }, [])

    useEffect(() => {
        if (opened) {
            document.addEventListener('click', handleOuterSettingsClick);

            return () => {
                document.removeEventListener('click', handleOuterSettingsClick);
            }
        }
    }, [opened])

    return (
        <div ref={settingsRef} className={'absolute z-[100] bottom-0 right-0 transition-transform'
            .concat(opened ? '' : ' translate-x-full')}
        >
            <button
                className={'absolute z-[100] bg-[var(--bg-dark)] top-0 left-0 -translate-x-full transition-transform rounded-2xl outline outline-1'
                    .concat(' transition-[opacity,_outline-color,_background-color] outline-transparent -outline-offset-1 scale-[80%] -translate-y-[10%]')
                    .concat(' focus:outline-white')
                    .concat(' hover:bg-gray-700')
                    .concat(' active:bg-gray-500')}
                onClick={toggleSettings}
            >
                <GoogleIcon
                    className={opened ? 'rotate-180' : ''}
                    iconName='arrow_left'
                    size={40}
                />
            </button>

            <div className='bg-[var(--menu-dark)] p-2 rounded-tl-md'>
                <div className='text-center'>
                    <p><LocalizedText i18key='settings' /></p>

                    <button
                        className={'py-0.5 px-2 rounded transition-[background-color] mt-2 w-full'
                            .concat(' outline -outline-offset-2 outline-2 outline-transparent')
                            .concat(' ', activeSection === 'language' ? 'bg-gray-800' : 'bg-[var(--top-grey-dark)]')
                            .concat(' hover:bg-gray-700')
                            .concat(' active:bg-gray-800')}
                        onClick={() => toggleSection('language')}
                    >
                        <LocalizedText i18key='language' />
                    </button>

                    <div className={'mt-1 grid gap-1 overflow-hidden transition-[max-height]'
                        .concat(' ', activeSection === 'language' ? 'max-h-screen' : 'max-h-0')}
                    >
                        {languages.map(language => (
                            <button
                                disabled={i18n.language === language}
                                className={'py-0.5 px-2 bg-[var(--bottom-grey-dark)] cursor-pointer rounded transition-[margin,_background-color,_color]'
                                    .concat(' ', i18n.language === language ? 'ml-6 bg-gray-900 text-gray-300' : 'ml-3 mr-3')}
                                key={language}
                                onClick={() => handleLanguageChange(language)}
                            >{languageNames.of(language)}</button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Settings;