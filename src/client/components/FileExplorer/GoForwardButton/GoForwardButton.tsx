import { useHistoryStore } from '../../../stores/historyStore';
import GoogleIcon from '../../GoogleIcon/GoogleIcon';

type Props = {
    onClickAdditional: () => void;
};

function GoForwardButton({ onClickAdditional }: Props) {
    const { goForward, currentPathIndex, history } = useHistoryStore(state => state);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        goForward();

        if (e.clientX || e.clientY) {
            onClickAdditional();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={'h-[3.25rem] w-[3.25rem] transition-[opacity,_outline-color,_background-color] out rounded-2xl outline outline-transparent outline-1 -outline-offset-1'
                .concat(
                    currentPathIndex === history.length - 1 ? ' opacity-0  pointer-events-none' : ''
                )
                .concat(' focus:outline-white')
                .concat(' hover:bg-gray-700')
                .concat(' active:bg-gray-500')}
        >
            <GoogleIcon iconName="arrow_forward" size={40} />
        </button>
    );
}

export default GoForwardButton;
