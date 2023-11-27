import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import convertFirestoreTimestamp, { calculateTimeRemaining } from '~/utils/ConvertFirestoreTimeStamp';
import { AppContext } from '~/Context/AppProvider';
import getShopInfo from '~/utils/getShopInfo';
import getCollection from '~/utils/getCollection';

import { Tabs, Tab } from '@mui/material';
import { Button, message } from 'antd';

import CardShopComponent from '~/components/layout/card/cardShopComponent';
import CardSellComponent from '~/components/layout/card/cardSellComponent';
import { useTranslation } from 'react-i18next';
import Slider from '~/components/layout/slider';
import getMaxDiscountForShop from '~/utils/getMaxDiscountForShop';
import cardSellSkeleton from '~/components/skeleton/cardSellSkeleton';
import cardShopSkeleton from '~/components/skeleton/cardShopSkeleton';
import { TabTitle } from '~/utils/generalFunctions';

function Home() {
    const [valueTab, setValueTab] = useState(0); // Bắt buộc để sử dụng tabs
    const [loading, setLoading] = useState(false);
    const [t] = useTranslation('translation');
    TabTitle(t('sidebar.home'));

    const {
        filteredShops,
        collectionsBanner,
        filteredDiscounts,
        loadMore,
        shopWithDiscount,
        collectionsWithShopLength,
    } = useContext(AppContext);
    const [limitDiscount, setLimitDiscount] = useState(16); // Dùng để kiểm tra đã load hết chưa

    // Tải thêm sản phẩm
    const handleLoading = async () => {
        setLoading(true);
        try {
            await loadMore();
        } catch (error) {
            message.error('Lỗi tải thêm sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const handleChangeTab = (event, newValue) => {
        setValueTab(newValue);
    };

    const visibleTabs = 3; // Số lượng tab hiển thị trên màn hình
    return (
        <div>
            <div className="flex items-center max-w-full flex-col mb-4">
                {/* Banner quảng cáo */}
                <Slider />
                {/* Collection on top */}
                <Tabs
                    value={valueTab}
                    onChange={handleChangeTab}
                    variant="scrollable"
                    scrollButtons="auto"
                    indicatorColor="transparent"
                    className="md:mt-4 lg:mt-4"
                    sx={{
                        [`& .MuiTabs-scroller.MuiTabs-scrollable > .MuiTabs-scroller-buttons`]: {
                            '&.Mui-disabled': { opacity: 0.3 },
                            display:
                                collectionsWithShopLength.length > 0 && collectionsWithShopLength.length <= visibleTabs
                                    ? 'none'
                                    : 'block',
                        },
                        [`& .MuiTabs-scroller.MuiTabs-scrollable > .MuiTabs-scroller-buttons:first-of-type`]: {
                            display: 'none',
                        },
                        width: '100%',
                        overflowX: 'auto',
                    }}
                >
                    {collectionsWithShopLength?.map((item) => {
                        const translatedColl = t(`category.${item.collectionName.toLowerCase()}`);
                        return (
                            <Tab
                                key={item.id}
                                style={{
                                    padding: '0px',
                                    marginRight: '1rem',
                                }}
                                disableFocusRipple={true}
                                label={
                                    <Link
                                        to={`/explore/${item.collectionName}`}
                                        className="bg-gray-200 px-4 py-2 radiusFill hover:bg-gray-400 min-w-fit"
                                    >
                                        <div className="flexCenter gap-x-1.5">
                                            <img src={item.icon} alt={translatedColl} className="w-4 h-4" />
                                            <p className="text-gray-800 text-xs font-semibold capitalize">
                                                {translatedColl} <span className="opacity-50">({item.shopLength})</span>
                                            </p>
                                        </div>
                                    </Link>
                                }
                            />
                        );
                    })}
                </Tabs>
                {/* Cửa hàng */}
                <div className="w-full h-auto md:mt-6 lg:mt-6">
                    <h2 className="font-bold text-lg">{t('store')}</h2>
                    <div className="bg-white shadow-sm shadow-stone-200 rounded-lg w-full py-8 radiusFill mt-2 gap-4 flex overflow-x-auto overflow-y-hidden">
                        <div className="flexStart gap-6 px-4 pt-4 flex-shrink-0">
                            {filteredShops.length === 0
                                ? Array(4)
                                      .fill()
                                      .map((_, index) => <div key={index}>{cardShopSkeleton()}</div>)
                                : filteredShops?.map((doc) => (
                                      <CardShopComponent
                                          key={doc.id}
                                          imageUrl={doc.imageURL}
                                          link={doc.shopName}
                                          ratings={doc.ratings}
                                          followers={doc.followers}
                                          collection={getCollection(doc.collectionsID[0], collectionsBanner)}
                                          shopName={doc.name}
                                          address={doc.locations[0].address}
                                          discount={getMaxDiscountForShop(doc.id, filteredDiscounts)}
                                          shopDetail={doc}
                                      />
                                  ))}

                            {filteredShops?.length > 6 && (
                                <Link to="/stores" className="flexCenter">
                                    <div className="flexCenter w-20">
                                        <p className="text-md font-semibold text-gray-800 hover:underline">Xem thêm</p>
                                    </div>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>

                {/* Ưu đãi mới nhất */}
                <div className="w-full h-auto mt-8">
                    <h2 className="font-bold text-lg">{t('latest')}</h2>
                    <div className="bg-white px-4 py-6 w-full rounded-lg mt-2 shadow-sm shadow-stone-200">
                        <div className="flex flex-wrap mx-2 my-2">
                            {filteredDiscounts.length === 0
                                ? Array(4)
                                      .fill()
                                      .map((_, index) => <div key={index}>{cardSellSkeleton()}</div>)
                                : filteredDiscounts?.map((discount) => (
                                      <CardSellComponent
                                          key={discount.id}
                                          link={getShopInfo(discount.shopID, shopWithDiscount).shopName}
                                          image={getShopInfo(discount.shopID, shopWithDiscount).imageURL}
                                          title={discount.name}
                                          price={discount.amount}
                                          shopName={getShopInfo(discount.shopID, shopWithDiscount).name}
                                          startTime={convertFirestoreTimestamp(discount.startTime)}
                                          endTime={convertFirestoreTimestamp(discount.endTime)}
                                          timeRemaining={calculateTimeRemaining(discount.startTime, discount.endTime)}
                                      />
                                  ))}
                        </div>
                        {limitDiscount < filteredDiscounts.length && (
                            <div className="flex justify-center items-center">
                                <Button
                                    type="text"
                                    loading={loading}
                                    onClick={() => {
                                        handleLoading();
                                        setLimitDiscount((prev) => prev + 8);
                                    }}
                                    className="mb-2"
                                >
                                    {loading ? 'đang tải' : 'Xem thêm'}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default Home;
