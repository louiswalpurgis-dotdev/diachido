import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Select, MenuItem } from '@mui/material';
import { Input } from 'antd';
import { BsSearch } from 'react-icons/bs';

import CardSellComponent from '~/components/layout/card/cardSellComponent';
import CardShopComponent from '~/components/layout/card/cardShopComponent';
import { AppContext } from '~/Context/AppProvider';
import useFirestore from '~/hooks/useFirestore';
import useDocument from '~/hooks/useDocument';
import getCollection from '~/utils/getCollection';
import getShopInfo from '~/utils/getShopInfo';
import convertFirestoreTimestamp, { calculateTimeRemaining } from '~/utils/ConvertFirestoreTimeStamp';
import Debounce from '~/utils/debounce';
import { useTranslation } from 'react-i18next';
import filterDiscountsForShop from '~/utils/filterDiscountsForShop';
import getMaxDiscountForShop from '~/utils/getMaxDiscountForShop';
import { TabTitle } from '~/utils/generalFunctions';

const sortOptions = [
    {
        label: 'latest',
        value: '1',
    },
    {
        label: 'love',
        value: '2',
    },
    {
        label: 'follow',
        value: '3',
    },
];

const typeOptions = [
    {
        label: 'all',
        value: '1',
    },
    {
        label: 'store',
        value: '2',
    },
    {
        label: 'sale',
        value: '3',
    },
];

const Search = () => {
    const [t] = useTranslation('translation');
    TabTitle(t('sidebar.search'));

    const [sort, setSort] = useState('1');
    const [type, setType] = useState('1');
    const [shopData, setShopData] = useState([]);
    const [discountData, setDiscountData] = useState([]);
    const { location, searchData, setSearchData } = useContext(AppContext);

    // Lấy thông tin shop
    const shopCondition = useMemo(() => {
        return [
            {
                fieldName: 'locations',
                operator: 'array-contains',
                compareValue: { city: location },
            },
            {
                fieldName: 'isPublished',
                operator: '==',
                compareValue: true,
            },
            {
                fieldName: 'keywords',
                operator: 'array-contains',
                compareValue: searchData,
            },
        ];
    }, [location, searchData]);
    const { documents: shops } = useFirestore('shops', shopCondition);
    // Lấy thông tin collection thuộc shop
    const collectionIds = useMemo(() => {
        return shops.map((item) => item.collectionsID[0]);
    }, [shops]);
    const collections = useDocument('collections', collectionIds);

    const shopIds = useMemo(() => {
        return shops.map((item) => item.id);
    }, [shops]);
    // Lấy thông tin ưu đãi thuộc shop
    const discountsCondition = useMemo(() => {
        return {
            fieldName: 'shopID',
            operator: 'in',
            compareValue: shopIds,
        };
    }, [shopIds]);
    const { documents: allDiscounts } = useFirestore('discounts', discountsCondition);

    useEffect(() => {
        setShopData(shops);
    }, [shops]);

    useEffect(() => {
        setDiscountData(filterDiscountsForShop(allDiscounts));
    }, [allDiscounts]);

    const handleSortChange = (e) => {
        const sortType = e.target.value;
        setSort(sortType);
        switch (sortType) {
            case '1':
                setShopData(
                    shopData.sort((a, b) => {
                        return convertFirestoreTimestamp(b.createdAt) - convertFirestoreTimestamp(a.createdAt);
                    }),
                );
                break;
            case '2':
                setShopData(
                    shopData.sort((a, b) => {
                        return b.likersCount - a.likersCount;
                    }),
                );
                break;
            case '3':
                setShopData(
                    shopData.sort((a, b) => {
                        return b.followersCount - a.followersCount;
                    }),
                );
                break;
            default:
                setShopData(
                    shopData.sort((a, b) => {
                        return convertFirestoreTimestamp(b.createdAt) - convertFirestoreTimestamp(a.createdAt);
                    }),
                );
                break;
        }
    };
    const handleTypeChange = (e) => {
        setType(e.target.value);
    };

    const handleSearch = Debounce((searchValue) => {
        if (!searchData || searchValue === '') {
            return;
        }
        setSearchData(searchValue);
    }, 500);

    return (
        <div className="min-h-screen">
            <Breadcrumbs aria-label="breadcrumb" separator="›" className="flex items-center pt-2 lg:pt-0 xl:pt-0">
                <Link underline="hover" color="inherit" to="/">
                    DiaChoDo
                </Link>
                <Link underline="hover" className="text-black" to="/search" aria-current="page">
                    {searchData === '' ? t('sidebar.search') : `${t('search.searchDesc')} "${searchData}"`}
                </Link>
            </Breadcrumbs>
            <div className="flex justify-center items-center my-8">
                <div className="wh-full md:bg-white shadow-sm flex md:flex-row flex-col gap-2 items-center justify-center radiusButton">
                    <Input
                        placeholder={t('sidebar.search')}
                        size="large"
                        value={searchData}
                        onChange={(e) => {
                            handleSearch(e.target.value);
                        }}
                        type="text"
                        className="my-2 border-none outline-none cursor-pointer bg-white rounded-xl md:py-2 py-4"
                        prefix={<BsSearch />}
                        allowClear
                    />
                    <div className="flex items-center justify-center gap-x-2 mb-2 md:my-0">
                        <div className="ring-1 ring-slate-200 rounded-xl animation200 hover:scale-105">
                            <Select value={type} onChange={handleTypeChange} size="small" className="w-28" sx={{ border: 'none', '& fieldset': { border: 'none' } }}>
                                {typeOptions.map((option) => {
                                    let translateLabel = t(`search.type.${option.label}`);
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {translateLabel}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                        <div className="ring-1 ring-slate-200 rounded-xl animation200 hover:scale-105">
                            <Select value={sort} onChange={handleSortChange} size="small" className="w-28" sx={{ border: 'none', '& fieldset': { border: 'none' } }}>
                                {sortOptions.map((option) => {
                                    let translateLabel = t(`search.sort.${option.label}`);
                                    return (
                                        <MenuItem key={option.value} value={option.value}>
                                            {translateLabel}
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {shopData.length > 0 && (type === '1' || type === '2') ? (
                    <div className="w-full h-auto mt-4">
                        <h2 className="font-bold text-lg mb-4">{t('store')}</h2>
                        <div className="bg-white shadow-sm shadow-stone-200 rounded-lg w-full h-auto py-6 radiusFill gap-4 flex">
                            <div className="flexStart gap-6 px-7 flex-wrap mt-8">
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
                                        shopDetail={doc}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
            {discountData.length > 0 && (type === '1' || type === '3') ? (
                <div className="w-full h-auto my-4">
                    <h2 className="font-bold text-lg">{t('sale.offer')}</h2>
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
            ) : null}
            {discountData.length === 0 && shopData.length === 0 ? <div className="flex justify-center items-center w-full h-96">{t('search.noResult')}</div> : null}
        </div>
    );
};

export default Search;
