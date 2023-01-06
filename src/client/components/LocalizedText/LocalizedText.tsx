import { useTranslation } from 'react-i18next';

type Props = {
    i18key: string
}

function LocalizedText({ i18key }: Props) {
    const { t } = useTranslation();

    return (
        <>
            {t(i18key)}
        </>
    );
}

export default LocalizedText;