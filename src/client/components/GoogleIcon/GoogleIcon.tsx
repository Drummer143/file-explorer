import React from 'react';

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
            className={'material-symbols-outlined aspect-square'
                .concat(' ', className || 'grid place-items-center')}
        >
            {iconName}
        </span>
    );
}

export default GoogleIcon;
