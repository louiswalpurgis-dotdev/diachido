import React, { useMemo, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';
import useFirestore from '~/hooks/useFirestore';
import { IconSvg } from '~/components/constant';
import { useTranslation } from 'react-i18next';
import { TabTitle } from '~/utils/generalFunctions';
const Explore = () => {
    const [t] = useTranslation('translation');
    TabTitle(t('sidebar.explore'));
    const { documents: collections } = useFirestore('collections');
    const collectionIds = useMemo(() => collections.map(({ id }) => id), [collections]);
    const collectionConditions = useMemo(
        () => ({
            field: 'collectionsID',
            operator: 'in',
            value: collectionIds,
        }),
        [collectionIds],
    );
    const { documents: shops } = useFirestore('shops', collectionConditions);
    const shopIds = useMemo(() => shops.flatMap((shop) => shop.id), [shops]);
    const discountConditions = useMemo(
        () => ({
            field: 'shopID',
            operator: 'in',
            value: shopIds,
        }),
        [shopIds],
    );
    const { documents: discounts } = useFirestore('discounts', discountConditions);

    const [collectionDiscountCounts, setCollectionDiscountCounts] = useState([]);
    useEffect(() => {
        // Chỉ tính toán collectionDiscountCounts khi dữ liệu đã sẵn sàng
        if (collections.length > 0 && discounts.length > 0 && shopIds.length > 0) {
            const calculatedCounts = collections.map((collection) => {
                const discountsInCollection = discounts.filter((discount) => shopIds.includes(discount.shopID));
                return {
                    collection: collection,
                    discountCount: discountsInCollection.length,
                };
            });

            setCollectionDiscountCounts(calculatedCounts); // Gán giá trị mới vào state
        }
    }, [collections, discounts, shopIds]);
    return (
        <div className="min-h-screen">
            <Breadcrumbs aria-label="breadcrumb" separator="›" className="flex items-center pt-2 lg:pt-0 xl:pt-0">
                <Link underline="hover" color="inherit" to="/">
                    DiaChiDo
                </Link>
                <Link underline="hover" className="text-black" to="/explore" aria-current="page">
                    {t('sidebar.explore')}
                </Link>
            </Breadcrumbs>
            {/* Category */}

            <div className=" flex flex-wrap w-full">
                {collectionDiscountCounts.map(({ collection, discountCount }) => {
                    const translatedName = t(`category.${collection.collectionName}`);
                    return (
                        <Link
                            to={`/explore/${collection.collectionName}`}
                            key={collection.id}
                            className="w-calc mx-2 my-2"
                        >
                            <figure
                                v-for="image in images"
                                className="[break-inside:avoid] p-2 bg-white radiusFill shadow-lg shadow-slate-200/60"
                            >
                                <div className="group relative flex flex-col rounded-2xl transition duration-200">
                                    <div className="relative w-full h-28 md:h-32 overflow-hidden rounded-xl animation200">
                                        {/* <!-- Image --> */}
                                        <img
                                            src={`${collection.imageURL}`}
                                            className="pointer-events-none wh-full object-cover object-center animation200 group-hover:scale-105"
                                            alt={translatedName}
                                        />
                                        {/* <!-- Overlay --> */}
                                        <div className="absolute inset-0 md:group-hover:bg-gradient-to-t from-black/60 to-transparent pointer-events-none transition duration-500">
                                            <div className="flex h-full bg-white/40 px-3 py-4 flex-col justify-between">
                                                <div className="flexStart">
                                                    <div className="inline-block backdrop-blur rounded-full md:px-4 px-2 py-0.5 md:py-1">
                                                        <div className="flexStart max-w-24 gap-x-2 text-gray-800 font-semibold">
                                                            <img
                                                                src={IconSvg.collection}
                                                                className="h-3 w-3 md:h-4 md:w-4"
                                                                alt=""
                                                            />
                                                            <span className="w-full flex items-center gap-x-1 text-[0.7rem] md:text-[0.9rem] animation200">
                                                                {discountCount}+
                                                                <p className="truncate">{translatedName}</p>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="md:group-hover:block hidden">
                                                    <div className="flexCenter gap-2">
                                                        <p className="text-white font-semibold text-[0.8rem] truncate">
                                                            {collection.description}
                                                        </p>
                                                        <div className="flexCenter flex-shrink-0 p-1.5 radiusFull bg-white/60 animation200">
                                                            <img src={IconSvg.rightParol} className="h-3 w-3" alt="" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </figure>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Explore;
