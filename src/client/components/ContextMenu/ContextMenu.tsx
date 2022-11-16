import React, { useEffect, useRef, useState } from "react";

import styles from './ContextMenu.module.scss';
import { useHistoryStore, usePathStore } from '../../zustand/explorerStore';

type ContextMenuProps = {
    shouldDisplay: boolean
    x: string
    y: string
}

const defaultMenuParams = { shouldDisplay: false, y: '200vh', x: '200vw' };

type MenuSections = {
    [key: string]: {
        name: string,
        onClick: any
    }[]
}

function ContextMenu() {
    const { path: prevPath, updatePath } = usePathStore(state => state);
    const { pushPath } = useHistoryStore(state => state);

    const [currentMenuSections] = useState<{ section: string, info: string }[]>([]);
    const [contextMenuParams, setContextMenuParams] = useState<ContextMenuProps>(defaultMenuParams);

    const ctxRef = useRef<HTMLDivElement>(null);

    const menuSections: MenuSections = {
        file: [
            {
                name: 'Open',
                onClick: (info: string) => {
                    console.log(`${prevPath}/${info}`)

                    setContextMenuParams(defaultMenuParams);
                }
            }
        ],
        folder: [
            {
                name: 'Open',
                onClick: (info: string) => {
                    let path = '';
                    if (prevPath) {
                        path = `${prevPath}/${info}`
                    } else {
                        path = info;
                    }


                    pushPath(prevPath);
                    window.electronAPI.readDirectory(path);
                    updatePath(path);

                    setContextMenuParams(defaultMenuParams);
                }
            }
        ]
    }

    const handleHideContextMenu = (e: MouseEvent) => {
        if (e.button !== 2 && !e.composedPath().includes(ctxRef.current)) {
            setContextMenuParams(defaultMenuParams);

            document.removeEventListener('click', handleHideContextMenu);
        }
    }

    const handleRightMouseButtonClick = (e: MouseEvent) => {
        if (e.button === 2) {
            currentMenuSections.length = 0;
            const path = e.composedPath();
            path.forEach(node => {
                if ((node as HTMLElement)?.dataset?.ctx && menuSections[(node as HTMLElement)?.dataset?.ctx]) {
                    currentMenuSections.push({ section: (node as HTMLElement).dataset.ctx, info: (node as HTMLElement).dataset.info });
                }
            })
            currentMenuSections.sort();

            if (currentMenuSections.length > 0) {
                setContextMenuParams({ shouldDisplay: true, x: `${e.clientX}px`, y: `${e.clientY}px` });

                document.addEventListener('click', handleHideContextMenu);
            } else {
                setContextMenuParams(defaultMenuParams);
            }
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleRightMouseButtonClick);

        return () => {
            document.removeEventListener('mousedown', handleRightMouseButtonClick);
        }
    })

    return (
        <div
            ref={ctxRef}
            className={`${!contextMenuParams.shouldDisplay && 'opacity-0 top-[200vh] left-[200vw]'} bg-[var(--menu-dark)] min-w-[150px] border border-[var(--top-grey-dark)] px-1 pb-2 pt-3 border-solid absolute z-[100]`}
            style={{ top: contextMenuParams.y, left: contextMenuParams.x }}
        >
            {contextMenuParams.shouldDisplay && currentMenuSections.map(({ section, info }, i) => {
                return (
                    <div className={`relative border-0 border-t border-t-[var(--secondary-text-dark)] border-solid leading-none`} key={section}>
                        <div className={`absolute drop-shadow-sm left-[2px] top-[-10px] px-1 text-xs bg-[var(--menu-dark)] ${styles.heading}`}>{section}</div>
                        <div className={`${i === currentMenuSections.length - 1 ? 'mt-3' : 'my-3'}`}>{menuSections[section].map(({ onClick, name }) => <button key={name} onClick={() => onClick(info)}>{name}</button>)}</div>
                    </div>
                )
            })}
        </div>
    )
}

export default ContextMenu;