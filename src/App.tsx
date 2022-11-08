import { useEffect, useState } from 'react';

function App() {
    const [data, setData] = useState<string[]>();
    const [currentPath, setCurrentPath] = useState<string>('');

    window.electronAPI.onDrivesLoaded((event, drives) => {
        console.log(drives);

        setData(drives);
    })

    useEffect(() => window.electronAPI.getDrives(), [])

    useEffect(() => {
        if (currentPath) {
            console.log(currentPath)
        }
    }, [currentPath]);

    return (
        <>
            <p>{currentPath}</p>
            {data && data.map((folder, i) => <button key={i + folder[0]} onClick={() => setCurrentPath(prev => prev + folder)}>{folder}</button>)}
        </>
    )
}

export default App;
