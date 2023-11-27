import React, { useContext, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { AppContext } from '~/Context/AppProvider';
import { useTranslation } from 'react-i18next';
import { TabTitle } from '~/utils/generalFunctions';
import ReactGA from 'react-ga4';

const Slider = () => {
    const [t] = useTranslation('translation');
    TabTitle(t('sidebar.home'));
    const [showNavigation, setShowNavigation] = useState(false);
    const swiperRef = useRef(null);
    const { banner } = useContext(AppContext);

    const handleMouseEnter = () => {
        setShowNavigation(true);
    };
    const handleMouseLeave = () => {
        setShowNavigation(false);
    };
    const handleNavigationClick = (event) => {
        event.stopPropagation();
        swiperRef.current.swiper[event.target.dataset.action]();
    };

    const handleClickBanner = (item) => {
        ReactGA.event({
            category: 'clickBanner',
            action: `clickBanner: ${item.shopName}`,
        });
    };
    return (
        <div
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="w-full h-36 md:h-48 lg:h-72 bg-white p-2 radiusFill flexStart gap-2 shadow-sm shadow-stone-200"
        >
            <Swiper
                ref={swiperRef}
                pagination={{
                    dynamicBullets: true,
                    clickable: true,
                }}
                navigation={{
                    nextEl: showNavigation ? '.swiper-button-next' : null,
                    prevEl: showNavigation ? '.swiper-button-prev' : null,
                    hideOnClick: true,
                }}
                loop={true}
                observer={true}
                observeParents={true}
                parallax={true}
                autoplay={{
                    delay: 7000,
                    disableOnInteraction: false,
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="mySwiper radiusFill"
            >
                {banner.map((item) => (
                    <SwiperSlide key={item.id}>
                        <Link
                            to={`/store/${item.shopName}`}
                            onClick={() => {
                                handleClickBanner(item);
                            }}
                        >
                            <img src={item.image} alt={item.shopName} className="wh-full object-cover" />
                        </Link>
                    </SwiperSlide>
                ))}
                {showNavigation && (
                    <>
                        <div
                            className="swiper-button-next flex-shrink-0"
                            onClick={handleNavigationClick}
                            data-action="slideNext"
                        ></div>
                        <div
                            className="swiper-button-prev"
                            onClick={handleNavigationClick}
                            data-action="slidePrev"
                        ></div>
                    </>
                )}
            </Swiper>
        </div>
    );
};

export default Slider;
