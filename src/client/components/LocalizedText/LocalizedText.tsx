import { useTranslation } from 'react-i18next';
import { StringMap, TOptionsBase } from 'i18next';

type Props = {
    i18key: string
    options?: TOptionsBase & StringMap & { ns: "translation"; returnObjects: true; returnDetails: true; }
}

function LocalizedText({ i18key, options }: Props) {
    const { t } = useTranslation();

    return (
        <>
            {t(i18key, options)}
        </>
    );
}

export default LocalizedText;