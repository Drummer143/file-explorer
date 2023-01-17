type Props = {
    sectionInfo: ActionFieldProps

    className?: string

    onClick?: Function
}

export default function CTXActionField({ sectionInfo, onClick, className = '' }: Props) {
    return (
        <div
            key={sectionInfo.name}
            onClick={() => onClick ? onClick() : sectionInfo.onClick()}
            className={'px-2 w-full py-1 text-start transition-[background-color] cursor-pointer rounded'
                .concat(' hover:bg-[var(--top-grey-dark)]')
                .concat(' active:bg-[var(--bottom-grey-dark)]')}
        >
            {sectionInfo.name}
        </div>
    )
}