import React, { createContext, useState, useContext, useCallback } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((type, title, message) => {
        const id = Math.random().toString(36).substr(2, 9);
        setNotifications((prev) => [...prev, { id, type, title, message }]);

        // Auto remove after 5 seconds
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
                {notifications.map((notif) => (
                    <Notification
                        key={notif.id}
                        {...notif}
                        onClose={() => removeNotification(notif.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
