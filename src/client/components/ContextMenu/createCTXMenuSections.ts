import { useTranslation } from "react-i18next";

import { useCMCStore } from '../../stores/CMCStore';
import { useHistoryStore } from '../../stores/historyStore';

export default function createCTXMenuSections(): MenuSections {
    const { setCurrentEditingFile, setModal } = useCMCStore(state => state);
    const { pushRoute, currentPath } = useHistoryStore(state => state);
    const { t } = useTranslation();

    return {
        drive: [
            { name: t('ctx.buttons.open'), onClick: info => pushRoute(info) },
            { name: t('ctx.buttons.openInExplorer'), onClick: info => window.electronAPI.openInExplorer(info) }

        ],
        file: [
            { name: t('ctx.buttons.open'), onClick: info => window.electronAPI.openFile(`${currentPath}\\${info}`) },
            { name: t('ctx.buttons.delete'), onClick: info => window.electronAPI.deleteFile(`${currentPath}\\${info}`) },
            { name: t('ctx.buttons.rename'), onClick: (info) => setCurrentEditingFile(info) }
        ],
        folder: [
            {
                name: t('ctx.buttons.open'),
                onClick: info => {
                    const path = `${currentPath}\\${info}`;
                    pushRoute(path);
                }
            },
            { name: t('ctx.buttons.delete'), onClick: info => window.electronAPI.deleteFile(`${currentPath}\\${info}`) },
            { name: t('ctx.buttons.rename'), onClick: (info) => setCurrentEditingFile(info) },
            { name: t('ctx.buttons.openInExplorer'), onClick: info => window.electronAPI.openInExplorer(`${currentPath}\\${info}`) }
        ],
        explorer: [
            {
                name: t('ctx.buttons.createFolder'),
                onClick: () => setModal({
                    name: 'fileCreating',
                    data: {
                        path: currentPath,
                        type: 'folder'
                    }
                })
            },
            {
                name: t('ctx.buttons.createFile'),
                onClick: () => setModal({
                    name: 'fileCreating',
                    data: {
                        path: currentPath,
                        type: 'file'
                    }
                })
            },
            { name: t('ctx.buttons.openInExplorer'), onClick: () => window.electronAPI.openInExplorer(currentPath) }
        ]
    };
}