import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Select, MenuItem } from '@mui/material';
import CardShopComponent from '~/components/layout/card/cardShopComponent';
import useFirestore from '~/hooks/useFirestore';
import { AppContext } from '~/Context/AppProvider';
import useDocument from '~/hooks/useDocument';
import getCollection from '~/utils/getCollection';
import useLocationFilter from '~/utils/useLocationFilter';
import { Button, message } from 'antd';
import { useTranslation } from 'react-i18next';
import getMaxDiscountForShop from '~/utils/getMaxDiscountForShop';
import { TabTitle } from '~/utils/generalFunctions';

const Stores = () => {
    const [t] = useTranslation('translation');
    TabTitle(t('store'));

    const { location, sortOptions, districtOptions, sort, district, setDistrict, discounts } = useContext(AppContext);
    const [limitShops, setLimitShops] = useState(20);
    const [loading, setLoading] = useState(false);
    const shopsCondition = useMemo(() => {
        return {
            fieldName: 'locations',
            operator: 'array-contains',
            compareValue: { city: location },
        };
    }, [location]);
    const { documents: shops, loadMore } = useFirestore('shops', shopsCondition, 20);
    const shopIds = useMemo(() => {
        return shops.map((shop) => shop.collectionsID[0]);
    }, [shops]);
    const collections = useDocument('collections', shopIds);

    const { shopData, setShopData, handleSortChange, handleDistrictChange } = useLocationFilter(shops, null);
    useEffect(() => {
        if (shops.length > 0) {
            setShopData(shops);
            handleDistrictChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shops]);
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
    return (
        <div className="min-h-screen">
            {/* Chỉ mục trang */}
            <Breadcrumbs aria-label="breadcrumb" separator="›" className="flex items-center pt-2 lg:pt-0 xl:pt-0">
                <Link underline="hover" color="inherit" to="/">
                    DiaChiDo
                </Link>
                <Link underline="hover" className="text-black" to="/stores/">
                    {t('store')}
                </Link>
            </Breadcrumbs>
            {/* Filter */}
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
                                        {translatedSort}
                                    </MenuItem>
                                );
                            })}
                        </Select>
                    </div>
                </div>
            </div>
            {/* Hiện thị tât cả cửa hàng */}
            {shopData.length > 0 ? (
                <div className="w-full h-auto my-2">
                    <div className=" shadow-stone-200 rounded-lg bg-white shadow-sm min-w-full h-auto radiusFill gap-4 flex items-center px-2 md:px-6 py-10 md:py-12">
                        <div className="gap-y-14 gap-x-6 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5">
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
                                    discount={getMaxDiscountForShop(doc.id, discounts)}
                                    shopDetail={doc}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center">{t('noresult')}</div>
            )}
            {limitShops < shopData.length && shopData.length > 0 && (
                <div className="flex justify-center items-center">
                    <Button
                        type="text"
                        loading={loading}
                        onClick={() => {
                            handleLoading();
                            setLimitShops((prev) => prev + 8);
                        }}
                        className="mb-2"
                    >
                        {loading ? t('status.loading') : t('status.loadmore')}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Stores;
