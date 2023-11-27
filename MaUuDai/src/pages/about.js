import { Breadcrumbs } from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { db } from '~/firebase/config';
import { AiOutlineRight } from 'react-icons/ai';
import { useTranslation } from 'react-i18next';
import { TabTitle } from '~/utils/generalFunctions';

function About() {
    const [t] = useTranslation('translation');
    const [shopsCount, setShopsCount] = useState(0);
    const [commentsCount, setCommentsCount] = useState(0);
    const [discountsCount, setDiscountsCount] = useState(0);
    const [usersCount, setUsersCount] = useState(0);
    TabTitle(t('about.name'));
    useEffect(() => {
        const fetchData = async () => {
            const collections = [
                { name: 'shops', stateSetter: setShopsCount },
                { name: 'comments', stateSetter: setCommentsCount },
                { name: 'discounts', stateSetter: setDiscountsCount },
                { name: 'users', stateSetter: setUsersCount },
            ];

            const promises = collections.map(async (collectionObj) => {
                const ref = collection(db, collectionObj.name);
                const querySnapshot = await getDocs(ref);
                const count = querySnapshot.size;
                collectionObj.stateSetter(count);
            });

            await Promise.all(promises);
        };

        fetchData();
    }, []);
    return (
        <div className="w-full h-full min-h-fit">
            {/* Chỉ mục trang */}
            <Breadcrumbs aria-label="breadcrumb" separator="›" className="flex items-center pt-2">
                <Link underline="hover" color="inherit" to="/">
                    DiaChiDo
                </Link>
                <Link underline="hover" className="text-black" to="/about" aria-current="page">
                    {t('about.name')}
                </Link>
            </Breadcrumbs>
            <div className=" flex justify-center h-auto mt-4">
                <div className="h-full rounded-lg shadow-sm shadow-stone-200 bg-white w-full md:min-w-[600px] pt-4">
                    <h2 className="text-4xl text-center font-bold text-red-500">Địa Chỉ Đỏ</h2>
                    <p className="text-center mt-2 text-gray-600 text-lg px-2 md:px-0">{t('slogan')}</p>
                    <div className="flex mx-auto items-center justify-between mt-8 px-8">
                        <div className="text-center">
                            <p>
                                <span className="text-xl font-semibold">{shopsCount}</span>+
                            </p>
                            <p className="text-sm font-light">{t('about.store')}</p>
                        </div>
                        <div className="text-center">
                            <p>
                                <span className="text-xl font-semibold">{commentsCount}</span>+
                            </p>
                            <p className="text-sm font-light">{t('about.comment')}</p>
                        </div>
                        <div className="text-center">
                            <p>
                                <span className="text-xl font-semibold">{discountsCount}</span>+
                            </p>
                            <p className="text-sm font-light">{t('about.sale')}</p>
                        </div>
                        <div className="text-center">
                            <p>
                                <span className="text-xl font-semibold">{usersCount}</span>+
                            </p>
                            <p className="text-sm font-light">{t('about.user')}</p>
                        </div>
                    </div>
                    <hr className="mt-8"></hr>
                    <div className="flex flex-col justify-center">
                        <Link className=" px-8 group  mt-8" to="/stores">
                            <p className="flex items-center font-bold text-2xl text-gray-700 group-hover:text-blue-600">
                                {t('about.store')}
                                <span className="transition-transform transform group-hover:translate-x-1">
                                    <AiOutlineRight size={20} className="mt-1" />
                                </span>
                            </p>
                            <p className="text-gray-600 text-base group-hover:text-blue-600 border-b-2 pb-4">
                                {t('about.storeDecs')}
                            </p>
                        </Link>
                        <Link className=" px-8 group mt-8" to="/search">
                            <p className="flex items-center font-bold text-2xl text-gray-700 group-hover:text-blue-600">
                                {t('about.search')}
                                <span className="transition-transform transform group-hover:translate-x-1">
                                    <AiOutlineRight size={20} className="mt-1" />
                                </span>
                            </p>
                            <p className="text-gray-600 text-base group-hover:text-blue-600 border-b-2 pb-4">
                                {t('about.searchDecs')}
                            </p>
                        </Link>
                        <Link className=" px-8 group mt-8" to="/search">
                            <p className="flex items-center font-bold text-2xl text-gray-700 group-hover:text-blue-600">
                                {t('about.category')}
                                <span className="transition-transform transform group-hover:translate-x-1">
                                    <AiOutlineRight size={20} className="mt-1" />
                                </span>
                            </p>
                            <p className="text-gray-600 text-base group-hover:text-blue-600 border-b-2 pb-4">
                                {t('about.categoryDecs')}
                            </p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default About;
