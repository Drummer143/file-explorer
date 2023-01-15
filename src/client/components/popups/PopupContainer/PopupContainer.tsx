import { v4 } from 'uuid';
import { useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import Popup from '../Popup/Popup';
import usePopupStore from './../../../stores/popupStore';
import { useHistoryStore } from '../../../stores/historyStore';

function PopupContainer() {
    const { t } = useTranslation();
    const { deleteLastRoute } = useHistoryStore();
    const { addPopups, popups } = usePopupStore();

    useEffect(() => {
        window.electronAPI.onError((event, error, type, data) => {
            let message = t(`explorerErrors.${error}`);

            if (message.includes('!<')) {
                const interpolationStart = message.indexOf('!<');
                const interpolationEnd = message.indexOf('!<', interpolationStart + 2) + 2;
                const interpolationProp = message.slice(interpolationStart, interpolationEnd);
                const value = data[interpolationProp.slice(2, -2) as keyof typeof data];

                message = message.replace(interpolationProp, value || '');
            }

            switch (error) {
                case 'invalidPath':
                    deleteLastRoute();
                    break;
            }

            addPopups({ id: v4(), type, message })
        })
    }, [])

    return (
        <div className="absolute left-0 bottom-0 flex flex-col-reverse gap-2 m-2">
            {popups.map((popupInfo, i) => <Popup key={popupInfo.id} {...popupInfo} index={i} />)}
        </div>
    )
}

export default PopupContainer;