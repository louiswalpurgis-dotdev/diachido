import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useFirestore from '~/hooks/useFirestore';
import { AuthContext } from '~/Context/AuthProvider';
import { Timestamp } from 'firebase/firestore';
import { updateDocumentFields } from '~/firebase/services';

import { Popover, message } from 'antd';
import { Breadcrumbs, List, ListItem, ListItemText, Rating } from '@mui/material';

import { AiOutlineStar } from 'react-icons/ai';
import { RiSendPlaneLine } from 'react-icons/ri';

import CollapsibleTable from '~/components/layout/tableDetail';
import { AppContext } from '~/Context/AppProvider';
import ShareComponent from '~/components/layout/shareComponent';
import Comment from '~/components/layout/comments';

import { IconSvg } from '~/components/constant';
import { useTranslation } from 'react-i18next';
import filterDiscountsForShop from '~/utils/filterDiscountsForShop';
import useSave from '~/hooks/useSave';
import useLike from '~/hooks/useLike';
import { TabTitle } from '~/utils/generalFunctions';
import ReactGA from 'react-ga4';
import Helmets from '~/components/helmet/Helmets';

function DetailShop() {
    const [t] = useTranslation('translation');
    const [ratingCount, setRatingCount] = useState(0);
    const [visibleLocation, setVisibleLocation] = useState(false);
    const [ratingValue, setRatingValue] = useState(2);
    const [ratingHover, setRatingHover] = useState(-1);
    const [myRating, setMyRating] = useState(null);
    const {
        user: { uid },
    } = useContext(AuthContext);
    const { setOpenShareModel } = useContext(AppContext);

    const [currentDiscounts, setCurrentDiscounts] = React.useState([]);
    const [expiredDiscounts, setExpiredDiscounts] = React.useState([]);
    const handleVisibleLocation = (open) => {
        setVisibleLocation(open);
    };

    const handleChangeRating = async (newValue) => {
        if (!uid) {
            message.error('Bạn cần đăng nhập để đánh giá !');
            return;
        }
        if (!newValue) {
            message.error('Đã xuất hiện lỗi !');
            return;
        }
        const existingRatingIndex = shopDetail[0]?.ratings.findIndex((item) => item.uid === uid);
        try {
            if (existingRatingIndex !== -1) {
                // Người dùng đã có đánh giá, cập nhật đánh giá của họ
                shopDetail[0].ratings[existingRatingIndex].rating = newValue;
            } else {
                // Người dùng chưa có đánh giá, thêm mới đánh giá
                shopDetail[0].ratings.push({ uid: uid, rating: newValue });
            }
            await updateDocumentFields('shops', shopDetail[0].id, {
                ratings: shopDetail[0]?.ratings,
            });
            message.success('Cập nhật đánh giá thành công !');
        } catch (error) {
            message.error('Đã xảy ra lỗi khi cập nhật đánh giá.');
        }
    };

    // Lấy thông tin 1 cửa hàng
    const { shopName } = useParams();
    const shopDetailCondition = React.useMemo(() => {
        return {
            fieldName: 'shopName',
            operator: '==',
            compareValue: shopName,
        };
    }, [shopName]);

    const { documents: shopDetail } = useFirestore('shops', shopDetailCondition);
    const { isSave, setIsSave, handleSave } = useSave(uid, shopDetail[0]);
    const { isLike, setIsLike, handleLike } = useLike(uid, shopDetail[0]);
    // Xử lý like/dislike và save/unsave và rating
    useEffect(() => {
        shopDetail.forEach((shop) => {
            let totalRating = 0;
            let totalRatingCount = 0;
            shop.ratings?.forEach((rating) => {
                totalRating += rating.rating;
                totalRatingCount++;
                if (rating.uid === uid) setMyRating(rating.rating);
            });
            const averageRating = totalRating / totalRatingCount;
            setRatingCount(totalRatingCount);
            setRatingValue(averageRating || 0);
            shop.followers.includes(uid) ? setIsSave(true) : setIsSave(false);
            shop.likers.includes(uid) ? setIsLike(true) : setIsLike(false);
            // MyRating
            const existingRatingIndex = shopDetail[0].ratings?.findIndex((item) => item.uid === uid);
            if (existingRatingIndex !== -1) {
                setMyRating(shopDetail[0].ratings[existingRatingIndex].rating || null);
            } else {
                setMyRating(null);
            }
        });
    }, [shopDetail, uid, setIsSave, setIsLike]);

    // Lấy thông tin các ưu đãi
    const discountsCondition = React.useMemo(() => {
        if (shopDetail[0]?.id) {
            return [
                {
                    fieldName: 'shopID',
                    operator: '==',
                    compareValue: shopDetail[0].id,
                },
                {
                    fieldName: 'showTime',
                    operator: '<',
                    compareValue: Timestamp.now(),
                },
            ];
        }
        return [];
    }, [shopDetail]);

    const { documents: discounts } = useFirestore('discounts', discountsCondition);
    useEffect(() => {
        let filDiscounts = filterDiscountsForShop(discounts);
        // Lọc ra các discounts có endTime lớn hơn thời gian hiện tại
        const filteredCurrentDiscounts = filDiscounts.filter((discount) => discount.endTime >= Timestamp.now());
        // Lọc ra các discounts có endTime nhỏ hơn thời gian hiện tại
        const filteredExpiredDiscounts = filDiscounts.filter((discount) => discount.endTime < Timestamp.now());

        // Cập nhật state để hiển thị danh sách discounts tương ứng
        setCurrentDiscounts(filteredCurrentDiscounts);
        setExpiredDiscounts(filteredExpiredDiscounts);
    }, [discounts]);
    TabTitle(shopDetail[0]?.shopName);

    // Theo dõi người dùng
    useEffect(() => {
        if (shopDetail[0]) {
            ReactGA.event({
                category: `view_shop_detail`,
                action: `viewShop: ${shopDetail[0].name}`,
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shopDetail]);
    return (
        <>
            {shopDetail.map((shop) => (
                <div key={shop.id}>
                    {/* Chỉ mục trang */}
                    <Breadcrumbs
                        aria-label="breadcrumb"
                        separator="›"
                        className="flex items-center pt-2 lg:pt-0 xl:pt-0"
                    >
                        <Link underline="hover" color="inherit" to="/">
                            DiaChiDo
                        </Link>
                        <Link underline="hover" color="inherit" to="/stores/">
                            {t('store')}
                        </Link>
                        <Link underline="hover" className="text-black" to="/store/thanhhung/" aria-current="page">
                            {shop.shopName}
                        </Link>
                    </Breadcrumbs>
                    {/* Thông tin cửa hàng */}
                    <Helmets image={shop.imageURL} description={shop.description} />
                    <div className="flex md:flex-row flex-col items-start mt-2 gap-4 radiusBorder bg-white px-8 py-4">
                        {/* hop photo */}
                        <div className="flex md:flex-col flex-row gap-4">
                            <div className="flex-shrink-0 group w-32 h-32 relative perspective-1000">
                                <div className="absolute inset-0  bg-gradient-to-tr from-red-100/20 via-red-400/40 to-orange-400/40 radiusFill shadow-lg shadow-slate-50/20 transform group-hover:-rotate-6 group-hover:-skew-x-12 animation200"></div>
                                <div className="absolute inset-0 backdrop-blur radiusFill shadow-lg group-hover:-rotate-6 group-hover:-skew-x-12 animation200"></div>
                                <div className="absolute inset-4 radiusFill shadow-lg shadow-white/50 overflow-hidden">
                                    <img
                                        src={shop.imageURL}
                                        alt={shop.shopName}
                                        className="w-full h-full object-fill object-center"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-xs font-semibold">
                                    {t('storeDetail.ratingDesc')}:&nbsp;
                                    <span>
                                        {!ratingHover && !myRating
                                            ? ratingValue
                                            : ratingHover !== -1
                                            ? ratingHover
                                            : myRating
                                            ? myRating
                                            : t('storeDetail.noRating')}
                                    </span>
                                </p>
                                <div className="relative flex items-center justify-start gap-4">
                                    <Rating
                                        name="hover-feedback"
                                        value={myRating}
                                        precision={0.5}
                                        size="small"
                                        getLabelText={getLabelRatingText}
                                        onChange={(event, newValue) => {
                                            handleChangeRating(newValue);
                                        }}
                                        onChangeActive={(event, newHover) => {
                                            setRatingHover(newHover);
                                        }}
                                        emptyIcon={<AiOutlineStar size={18} />}
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Thông tin shop */}
                        <div className="w-full flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <div className="flexColumn text-[1rem] font-semibold ">
                                    <p>{t('storeDetail.explore')}:</p>
                                    <div className="flexStart gap-x-1">
                                        <img src={IconSvg.store} alt="shop" className="w-3 h-3" />
                                        <p className="textColorTwice truncate">{shop.shopName}</p>
                                    </div>
                                </div>
                                <div className="flexStart gap-2">
                                    <div className="flexCenter radiusBorder font-medium text-xs gap-x-1 py-1.5 px-2">
                                        <img src={IconSvg.starFill} alt="shop" className="w-3 h-3" />
                                        <span>{ratingValue.toFixed(1) || 0}</span>
                                    </div>
                                    <p className="font-medium text-xs text-gray-800/50">
                                        <span>{ratingCount}</span> {t('storeDetail.ratingCount')}
                                    </p>
                                </div>
                                <p className="font-medium text-sm text-gray-800/50 whitespace-pre-line text-justify">
                                    {shop.description ? shop.description : 'Chưa có mô tả'}
                                </p>
                                <div className="flexStart gap-2">
                                    <div
                                        onClick={handleLike}
                                        className="flexCenter radiusBorder cursor-pointer hover:bg-slate-100 animation200 font-medium text-xs gap-x-1 py-1.5 px-2"
                                    >
                                        {isLike ? (
                                            <img src={IconSvg.heartFill} alt="heart" className="w-3 h-3" />
                                        ) : (
                                            <img src={IconSvg.heart} alt="heart" className="w-3 h-3" />
                                        )}
                                        {isLike ? (
                                            <span>{t('storeDetail.loved')}</span>
                                        ) : (
                                            <span>{t('storeDetail.love')}</span>
                                        )}
                                    </div>

                                    <Popover
                                        content={
                                            <List
                                                sx={{
                                                    width: '100%',
                                                    maxWidth: 360,
                                                    minWidth: 200,
                                                    position: 'relative',
                                                    overflow: 'auto',
                                                    maxHeight: 240,
                                                    '& ul': { padding: 0 },
                                                }}
                                                subheader={<li />}
                                            >
                                                {/* List khu vực */}
                                                {shop.locations.map((location, index) => (
                                                    <li key={index}>
                                                        <ListItem
                                                            secondaryAction={
                                                                <Link to={openInMaps(location.address)} target="_blank">
                                                                    <RiSendPlaneLine size={18} />
                                                                </Link>
                                                            }
                                                        >
                                                            <ListItemText
                                                                primary={
                                                                    <Link
                                                                        to={openInMaps(location.address)}
                                                                        target="_blank"
                                                                    >
                                                                        {location.address}
                                                                    </Link>
                                                                }
                                                            />
                                                        </ListItem>
                                                    </li>
                                                ))}
                                            </List>
                                        }
                                        trigger="click"
                                        open={visibleLocation}
                                        onOpenChange={handleVisibleLocation}
                                    >
                                        <div className="flexCenter radiusBorder cursor-pointer hover:bg-slate-100 animation200 font-medium text-xs gap-x-1 py-1.5 px-2">
                                            <img src={IconSvg.marker} alt="areas" className="w-3 h-3" />
                                            <span>{t('storeDetail.location')}</span>
                                        </div>
                                    </Popover>
                                    <div
                                        onClick={() => {
                                            setOpenShareModel(true);
                                        }}
                                        className="flexCenter radiusBorder cursor-pointer hover:bg-slate-100 animation200 font-medium text-xs gap-x-1 py-2 px-2"
                                    >
                                        <img src={IconSvg.share} alt="share" className="w-3 h-3" />
                                    </div>
                                    <ShareComponent url={window.location.href} shopName={shop.name} />
                                </div>
                            </div>
                            <div
                                onClick={handleSave}
                                title={t('storeDetail.follow')}
                                className="flex flex-shrink-0 radiusBorder cursor-pointer hover:bg-slate-100 animation200 font-medium text-xs gap-x-1 py-2 px-2"
                            >
                                {isSave ? (
                                    <img src={IconSvg.bookmarkFill} alt="" className="w-3 h-3" />
                                ) : (
                                    <img src={IconSvg.bookmark} alt="" className="w-3 h-3" />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Đang khuyến mãi */}
                    {expiredDiscounts.length === 0 && currentDiscounts.length === 0 && (
                        <div className="font-bold text-lg flex justify-center mt-8 text-red-500">
                            {t('storeDetail.noResult')}
                        </div>
                    )}
                    {currentDiscounts.length > 0 && (
                        <div className="w-full h-auto mt-4">
                            <h2 className="font-bold text-lg">{t('storeDetail.sale')}</h2>
                            <div className="bg-gray-50 w-full rounded-lg mt-2">
                                <CollapsibleTable data={currentDiscounts} />
                            </div>
                        </div>
                    )}

                    {/* Đã hết hạn */}
                    {expiredDiscounts.length > 0 && (
                        <div className="w-full h-auto mt-8">
                            <h2 className="font-bold text-lg">{t('storeDetail.saleExpired')}</h2>
                            <div className="bg-gray-50 w-full rounded-lg mt-2">
                                <CollapsibleTable data={expiredDiscounts} />
                            </div>
                        </div>
                    )}

                    <div className="inline-block max-w-max rounded-lg border p-2 mt-8 mb-4 select-none bg-white shadow-sm shadow-slate-200">
                        <h2 className="font-bold text-l">
                            {t('storeDetail.comment')} {shop.shopName}?
                        </h2>
                    </div>
                    <Comment shopDetail={shopDetail[0]} />
                </div>
            ))}
        </>
    );
}

function isAppleDevice() {
    const appleDeviceRegex = /(iPhone|iPad|iPod|Macintosh)/i;
    return appleDeviceRegex.test(navigator.userAgent);
}
function openInMaps(address) {
    const appleMapUrl = `http://maps.apple.com/?q=${encodeURIComponent(address)}`;
    const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    if (isAppleDevice()) {
        return appleMapUrl;
    }
    return googleMapUrl;
}
function getLabelRatingText(value) {
    return `${value} sao!`;
}

export default DetailShop;
