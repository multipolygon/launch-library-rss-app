import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext([null, () => null]);

export const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (user === null) {
            if (window && typeof window === 'object' && window.localStorage) {
                const token = window.localStorage.getItem('userToken');
                if (token) {
                    setUser({ token });
                } else {
                    setUser({});
                }
            } else {
                setUser(false);
            }
        }
    }, [user]);

    const setToken = (token) => {
        if (window && typeof window === 'object' && window.localStorage) {
            window.localStorage.setItem('userToken', token);
        }
        setUser(null); // This will run useEffect above.
    };

    const clearUser = () => {
        window.localStorage.removeItem('userToken');
        setUser({});
    };

    return (
        <UserContext.Provider value={{ user, setUser, setToken, clearUser }}>
            {children}
        </UserContext.Provider>
    );
};
