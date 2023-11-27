import React from 'react';
import { Link } from 'react-router-dom';
import { IconSvg, footerLinks } from '~/components/constant';
import { useTranslation } from 'react-i18next';

const FooterColumn = ({ title, links }) => {
    const [t] = useTranslation('translation');
    let translateTitle = t(`footer.${title}`);
    return (
        <div className="footer_column">
            <h4 className="font-semibold">{translateTitle}</h4>
            <ul className="flex flex-col gap-2 font-normal">
                {links.map((link, index) => {
                    let translateText = t(`footer.${link.text}`);
                    return (
                        <Link
                            to={link.url}
                            key={index}
                            className="hover:text-blue-400 hover:underline underline-offset-1"
                        >
                            {translateText}
                        </Link>
                    );
                })}
            </ul>
        </div>
    );
};

const Footer = ({ css }) => {
    const [t] = useTranslation('translation');
    return (
        <section className={`${css} footer flex items-center justify-between md:px-16 lg:px-24 py-3 bg-gray-50`}>
            <div className="flex md:flex-row flex-col items-center gap-12 w-full">
                <div className="flex items-center md:items-start justify-center flex-col">
                    <img
                        className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70]"
                        src={IconSvg.logo}
                        alt="Logo"
                        width={130}
                        height={50}
                    />

                    <p className="text-start text-sm font-normal mt-5 max-w-xs">{t('slogan')}</p>
                </div>
                <div className="wh-full flex justify-center">
                    <div className="flex flex-wrap gap-6 md:gap-12">
                        <FooterColumn title={footerLinks[0].title} links={footerLinks[0].links} />
                        <div className="flex-1 flex flex-col gap-4">
                            <FooterColumn title={footerLinks[1].title} links={footerLinks[1].links} />
                        </div>
                        <FooterColumn title={footerLinks[2].title} links={footerLinks[2].links} />
                    </div>
                </div>
            </div>

            <div className="flexBetween w-full flex-col md:flex-row lg:flex-row xl:flex-row">
                <p>{t('footer.reserved')}</p>
                <p className="text-gray-800">
                    {t('footer.makeBy')}
                    <span className=" font-semibold">Địa chỉ đỏ</span>
                </p>
            </div>
        </section>
    );
};

export default Footer;
