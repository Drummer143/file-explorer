import { useHistoryStore, usePathStore } from "../../zustand/explorerStores";
import GoogleIcon from "../GoogleIcon/GoogleIcon";

type Props = {
    onClickAdditional: () => void
}

function GoBackButton({ onClickAdditional }: Props) {
    const { updatePath } = usePathStore(state => state);
    const { history, popRoute } = useHistoryStore(state => state);

    const handleClick = () => {
        const prevPath = popRoute();
        if (prevPath) {
            window.electronAPI.readDirectory(prevPath);
        } else {
            window.electronAPI.getDrives();
        }
        updatePath(prevPath);

        onClickAdditional();
    };

    return (
        <button
            tabIndex={1}
            onClick={handleClick}
            className={'h-[3.25rem] w-[3.25rem] transition-[opacity,_outline-color,_background-color] out rounded-2xl outline outline-transparent outline-1 -outline-offset-1'
                .concat(history.length === 0 ? ' opacity-0  pointer-events-none' : '')
                .concat(' focus:outline-white')
                .concat(' hover:bg-gray-700')
                .concat(' active:bg-gray-500')
            }
        >
            <GoogleIcon iconName="arrow_back" size={40} />
        </button>
    );
}

export default GoBackButton;