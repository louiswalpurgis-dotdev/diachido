import React, { useMemo, useEffect, useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs, Select, MenuItem } from '@mui/material';
import getShopInfo from '~/utils/getShopInfo';

import CardSellComponent from '~/components/layout/card/cardSellComponent';
import CardShopComponent from '~/components/layout/card/cardShopComponent';
import useFirestore from '~/hooks/useFirestore';
import convertFirestoreTimestamp, { calculateTimeRemaining } from '~/utils/ConvertFirestoreTimeStamp';
import useLocationFilter from '~/utils/useLocationFilter';
import getCollection from '~/utils/getCollection';
import { AppContext } from '~/Context/AppProvider';
import { useTranslation } from 'react-i18next';
import useDataByConditions from '~/hooks/useDataByCondition';
import getMaxDiscountForShop from '~/utils/getMaxDiscountForShop';
import { TabTitle } from '~/utils/generalFunctions';

const ExploreDetail = () => {
    const [t] = useTranslation('translation');
    const { nameDetail } = useParams();
    const [discounts, setDiscounts] = useState([]);
    const { sortOptions, districtOptions, sort, district, setDistrict } = useContext(AppContext);

    const collectionCondition = useMemo(() => {
        return {
            fieldName: 'collectionName',
            operator: '==',
            compareValue: nameDetail,
        };
    }, [nameDetail]);

    const { documents: collections } = useFirestore('collections', collectionCondition, 1);

    const shopCondition = useMemo(() => {
        if (collections.length > 0) {
            return [
                {
                    fieldName: 'collectionsID',
                    operator: 'array-contains',
                    compareValue: collections[0].id,
                },
            ];
        }
        return [];
    }, [collections]);
    const shops = useDataByConditions('shops', shopCondition);
    const shopIds = useMemo(() => {
        if (shops.length === 0) return [];
        return shops.map((shop) => shop.id);
    }, [shops]);
    const discountConditions = useMemo(() => {
        return [
            {
                fieldName: 'shopID',
                operator: 'in',
                compareValue: shopIds,
            },
        ];
    }, [shopIds]);
    const allDiscounts = useDataByConditions('discounts', discountConditions);
    useEffect(() => {
        setDiscounts(filterDiscountsByShopId(allDiscounts, shopIds));
    }, [allDiscounts, shopIds]);

    const { shopData, setShopData, discountData, setDiscountData, handleSortChange, handleDistrictChange } =
        useLocationFilter(shops, discounts);
    useEffect(() => {
        setDiscountData(discounts);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [discounts, setDiscountData]);
    useEffect(() => {
        if (shops.length > 0) {
            setShopData(shops);
            handleDistrictChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shops, setShopData, handleDistrictChange]);

    const translatedColl = t(`category.${collections[0]?.collectionName}`);
    TabTitle(translatedColl);

    return (
        <div>
            <Breadcrumbs
                aria-label="breadcrumb"
                separator="›"
                className="flex items-center pl-4 md:pl-0 lg:pl-0 pt-2 lg:pt-0 xl:pt-0"
            >
                <Link underline="hover" color="inherit" to="/">
                    DiaChiDo
                </Link>
                <Link underline="hover" color="inherit" to="/explore">
                    {t('sidebar.explore')}
                </Link>
                <Link underline="hover" className="text-black" to="/explore/amthuc" aria-current="page">
                    {collections.length > 0 ? translatedColl : ''}
                </Link>
            </Breadcrumbs>
            <div className="my-4 w-full flex justify-center">
                <h1 className="font-bold text-6xl lg:text-8xl select-none capitalize">
                    {collections.length > 0 ? translatedColl : ''}
                </h1>
            </div>
            {/* select option */}
            <div className="flex justify-center items-center my-8">
                <div className="flex rounded-lg border">
                    <div>
                        <Select
                            value={district}
                            onChange={(e) => {
                                setDistrict(e.target.value);
                            }}
                            size="small"
                            sx={{ border: 'none', '& fieldset': { border: 'none' } }}
                        >
                            {districtOptions.map((option) => {
                                let translateLabel = option.label === 'all' ? t('all') : option.label;
                                return (
                                    <MenuItem key={option.value} value={option.value}>
                                        {translateLabel}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </div>
                    <div className="border-l-2">
                        <Select
                            value={sort}
                            onChange={handleSortChange}
                            size="small"
                            sx={{ border: 'none', '& fieldset': { border: 'none' } }}
                        >
                            {sortOptions.map((option) => {
                                const translatedSort = t(`sort.${option.label.toLowerCase()}`);
                                return (
                                    <MenuItem key={option.value} value={option.value}>
                                        <span className="capitalize">{translatedSort}</span>
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </div>
                </div>
            </div>
            {shopData.length > 0 ? (
                <div>
                    <div className="w-full h-auto mt-4">
                        <h2 className="font-bold text-lg">{t('store')}</h2>
                        <div className="bg-white shadow-sm shadow-stone-200 rounded-lg w-full h-auto py-6 radiusFill gap-4 flex mt-2">
                            <div className="flexStart  gap-6 px-3 md:px-7 lg:px-7 flex-wrap">
                                {shopData?.map((doc) => (
                                    <CardShopComponent
                                        key={doc.id}
                                        imageUrl={doc.imageURL}
                                        link={doc.shopName}
                                        ratings={doc.ratings}
                                        followers={doc.followers}
                                        collection={getCollection(doc.collectionsID[0], collections)}
                                        shopName={doc.name}
                                        address={doc.locations[0].address}
                                        discount={getMaxDiscountForShop(doc.id, discountData)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            {discountData.length > 0 ? (
                <div>
                    <div className="w-full h-auto mt-4">
                        <h2 className="font-bold text-lg">{t('sidebar.preferential')}</h2>
                        <div className="bg-white shadow-sm shadow-stone-200 w-full rounded-lg mt-2">
                            <div className="flex flex-wrap mx-2 my-2">
                                {discountData.map((discount) => (
                                    <CardSellComponent
                                        key={discount.id}
                                        link={getShopInfo(discount.shopID, shops).shopName}
                                        image={getShopInfo(discount.shopID, shops).imageURL}
                                        title={discount.name}
                                        price={discount.amount}
                                        shopName={getShopInfo(discount.shopID, shops).name}
                                        startTime={convertFirestoreTimestamp(discount.startTime)}
                                        endTime={convertFirestoreTimestamp(discount.endTime)}
                                        timeRemaining={calculateTimeRemaining(discount.startTime, discount.endTime)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}
            {shopData.length === 0 && discountData.length === 0 ? (
                <div className="w-full mx-auto h-96 text-center">Không tìm thấy kết quả phù hợp.</div>
            ) : null}
        </div>
    );
};

function filterDiscountsByShopId(discounts, shopIds) {
    if (!Array.isArray(discounts) || discounts.length === 0 || !Array.isArray(shopIds) || shopIds.length === 0) {
        // Nếu danh sách giảm giá hoặc danh sách shopIds rỗng, trả về mảng rỗng.
        return [];
    }

    // Sử dụng filter để lọc qua danh sách giảm giá và chỉ giữ lại các mục có shopID nằm trong shopIds.
    const filteredDiscounts = discounts.filter((discount) => {
        return shopIds.includes(discount.shopID);
    });

    return filteredDiscounts;
}

export default ExploreDetail;
