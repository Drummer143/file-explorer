import { useEffect, useRef, useState } from 'react';

import LocalizedText from '../LocalizedText/LocalizedText';
import createCTXMenuSections from './createCTXMenuSections';

import styles from './ContextMenu.module.scss';

const defaultMenuParams = { shouldDisplay: false, y: '200vh', x: '200vw' };

function ContextMenu() {
    const [currentMenuSections] = useState<{ section: string; info: string }[]>([]);
    const [contextMenuParams, setContextMenuParams] = useState<ContextMenuProps>(defaultMenuParams);

    const ctxRef = useRef<HTMLDivElement>(null);

    const menuSections: MenuSections = createCTXMenuSections();

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
            const path = e.composedPath() as HTMLElement[];
            path.forEach(node => {
                if (node?.dataset?.ctx && menuSections[node?.dataset?.ctx]
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
            className={'transition-opacity bg-[var(--menu-dark)] min-w-[150px] border border-[var(--top-grey-dark)] p-1 border-solid absolute z-[100] rounded-md'
                .concat(!contextMenuParams.shouldDisplay ? ' opacity-0 top-[200vh] left-[200vw] pointer-events-none hidden' : '')
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
                                <LocalizedText i18key={`ctx.sections.${section}`} />
                            </legend>

                            <div
                                className={'flex flex-col items-start gap-0.5 transition-[background-color]'
                                    .concat(' ', i === currentMenuSections.length - 1 ? 'mt-1' : 'my-1')}
                            >
                                {menuSections[section].map(({ onClick, name }, i) => (
                                    <div
                                        className={'pl-2 w-full py-1 text-start transition-[background-color] cursor-pointer rounded'
                                            .concat(' hover:bg-[var(--top-grey-dark)]')
                                            .concat(' active:bg-[var(--bottom-grey-dark)]')}
                                        key={i}
                                        onClick={() => handleClick(() => onClick(info))}
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </fieldset>
                    );
                })}
        </div>
    );
}

export default ContextMenu;
