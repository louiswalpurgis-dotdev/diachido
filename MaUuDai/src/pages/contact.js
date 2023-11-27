import { Breadcrumbs } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { TabTitle } from '~/utils/generalFunctions';

function Contact() {
    const [t] = useTranslation('translation');
    TabTitle(t('contact.name'));
    return (
        <div className="w-full h-full min-h-screen">
            {/* Chỉ mục trang */}
            <Breadcrumbs aria-label="breadcrumb" separator="›" className="flex items-center pt-2 lg:pt-0 xl:pt-0">
                <Link underline="hover" color="inherit" to="/">
                    DiaChiDo
                </Link>
                <Link underline="hover" className="text-black" to="/about" aria-current="page">
                    {t('contact.name')}
                </Link>
            </Breadcrumbs>
            <div className=" flex justify-center h-fit mt-4">
                <div className=" rounded-lg bg-white max-w-2xl p-8 text-base shadow-sm shadow-store-200">
                    <p className="font-bold text-red-500">
                        <span className="text-black uppercase">{t('contact.title1')}</span> {t('url')}
                    </p>
                    <p className="mt-4 text-base text-justify">
                        <span className="text-red-500">{t('url')} </span>
                        {t('contact.description1')}
                    </p>
                    <p className="mt-4 text-base text-justify">
                        <span className="text-red-500">{t('url')} </span>
                        {t('contact.description2')}
                    </p>
                    <p className="mt-4 text-base text-justify">{t('contact.description3')}</p>
                    <p className="font-bold mt-4 uppercase">{t('contact.title2')}</p>
                    <p className="mt-4">
                        <ol className="list-decimal list-inside text-base space-y-1">
                            <li>{t('contact.subtitle1')}</li>
                            <ul className="list-disc list-inside ml-4">
                                <li>{t('contact.element1sub1')}</li>
                                <li>{t('contact.element2sub1')}</li>
                                <li>{t('contact.element3sub1')}</li>
                            </ul>
                            <li>{t('contact.subtitle2')}</li>
                            <li>{t('contact.subtitle3')}</li>
                            <li>{t('contact.subtitle4')}</li>
                        </ol>
                    </p>
                    <div className="mt-4 text-base">
                        <p className="uppercase font-bold mb-4">{t('contact.title3')}</p>
                        {t('contact.nameContact')}
                        <p>
                            {t('contact.phoneTitle')}: {t('contact.phone')}
                        </p>
                        <p>
                            {t('contact.emailTitle')}: <i>{t('contact.email')}</i>
                        </p>
                    </div>
                    <p className="mt-4">{t('contact.thanks')}</p>
                </div>
            </div>
        </div>
    );
}

export default Contact;
