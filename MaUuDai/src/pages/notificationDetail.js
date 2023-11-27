import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TabTitle } from '~/utils/generalFunctions';
import { AppContext } from '~/Context/AppProvider';
import { convertFirestoreTimestampToTime } from '~/utils/ConvertFirestoreTimeStamp';

function NotificationDetail() {
    const [t] = useTranslation('translation');
    const [notification, setNotification] = useState(null);
    const [user, setUser] = useState(null);
    TabTitle(t('notification.name'));

    const { notificationWithUsers: notifications } = useContext(AppContext);
    const { notificationId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        // Find the notification with the matching notificationId
        const foundNotification = notifications.find((element) => element.notification.id === notificationId);

        if (foundNotification) {
            setNotification(foundNotification.notification);
            setUser(foundNotification.user);
        } else {
            // If no matching notification is found, redirect to the home page
            navigate('/');
        }
    }, [notificationId, navigate, notifications]);

    return (
        <div className="bg-white rounded-lg flex w-fit flex-col mx-auto p-6 min-h-[22rem] max-w-[60rem] mt-2 md:mt-0">
            <h1 className="text-3xl font-semibold whitespace-normal">{notification?.title}</h1>
            <div className="flex items-center space-x-2">
                <span className="text-gray-400 font-light ">Được viết bởi: </span>{' '}
                <span className="text-blue-400"> {user?.displayName}</span>
                <p className="text-sm text-gray-400 ml-2 font-light">
                    {notification ? convertFirestoreTimestampToTime(notification?.updatedAt) : 'Chưa có ngày viết'}
                </p>
            </div>
            <div className="mt-4 text-base whitespace-pre-line text-justify font-normal">{notification?.content}</div>
        </div>
    );
}

export default NotificationDetail;
