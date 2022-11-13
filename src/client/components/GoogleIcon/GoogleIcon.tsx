import './GoogleIcon.scss';

type IconParams = {
    fill?: number;
    weight?: number;
    grade?: number;
    opticalSize?: number;
};

//               ccs     html     folder     file      minimize     close     fullscreen     fullscreen exit
type IconName =
    | 'css'
    | 'html'
    | 'folder'
    | 'draft'
    | 'minimize'
    | 'close'
    | 'fullscreen'
    | 'fullscreen_exit';

type Props = {
    iconName: IconName;
    size?: number;
    iconParams?: IconParams;
    className?: string;
};

function GoogleIcon({
    iconName,
    className,
    size,
    iconParams = { fill: 1, grade: 0, opticalSize: 48, weight: 400 }
}: Props) {
    return (
        <span
            style={size ? { fontSize: size } : null}
            className={`aspect-square material-symbols-outlined${className ? ` ${className}` : ''}`}
            // style={{ fontVariationSettings: `"FILL" ${iconParams.fill}, "wght" ${iconParams.weight}, "GRAD" ${iconParams.grade}, "opsz" ${iconParams.opticalSize}` }}
        >
            {iconName}
        </span>
    );
}

export default GoogleIcon;
