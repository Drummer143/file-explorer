import { v4 } from 'uuid';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Popup from '../Popup/Popup';
import usePopupStore from './../../stores/popupStore';

function PopupContainer() {
    const { t } = useTranslation();
    const { addPopups, popups } = usePopupStore();

    useEffect(() => {
        window.electronAPI.onError((event, error, type, ...rest) =>
            addPopups({ id: v4(), type, message: t(`explorerErrors.${error}`) })
        )
    }, [])

    return (
        <div className="absolute left-0 bottom-0 flex flex-col-reverse gap-2 m-2">
            {popups.map((popupInfo, i) => <Popup key={popupInfo.id} {...popupInfo} index={i} />)}
        </div>
    )
}

export default PopupContainer;