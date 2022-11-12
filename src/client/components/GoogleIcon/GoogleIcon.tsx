import './GoogleIcon.scss';

type IconParams = {
    fill?: number
    weight?: number
    grade?: number
    opticalSize?: number
}

type Props = {
    iconName: string
    iconParams?: IconParams
    className?: string
}

function GoogleIcon ({ iconName, className, iconParams = { fill: 1, grade: 0, opticalSize: 48, weight: 400 } }: Props) {
    return <span
                className={`material-symbols-outlined${className ? ` ${className}` : ''}`}
                // style={{ fontVariationSettings: `"FILL" ${iconParams.fill}, "wght" ${iconParams.weight}, "GRAD" ${iconParams.grade}, "opsz" ${iconParams.opticalSize}` }}
            >{iconName}</span>
}

export default GoogleIcon;