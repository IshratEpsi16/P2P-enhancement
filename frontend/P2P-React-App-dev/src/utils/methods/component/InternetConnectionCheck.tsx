import React, { useEffect, useState } from 'react';

const InternetConnectionCheck: React.FC = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);

            if (navigator.onLine) {
                // If online, show the message for 1 second
                setIsVisible(true);
                setTimeout(() => {
                    setIsVisible(false);
                }, 1000);
            }
        };

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    return (
        <div>
            {!isOnline && (
                <h1 className='text-red-600 font-bold text-xl font-mono'>You Are Offline</h1>
            )}
            {isOnline && isVisible && (
                <h1 className='text-green-600 font-bold text-xl font-mono'>You Are Online</h1>
            )}
        </div>
    );
};

export default InternetConnectionCheck;
