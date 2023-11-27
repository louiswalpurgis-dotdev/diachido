import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconSvg, randomBgColors } from '~/components/constant';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '~/Context/AuthProvider';
import formatPrice from '~/utils/formatPrice';
import useSave, { handleSaveInMap } from '~/hooks/useSave';

let colorIndex = 0;

const CardShopComponent = ({
    imageUrl,
    collection,
    shopName,
    address,
    link,
    ratings,
    followers,
    discount,
    shopDetail,
}) => {
    const [t] = useTranslation('translation');
    const [avgRating, setAvgRating] = useState(0);
    discount = formatPrice(discount);
    const {
        user: { uid },
    } = useContext(AuthContext);

    const currentColor = randomBgColors[colorIndex];
    colorIndex = (colorIndex + 1) % randomBgColors.length;

    const { isSave, setIsSave } = useSave(uid, shopDetail);
    useEffect(() => {
        let totalRating = 0;
        let totalRatingCount = 0;
        ratings?.forEach((rating) => {
            totalRating += rating.rating;
            totalRatingCount++;
        });
        const averageRating = (totalRating / totalRatingCount).toFixed(1);
        setAvgRating(isNaN(averageRating) ? 0 : averageRating);
        followers?.includes(uid) ? setIsSave(true) : setIsSave(false);
    }, [uid, followers, ratings, setIsSave]);

    return (
        <div to={`/store/${link}`} title={collection.id ? t(`category.${collection.collectionName}`) : shopName}>
            <div className="flex-shrink-0 group md:w-[9.5rem] md:h-[10.5rem] w-[9rem] h-[10rem] relative perspective-1000">
                <div
                    className={`absolute inset-0 ${currentColor} radiusFill transform -rotate-6 -skew-x-6 group-hover:-rotate-12 group-hover:-skew-x-12 animation200`}
                ></div>
                <div className="absolute inset-0 backdrop-blur radiusFill border-t-[1px] -rotate-6 -skew-x-6 group-hover:-rotate-12 group-hover:-skew-x-12 animation200"></div>
                <div className="absolute inset-3 md:inset-3.5 md:-translate-y-14 -translate-y-12">
                    <div className="relative m-2 radiusFill shadow-md shadow-white/40 overflow-hidden">
                        <Link to={`/store/${link}`}>
                            <img
                                src={imageUrl}
                                alt={shopName}
                                loading="lazy"
                                width="112px"
                                height="112px"
                                className="w-28 h-28 object-fill object-center group-hover:scale-110 animation200 bg-gray-200"
                            />
                        </Link>
                        <div className="absolute right-0 px-2 rounded-l-lg top-0 bg-red-400">
                            <p className="text-white font-semibold text-[0.8rem]">
                                {discount !== '0%' && `-${discount}`}
                            </p>
                        </div>
                    </div>
                    <Link to={`/store/${link}`} className="flexStart gap-1 mt-0.5">
                        <img src={IconSvg.store} alt="shop" className="w-3 h-3" />
                        <p className="font-semibold text-[0.8rem] truncate hover:underline">{shopName}</p>
                    </Link>
                    <p className="font-medium text-[0.7rem] line-clamp-2">{address}</p>
                    <div className="flexStart gap-x-1 mt-0.5">
                        <span className="inline-flex items-center gap-0.5 bg-white/50 radiusFull h-4 px-2">
                            <p className="font-medium text-[0.6rem]">{avgRating}</p>
                            <img src={IconSvg.starFill} alt="star" className="w-2 h-2" />
                        </span>
                        <span
                            className="inline-flex items-center justify-center gap-0.5 bg-white/50 radiusFull hover:bg-white/90 animation200 md:h-5 md:w-5 h-4 w-4"
                            title="Theo dõi"
                        >
                            <button
                                onClick={() => {
                                    handleSaveInMap(isSave, setIsSave, uid, shopDetail);
                                }}
                            >
                                <img
                                    src={isSave ? IconSvg.bookmarkFill : IconSvg.bookmark}
                                    alt="star"
                                    className="w-2 h-2"
                                />
                            </button>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CardShopComponent;
