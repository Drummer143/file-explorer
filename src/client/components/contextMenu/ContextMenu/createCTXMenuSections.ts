import { useTranslation } from "react-i18next";

import { useCMCStore } from '../../../stores/CMCStore';
import { useHistoryStore } from '../../../stores/historyStore';

export default function createCTXMenuSections(): MenuSections {
    const { setCurrentEditingFile, setModal } = useCMCStore(state => state);
    const { pushRoute, currentPath } = useHistoryStore(state => state);
    const { t } = useTranslation();

    return {
        drive: [
            {
                name: t('ctx.buttons.open'),
                onClick: info => pushRoute(info),
                type: 'action'
            },
            {
                name: t('ctx.buttons.openInExplorer'),
                onClick: info => window.electronAPI.openInExplorer(info),
                type: 'action'
            }
        ],
        file: [
            {
                name: t('ctx.buttons.open'),
                onClick: info => window.electronAPI.openFile(`${currentPath}\\${info}`),
                type: 'action'
            },
            {
                name: t('ctx.buttons.delete'),
                onClick: info => window.electronAPI.deleteFile(`${currentPath}\\${info}`),
                type: 'action'
            },
            {
                name: t('ctx.buttons.rename'),
                onClick: (info) => setCurrentEditingFile(info),
                type: 'action'
            }
        ],
        folder: [
            {
                name: t('ctx.buttons.open'),
                onClick: info => {
                    const path = `${currentPath}\\${info}`;
                    pushRoute(path);
                },
                type: 'action'
            },
            {
                name: t('ctx.buttons.delete'),
                onClick: info => window.electronAPI.deleteFile(`${currentPath}\\${info}`),
                type: 'action'
            },
            {
                name: t('ctx.buttons.rename'),
                onClick: (info) => setCurrentEditingFile(info),
                type: 'action'
            },
            {
                name: t('ctx.buttons.openInExplorer'),
                onClick: info => window.electronAPI.openInExplorer(`${currentPath}\\${info}`),
                type: 'action'
            }
        ],
        explorer: [
            {
                type: 'section',
                name: t('ctx.buttons.appearance'),
                children: [
                    {
                        type: 'action',
                        name: 'list',
                        onClick: () => console.log('table'),
                    },
                    {
                        type: 'action',
                        name: 'grid',
                        onClick: () => console.log('grid')
                    }
                ]
            },
            {
                name: t('ctx.buttons.createFolder'),
                onClick: () => setModal({
                    name: 'fileCreating',
                    data: {
                        path: currentPath,
                        type: 'folder'
                    }
                }),
                type: 'action'
            },
            {
                name: t('ctx.buttons.createFile'),
                onClick: () => setModal({
                    name: 'fileCreating',
                    data: {
                        path: currentPath,
                        type: 'file'
                    }
                }),
                type: 'action'
            },
            {
                name: t('ctx.buttons.openInExplorer'),
                onClick: () => window.electronAPI.openInExplorer(currentPath),
                type: 'action'
            }
        ]
    };
}