import { useMemo } from 'react';
import useFirestore from '~/hooks/useFirestore';

function useNotifications() {
    const { documents: notifications } = useFirestore('notifications');

    const uids = useMemo(() => {
        return notifications.map((notification) => notification.uid);
    }, [notifications]);

    const userNotification = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: uids,
        };
    }, [uids]);

    const { documents: users } = useFirestore('users', userNotification);

    const notificationWithUsers = useMemo(() => {
        return notifications.map((notification) => ({
            notification,
            user: users.find((user) => user.uid === notification.uid) || null,
        }));
    }, [notifications, users]);

    return notificationWithUsers;
}

export default useNotifications;
