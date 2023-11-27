import { useEffect, useState } from 'react';
import { IconSvg } from '../constant';

const BackToTop = () => {
    const [isVisible, setIsVisible] = useState(false);
    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
    }, []);
    return (
        <>
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="focus:outline-none outline-none radiusFull bg-gray-200/70 hover:bg-gray-300 hover:scale-110 animation200 p-2"
                >
                    <img src={IconSvg.collapseArrow} alt="back to top" className="w-6 h-6" />
                </button>
            )}
        </>
    );
};
export default BackToTop;
