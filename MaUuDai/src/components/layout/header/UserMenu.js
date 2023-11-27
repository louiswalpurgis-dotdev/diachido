import { Avatar } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { DropAvatarLinks, IconSvg } from '~/components/constant';

const DropAvatarLinkItem = ({ href, text, icon, setOpenMenu }) => {
    const [t] = useTranslation('translation');
    let translateText = t(`sidebar.${text}`);
    return (
        <Link
            to={href}
            className="flex items-center hover:bg-gray-200 pl-4 py-2 rounded-md cursor-pointer w-full gap-3"
            title={translateText}
            onClick={() => setOpenMenu(false)}
        >
            <img src={icon} alt={text} className="w-4 h-4" />
            <span className="font-semibold">{translateText}</span>
        </Link>
    );
};

const UserMenu = ({ displayName, photoURL, point, handleLogout }) => {
    const [t] = useTranslation('translation');
    const userMenuRef = useRef();

    const [openMenu, setOpenMenu] = useState(false);
    useEffect(() => {
        // Định nghĩa hàm để đóng menu
        let closeMenu = (e) => {
            if (!userMenuRef.current.contains(e.target)) {
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

    return (
        <div className="relative" ref={userMenuRef}>
            {/* BUTTON */}
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenu(!openMenu);
                }}
                title={displayName}
                className="flexCenter p-0.5 overflow-hidden radiusFull bg-gradient-to-tr from-[#f94144]/30 via-[#f3722c]/30 to-[#f8961e]/20 transition duration-200 hover:scale-105"
            >
                <div className="aspect-w-1 aspect-h-1 overflow-hidden radiusFull h-8 w-8">
                    <Avatar src={photoURL} className="wh-full object-cover" />
                </div>
            </button>
            {/* TABLE */}
            <div
                className={`${
                    openMenu ? '' : 'hidden'
                } origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5`}
            >
                <div className="py-1">
                    <div className="flexBetween px-4 pt-2">
                        <div className="block text-sm font-semibold truncate">{displayName}</div>
                        <span onClick={() => handleLogout()} className="block cursor-pointer">
                            <img src={IconSvg.logout} alt="hd" className="w-3 h-3" />
                        </span>
                    </div>
                    <div className="flex items-center pl-4 w-full gap-3 font-semibold text-xs">
                        <span className="font-light text-gray-400">{t('user.youHave')}:</span>
                        {point}⭐
                    </div>
                    {DropAvatarLinks.map((item) => (
                        <DropAvatarLinkItem key={item.key} setOpenMenu={setOpenMenu} {...item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UserMenu;
