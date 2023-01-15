import { useHistoryStore } from '../../../stores/historyStore';
import GoogleIcon from '../../GoogleIcon/GoogleIcon';

type Props = {
    onClickAdditional: () => void;
};

function GoBackButton({ onClickAdditional }: Props) {
    const { goBack, currentPathIndex } = useHistoryStore(state => state);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        goBack();

        if (e.clientX || e.clientY) {
            onClickAdditional();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={'h-[3.25rem] w-[3.25rem] transition-[opacity,_outline-color,_background-color] rounded-2xl outline outline-transparent outline-1 -outline-offset-1'
                .concat(currentPathIndex === 0 ? ' opacity-0  pointer-events-none' : '')
                .concat(' focus:outline-white')
                .concat(' hover:bg-gray-700')
                .concat(' active:bg-gray-500')}
        >
            <GoogleIcon iconName="arrow_back" size={40} />
        </button>
    );
}

export default GoBackButton;
