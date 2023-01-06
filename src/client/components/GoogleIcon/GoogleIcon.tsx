import React from 'react';

import './GoogleIcon.scss';

type IconParams = {
    fill?: number;
    weight?: number;
    grade?: number;
    opticalSize?: number;
};

type IconName =
    | 'css' // ccs
    | 'html' // html
    | 'folder' // folder
    | 'draft' // file
    | 'minimize' // minimize
    | 'close' // close
    | 'fullscreen' // fullscreen
    | 'fullscreen_exit' // fullscreen exit
    | 'arrow_back' // arrow back
    | 'arrow_forward' // arrow forward
    | 'arrow_right' // arrow right
    | 'arrow_left' // arrow left

type Props = {
    iconName: IconName;

    size?: number;
    className?: string;

    onClick?: (e: React.MouseEvent) => void
};

function GoogleIcon({
    iconName,
    className,
    size,
}: Props) {
    return (
        <span
            style={size ? { fontSize: size } : null}
            className={`aspect-square grid place-items-center material-symbols-outlined${className ? ` ${className}` : ''
                }`}
        // style={{ fontVariationSettings: `"FILL" ${iconParams.fill}, "wght" ${iconParams.weight}, "GRAD" ${iconParams.grade}, "opsz" ${iconParams.opticalSize}` }}
        >
            {iconName}
        </span>
    );
}

export default GoogleIcon;
