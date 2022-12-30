import React, { useEffect, useRef, useState } from 'react';

import styles from './ContextMenu.module.scss';
import { useHistoryStore } from '../../stores/explorerStores';

type ContextMenuProps = {
    shouldDisplay: boolean;
    x: string;
    y: string;
};

const defaultMenuParams = { shouldDisplay: false, y: '200vh', x: '200vw' };

type SectionProps = {
    name: string;
    onClick: (info?: string) => void;
};

type MenuSections = {
    [key: string]: SectionProps[];
};

function ContextMenu() {
    const { pushRoute, currentPath } = useHistoryStore(state => state);

    const [currentMenuSections] = useState<{ section: string; info: string }[]>([]);
    const [contextMenuParams, setContextMenuParams] = useState<ContextMenuProps>(defaultMenuParams);

    const ctxRef = useRef<HTMLDivElement>(null);

    const menuSections: MenuSections = {
        drive: [
            {
                name: 'Open',
                onClick: info => {
                    const path = currentPath ? `${currentPath}/${info}` : info;
                    pushRoute(path);
                    window.electronAPI.readDirectory(path);
                }
            }
        ],
        file: [
            {
                name: 'Open',
                onClick: (info: string) => window.electronAPI.openFile(`${currentPath}/${info}`)
            },
            {
                name: 'Delete',
                onClick: info => window.electronAPI.deleteFile(`${currentPath}/${info}`)
            }
        ],
        folder: [
            {
                name: 'Open',
                onClick: info => {
                    const path = currentPath ? `${currentPath}/${info}` : info;
                    pushRoute(path);
                    window.electronAPI.readDirectory(path);
                }
            },
            {
                name: 'Delete',
                onClick: info => window.electronAPI.deleteFile(`${currentPath}/${info}`)
            }
        ]
    };

    const handleHideContextMenu = (e: MouseEvent) => {
        if (e.button !== 2 && !e.composedPath().includes(ctxRef.current)) {
            setContextMenuParams(defaultMenuParams);

            document.removeEventListener('click', handleHideContextMenu);
        }
    };

    const handleClick = (onClick: () => void) => {
        onClick();

        setContextMenuParams(defaultMenuParams);
    };

    const handleOpenContextMenu = (e: MouseEvent) => {
        if (e.button === 2) {
            currentMenuSections.length = 0;
            const path = e.composedPath();
            path.forEach(node => {
                if (
                    (node as HTMLElement)?.dataset?.ctx &&
                    menuSections[(node as HTMLElement)?.dataset?.ctx]
                ) {
                    currentMenuSections.push({
                        section: (node as HTMLElement).dataset.ctx,
                        info: (node as HTMLElement).dataset.info
                    });
                }
            });

            if (currentMenuSections.length > 0) {
                setContextMenuParams({
                    shouldDisplay: true,
                    x: `${e.clientX + 15}px`,
                    y: `${e.clientY + 25}px`
                });

                document.addEventListener('click', handleHideContextMenu);
            } else {
                setContextMenuParams(defaultMenuParams);
            }
        }
    };

    const isElementInViewport = (el: HTMLElement) => {
        const rect = el.getBoundingClientRect();
        const isOverDisplay = {
            // top: rect.top >= 0,
            // left: rect.left >= 0,
            bottom: rect.bottom <= (window.innerHeight || document.documentElement.clientHeight),
            right: rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        };
        return isOverDisplay;
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleOpenContextMenu);

        return () => {
            document.removeEventListener('mousedown', handleOpenContextMenu);
        };
    }, []);

    useEffect(() => {
        if (contextMenuParams.shouldDisplay) {
            const isOverDisplay = isElementInViewport(ctxRef.current);
            const newCoordinates = { x: contextMenuParams.x, y: contextMenuParams.y };

            if (!isOverDisplay.right) {
                newCoordinates.x =
                    +newCoordinates.x.replace('px', '') - ctxRef.current.clientWidth - 30 + 'px';
            }
            if (!isOverDisplay.bottom) {
                newCoordinates.y =
                    +newCoordinates.y.replace('px', '') - ctxRef.current.clientHeight - 50 + 'px';
            }
            if (
                newCoordinates.x !== contextMenuParams.x ||
                newCoordinates.y !== contextMenuParams.y
            ) {
                setContextMenuParams({ shouldDisplay: true, ...newCoordinates });
            }
        }
    }, [contextMenuParams]);

    return (
        <div
            ref={ctxRef}
            className={'transition-opacity bg-[var(--menu-dark)] min-w-[150px] border border-[var(--top-grey-dark)] p-1 border-solid absolute z-[100]'
                .concat(
                    !contextMenuParams.shouldDisplay
                        ? ' opacity-0 top-[200vh] left-[200vw] pointer-events-none hidden'
                        : ''
                )
                .concat(' ', styles.wrapper)}
            style={{ top: contextMenuParams.y, left: contextMenuParams.x }}
        >
            {contextMenuParams.shouldDisplay &&
                currentMenuSections.map(({ section, info }, i) => {
                    return (
                        <fieldset
                            className={`border-0 border-t border-t-[var(--secondary-text-dark)] border-solid leading-none`}
                            key={section}
                        >
                            <legend className={`text-xs relative ${styles.heading}`}>
                                {section}
                            </legend>

                            <div
                                className={'flex flex-col items-start gap-2 pl-2'.concat(
                                    ' ',
                                    i === currentMenuSections.length - 1 ? 'mt-1' : 'my-1'
                                )}
                            >
                                {menuSections[section].map(({ onClick, name }) => (
                                    <button
                                        key={name}
                                        onClick={() => handleClick(() => onClick(info))}
                                    >
                                        {name}
                                    </button>
                                ))}
                            </div>
                        </fieldset>
                    );
                })}
        </div>
    );
}

export default ContextMenu;
