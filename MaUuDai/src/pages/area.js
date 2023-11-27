import React, { useContext, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs, Select, MenuItem } from '@mui/material';

import CardShopComponent from '~/components/layout/card/cardShopComponent';
import { AppContext } from '~/Context/AppProvider';
import useFirestore from '~/hooks/useFirestore';
import getCollection from '~/utils/getCollection';
import useDocument from '~/hooks/useDocument';
import useLocationFilter from '~/utils/useLocationFilter';
import { useTranslation } from 'react-i18next';
import getMaxDiscountForShop from '~/utils/getMaxDiscountForShop';
import { TabTitle } from '~/utils/generalFunctions';

const Area = () => {
    const [t] = useTranslation('translation');
    const { location } = useContext(AppContext);
    TabTitle(t('area.name'));
    const { sortOptions, districtOptions, sort, district, setDistrict, discounts } = useContext(AppContext);

    const shopsCondition = useMemo(() => {
        return {
            fieldName: 'locations',
            operator: 'array-contains',
            compareValue: { city: location },
        };
    }, [location]);
    const { documents: shops } = useFirestore('shops', shopsCondition);
    const collectionIds = useMemo(() => {
        return shops.map((item) => item.collectionsID[0]);
    }, [shops]);
    const collections = useDocument('collections', collectionIds);

    const { shopData, setShopData, handleSortChange, handleDistrictChange } = useLocationFilter(shops, null);

    useEffect(() => {
        if (shops) {
            setShopData(shops);
            handleDistrictChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [shops]);
    return (
        <div className="min-h-screen">
            <Breadcrumbs aria-label="breadcrumb" separator="›" className="flex items-center pt-2 lg:pt-0 xl:pt-0">
                <Link underline="hover" color="inherit" to="/">
                    DiaChiDo
                </Link>
                <Link underline="hover" color="inherit" to="/allAreas">
                    {t('area.name')}
                </Link>
                <Link underline="hover" className="text-black" to="/area/danang" aria-current="page">
                    {location}
                </Link>
            </Breadcrumbs>
            <div className="my-4 w-full flex justify-center">
                <h1 className="font-bold md:text-9xl text-6xl">{location}</h1>
            </div>
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
                                let translateLabel = t(`sort.${option.label}`);
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
            <div>
                <div className="w-full h-auto mt-4">
                    {shopData.length > 0 ? (
                        <div className="bg-white shadow-sm shadow-stone-200 rounded-lg w-full h-auto py-6 radiusFill gap-4 flex">
                            <div className="flexStart pt-4 gap-6 pl-4 md:px-7 flex-wrap">
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
                    ) : (
                        <div className="w-full mx-auto h-96 text-center">{t('noresult')}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Area;
