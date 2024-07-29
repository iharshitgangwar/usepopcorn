import { useEffect } from 'react';

const LogoutOnBrowserClose = () => {
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            console.log('window closed')
            if (event.currentTarget === window) {
                console.log('Window is closing. Logging out user...');
                // Example: Call a logout function or dispatch a logout action
                // logoutUser(); // Call your logout function here
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    return null; // Or you can return any component JSX here
};

export default LogoutOnBrowserClose;