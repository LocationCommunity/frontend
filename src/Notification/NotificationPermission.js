
import React, { useEffect } from 'react';

const NotificationPermission = () => {
    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    console.log('Notification permission granted.');
                } else {
                    console.log('Notification permission denied.');
                }
            });
        }
    }, []);

    return null;
};

export default NotificationPermission;