import { useEffect, useRef, useState } from 'react';

import GoogleIcon from '../../GoogleIcon/GoogleIcon';
import CTXActionField from './../CTXActionField/CTXActionField';

import styles from './CTXSubSection.module.scss';

type Props = {
    sectionInfo: SubsectionFieldProps
    handleActionFieldClick: Function
}

export default function CTXSubSection({ sectionInfo, handleActionFieldClick }: Props) {
    const [shouldShowSubsection, setShouldShowSubsection] = useState(false);
    const [side, setSide] = useState<'left' | 'right'>();

    const subSectionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!shouldShowSubsection) {
            setSide(null);
            return;
        }

        const rect = subSectionRef.current.getBoundingClientRect()
        if (rect.right + subSectionRef.current.parentElement.clientWidth > window.innerWidth) {
            setSide('left');
        } else {
            setSide('right');
        }
    }, [shouldShowSubsection])

    return (
        <div
            onMouseEnter={() => setShouldShowSubsection(true)}
            onMouseLeave={() => {
                setSide(null);
                setShouldShowSubsection(false);
            }}
            className={'relative px-2 w-full py-1 text-start transition-[background-color] cursor-pointer rounded'
                .concat(' flex justify-between items-center flex-row')
                .concat(' hover:bg-[var(--top-grey-dark)]')}
        >
            {sectionInfo.name}

            <GoogleIcon iconName='arrow_right' size={21} className='inline' />

            <div
                ref={subSectionRef}
                className={'absolute top-0 z-[101] border-solid border border-[var(--top-grey-dark)]'
                    .concat(side === 'right' ? ' right-0 translate-x-full' : '')
                    .concat(side === 'left' ? ' left-0 -translate-x-full' : '')
                    .concat(shouldShowSubsection && side ? '' : ' pointer-events-none opacity-0 invisible')
                    .concat(' ', side === 'right' ? `rounded-r-md ${styles.noLeftShadow}` : 'rounded-l-md')
                    .concat(' ', styles.wrapper)}
            >
                {sectionInfo.children.map(section => (
                    <CTXActionField
                        key={section.name}
                        onClick={() => handleActionFieldClick(section.onClick)}
                        sectionInfo={section}
                    />
                ))}
            </div>
        </div>
    )
}