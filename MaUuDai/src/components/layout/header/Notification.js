import { Badge } from '@mui/material';
import { Avatar } from 'antd';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { AppContext } from '~/Context/AppProvider';
import { AuthContext } from '~/Context/AuthProvider';
import { updateDocumentFields } from '~/firebase/services';
import formatTimeToNow from '~/utils/formatDistanceToNow';

const DropNotifications = ({ href, title, createdAt, setOpenMenu, user, read, currentUid, handleRead }) => {
    let userIsReading = read.find((item) => item === currentUid);
    const [t] = useTranslation('translation');
    return (
        <Link
            to={href}
            onClick={() => {
                if (!userIsReading) {
                    handleRead();
                }
                setOpenMenu(false);
            }}
            className={`flex gap-2 h-fit hover:bg-gray-100 hover:text-black p-1 items-center rounded-lg`}
        >
            <Avatar className="w-12 h-12" src={user?.photoURL}>
                {user?.photoURL ? '' : user?.displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <div className="flex flex-col">
                <p className={`line-clamp-2 text-sm ${userIsReading ? 'text-gray-400 font-light' : ''}`}>{title}</p>
                <p className={`text-xs font-semibold ${userIsReading ? 'text-gray-400' : 'text-blue-500'}`}>
                    {createdAt} {t('comment.timeAgo')}
                </p>
            </div>
        </Link>
    );
};

const Notification = () => {
    const [t] = useTranslation('translation');
    const [openMenu, setOpenMenu] = useState(false);
    const [haveNewNotif, setHaveNewNotif] = useState(false);
    const NotifMenuRef = useRef();
    const { notificationWithUsers: notifications, language } = useContext(AppContext);
    const {
        user: { uid },
    } = useContext(AuthContext);

    useEffect(() => {
        // Định nghĩa hàm để đóng menu
        let closeMenu = (e) => {
            if (!NotifMenuRef.current.contains(e.target)) {
                setOpenMenu(false);
            }
        };

        // Lắng nghe sự kiện click trên document
        document.addEventListener('mousedown', closeMenu);

        // Cleanup: Gỡ bỏ lắng nghe sự kiện khi component bị hủy
        return () => {
            document.removeEventListener('mousedown', closeMenu);
        };
    }, []);

    const handleRead = async ({ notification, uid }) => {
        // Kiểm tra người dùng đã đọc chưa
        let userIsReading = notification.read.find((item) => item === uid);
        if (!userIsReading) {
            try {
                await updateDocumentFields('notifications', notification.id, {
                    read: [...notification.read, uid],
                });
            } catch (error) {}
        }
    };

    const handleReadAll = ({ notifications, uid }) => {
        let notificationsNotRead = notifications.filter((item) => {
            let userIsReading = item.notification.read.find((item) => item === uid);
            return !userIsReading;
        });
        if (notificationsNotRead.length > 0) {
            notificationsNotRead.forEach(async (item) => {
                try {
                    await handleRead({ notification: item.notification, uid });
                } catch (error) {}
            });
        }
    };

    // Kiểm tra xem có thông báo mới hay không
    useEffect(() => {
        if (notifications) {
            let haveNewNotif = notifications.find((item) => {
                let userIsReading = item.notification.read.find((item) => item === uid);
                return !userIsReading;
            });
            setHaveNewNotif(haveNewNotif ? true : false);
        }
    }, [notifications, uid]);
    return (
        <div className="relative" ref={NotifMenuRef}>
            {/* BUTTON */}
            <button
                className={`flexCenter text-slate-500 radiusFull bg-gray-200/30 focus-within:bg-white/70 animation200 hover:text-slate-600 group p-1.5 ${
                    openMenu ? 'bg-blue-200' : ''
                }`}
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(!openMenu);
                }}
            >
                <span className="sr-only">Thông báo</span>
                <Badge variant={`${haveNewNotif ? 'dot' : ''}`} color="error">
                    <lord-icon
                        src="https://cdn.lordicon.com/psnhyobz.json"
                        trigger="hover"
                        colors={`primary:${openMenu ? '#2563EB' : 'black'}`}
                        style={{ width: '1.3rem', height: '1.3rem' }}
                    ></lord-icon>
                </Badge>
            </button>
            {/* TABLE */}
            <div
                className={`${
                    openMenu ? '' : 'hidden'
                } origin-top-right absolute -right-10 md:-right-20 lg:-right-20 mt-2 w-80 sm:w-80 md:w-96 lg:w-96 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
            >
                <div className="py-1">
                    <div className="flexBetween px-4 pt-2">
                        <div className="block text-lg font-semibold text-gray-800 truncate">
                            {t('notification.name')}:
                        </div>
                        <span
                            onClick={() => {
                                handleReadAll({ notifications, uid });
                            }}
                            className="block cursor-pointer p-1 hover:bg-gray-200 hover:underline rounded-lg text-sm text-blue-700"
                        >
                            {t('notification.isRead')}
                        </span>
                    </div>
                    <div
                        className={`${
                            !notifications ? 'flexCenter' : 'flex'
                        } px-4 w-full gap-3 min-h-[320px] max-h-[calc(100vh-10rem)] flex-col overflow-y-auto`}
                    >
                        {notifications &&
                            notifications.map(({ notification, user }) => (
                                <DropNotifications
                                    key={notification.id}
                                    href={`/notification/${notification.id}`}
                                    title={notification.title}
                                    read={notification.read}
                                    currentUid={uid}
                                    createdAt={formatTimeToNow(notification.createdAt.toDate(), language)}
                                    setOpenMenu={setOpenMenu}
                                    user={user}
                                    handleRead={() => handleRead({ notification, uid })}
                                />
                            ))}
                        {(!notifications || notifications.length === 0) && <p>{t('notification.noResult')}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
