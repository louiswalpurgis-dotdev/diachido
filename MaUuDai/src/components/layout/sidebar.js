import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '~/Context/AppProvider';
import getShopInfo from '~/utils/getShopInfo';

import getUserForComment from '~/utils/getUserForComment';
import { IconSvg, NavLinks } from '~/components/constant';
import { Avatar, Tooltip } from 'antd';
import { useTranslation } from 'react-i18next';
import formatPrice from '~/utils/formatPrice';

const NavLinkItem = ({ href, text, icon, location }) => {
    const [t] = useTranslation('translation');
    const translatedText = t(`sidebar.${text.toLowerCase()}`);
    const { setOpenSideBar } = useContext(AppContext);
    return (
        <Link
            to={href}
            onClick={() => setOpenSideBar(false)}
            className={`flex items-center hover:bg-gray-100 pl-4 py-2 rounded-lg cursor-pointer w-full gap-6 ${
                location.pathname === href ? 'text-blue-700 font-semibold bg-gray-100' : ''
            }`}
        >
            <img src={icon} alt={text} className="w-5 h-5" />
            <span className="font-base text-black">{translatedText}</span>
        </Link>
    );
};

const FlashSaleItem = ({ filteredDiscounts, shopWithDiscount }) => {
    const [t] = useTranslation('translation');
    const { setOpenSideBar } = useContext(AppContext);

    return (
        <>
            {filteredDiscounts?.slice(0, 5).map((discount) => (
                <Link
                    key={discount.id}
                    onClick={() => setOpenSideBar(false)}
                    to={`store/${getShopInfo(discount.shopID, shopWithDiscount).shopName}`}
                    className="truncate py-1 cursor-pointer hover:underline"
                    title={`${getShopInfo(discount.shopID, shopWithDiscount).name} ${t(
                        'sidebar.recentoffersDesc',
                    )}  ${formatPrice(discount.amount)}`}
                >
                    <span className="font-semibold">{getShopInfo(discount.shopID, shopWithDiscount).name} </span>
                    {t('sidebar.recentoffersDesc')}&nbsp;
                    <span className="font-semibold">{formatPrice(discount.amount)}</span>
                </Link>
            ))}
        </>
    );
};

const LatestCommentItem = ({ latestComments, usersForComments, shopsForComments }) => {
    const { setOpenSideBar } = useContext(AppContext);

    return (
        <>
            {latestComments.map((item) => {
                const user = getUserForComment(item.uid, usersForComments);
                return (
                    <Link
                        key={item.id}
                        onClick={() => setOpenSideBar(false)}
                        to={`/store/${getShopInfo(item.shopID, shopsForComments).shopName}`}
                        className="truncate py-1 cursor-pointer hover:text-blac"
                    >
                        <div className="radiusFill bg-slate-50 px-3 py-2 whitespace-normal hover:bg-gray-200">
                            <div className="flexBetween mb-1">
                                <div className="flexStart gap-1">
                                    <Avatar src={user?.photoURL} size={25} />
                                    <span className="font-semibold line-clamp-1">{user?.displayName}</span>
                                </div>
                                <div className="flexStart gap-1">
                                    <img src={IconSvg.chat} alt="chat" className="h-3 w-3" />
                                    <Tooltip title={getShopInfo(item.shopID, shopsForComments).name}>
                                        <Avatar src={getShopInfo(item.shopID, shopsForComments).imageURL} size={25} />
                                    </Tooltip>
                                </div>
                            </div>
                            <Tooltip title={item.content}>
                                <span className="font-base line-clamp-2 hover:underline hover:text-blue-500">
                                    {item.content}
                                </span>
                            </Tooltip>
                        </div>
                    </Link>
                );
            })}
        </>
    );
};

const CollectionItem = ({ collectionsWithShopLength }) => {
    const [t] = useTranslation('translation');
    const { setOpenSideBar } = useContext(AppContext);

    return (
        <>
            {collectionsWithShopLength.slice(0, 5).map((item) => {
                const translatedColl = t(`category.${item.collectionName.toLowerCase()}`);
                return (
                    <Link
                        to={`/explore/${item.collectionName}`}
                        key={item.id}
                        onClick={() => setOpenSideBar(false)}
                        className="flex justify-center items-center flex-col bg-gray-50 hover:bg-gray-200 rounded-lg"
                    >
                        <div className="flexStart wh-full gap-2 radiusBorder px-3 py-2 backdrop-blur">
                            <img src={item.icon} alt={item.name} className="h-12 object-cover" />
                            <div className="flexColumn -gap-1">
                                <p className="truncate text-md font-semibold capitalize">{translatedColl}</p>
                                <p className="truncate text-[0.8rem] text-gray-500">
                                    {item.shopLength}&nbsp;{t('sidebar.preferential')}
                                </p>
                            </div>
                        </div>
                    </Link>
                );
            })}
        </>
    );
};

function Sidebar() {
    const location = useLocation();
    const [t] = useTranslation('translation');
    const {
        filteredDiscounts,
        shopWithDiscount,
        latestComments,
        usersForComments,
        shopsForComments,
        collectionsWithShopLength,
    } = useContext(AppContext);

    return (
        <div className="bg-white rounded-lg px-0 md:px-2 lg:px-2 py-0 md:py-2 lg:py-2">
            {/* Di chuyển nhanh */}
            {NavLinks.map((link) => (
                <NavLinkItem key={link.key} location={location} {...link} />
            ))}
            <hr className="mt-4 mb-1 w-full border-1 border-gray-100 "></hr>

            {/* Giảm giá gần đây */}
            <div className="flex flex-col items-start">
                <div className=" w-full text-center text-base flex items-center gap-1 select-none capitalize py-2 px-0 md:px-2 lg:px-2 font-bold">
                    {t('sidebar.recentoffers')}
                </div>
                <div className="pl-3 w-full truncate flex flex-col">
                    <FlashSaleItem filteredDiscounts={filteredDiscounts} shopWithDiscount={shopWithDiscount} />
                </div>
            </div>
            <hr className="mt-4 mb-1 w-full border-1 border-gray-100 "></hr>

            {/* Hoạt động người dùng */}
            <div className="flex flex-col items-start">
                <div className="mb-1 font-bold w-full text-center text-base flex items-center gap-1 select-none capitalize py-2 px-0 md:px-2 lg:px-2">
                    {t('sidebar.activity')}
                </div>
                <div className="pl-2 w-full flex flex-col gap-y-0.5">
                    <LatestCommentItem
                        latestComments={latestComments}
                        usersForComments={usersForComments}
                        shopsForComments={shopsForComments}
                    />
                </div>
            </div>
            <hr className="mt-4 mb-1 w-full border-1 border-gray-100 "></hr>

            {/* Chuyên mục HOT */}
            <div className="flex flex-col items-start">
                <div className="font-bold w-full text-center text-base flex items-center gap-1 select-none mb-2 capitalize py-2 px-0 md:px-2 lg:px-2">
                    {t('sidebar.featuredcategory')}
                </div>
                <div className="pl-2 w-full flex justify-center flex-col gap-2 ">
                    <CollectionItem collectionsWithShopLength={collectionsWithShopLength} />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;
