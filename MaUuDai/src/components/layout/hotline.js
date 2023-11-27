import { useEffect, useRef, useState } from 'react';
import { ImageAssets } from '../constant';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Hotline = () => {
    const HotlineRef = useRef();
    const [showHotline, setShowHotline] = useState(false);
    const [t] = useTranslation('translation');

    const handleButtonClick = () => {
        setShowHotline(!showHotline);
    };

    useEffect(() => {
        // Xử lý Timeout để hiển thị và ẩn hotline
        const showTimeout = setTimeout(() => {
            setShowHotline(true);
        }, 4000);

        const hideTimeout = setTimeout(() => {
            setShowHotline(false);
        }, 10000);

        // Xử lý sự kiện click bên ngoài để đóng menu
        let closeMenu = (e) => {
            if (!HotlineRef.current.contains(e.target)) {
                setShowHotline(false);
            }
        };
        document.addEventListener('mousedown', closeMenu);

        return () => {
            clearTimeout(showTimeout);
            clearTimeout(hideTimeout);
            document.removeEventListener('mousedown', closeMenu);
        };
    }, []);

    return (
        <>
            <div className="inline-flex items-end gap-2" ref={HotlineRef}>
                {showHotline && (
                    <Link
                        to={`tel:${t('contact.phone')}`}
                        className="relative group flexCenter focus:outline-none outline-none backdrop-blur border border-slate-100 px-4 py-2 radiusFill"
                    >
                        <p className="text-sm font-medium text-gray-700">
                            {t('contact.name')}: <strong className="group-hover:underline">{t('contact.phone')}</strong>
                        </p>
                    </Link>
                )}
                <button
                    className="focus:outline-none outline-none hover:scale-110 animation200 p-1"
                    title="Hotline"
                    onClick={handleButtonClick}
                >
                    <img src={ImageAssets.hotline} alt="back to top" className="w-8 h-8 keyframes-cus" />
                </button>
            </div>
        </>
    );
};
export default Hotline;
