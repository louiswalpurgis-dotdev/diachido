import { Tooltip } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { IconSvg } from '~/components/constant';
import formatPrice from '~/utils/formatPrice';

const CardSellComponent = ({ image, shopName, price, title, startTime, endTime, link, timeRemaining }) => {
    const [t] = useTranslation('translation');
    price = formatPrice(price);
    return (
        <Tooltip title={`${shopName} ${t('discount.sale')} ${price} ${t('discount.for')} ${title}`} placement="top">
            <Link to={`/store/${link}`} className="w-calc max-w-3xl mx-2 my-2">
                <section className="group flex wh-full text-zinc-900 cursor-pointer">
                    <div className="flex wh-full flex-grow flex-col radiusFill bgColor border border-white px-6 py-2 overflow-hidden">
                        {/* TITLE */}
                        <div className="mb-1 flex w-full items-start justify-between">
                            <div className="flex flex-col items-start overflow-hidden">
                                <p className="font-semibold truncate group-hover:underline">{shopName}</p>
                                <span className="flexStart gap-x-1">
                                    <img src={IconSvg.product} alt="" className="w-2.5 h-2.5" />
                                    <p className="text-[0.7rem] truncate">
                                        <strong>{title}</strong>
                                    </p>
                                </span>
                                <span className="flexStart gap-x-1">
                                    <img src={IconSvg.sale} alt="" className="w-2.5 h-2.5" />
                                    <p className="text-[0.7rem] truncate">
                                        Giảm&nbsp;
                                        <strong>{price}</strong>
                                    </p>
                                </span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-7 h-7 radiusFull overflow-hidden group-hover:scale-110 animation200">
                                    <img src={image} alt="" className="object-cover wh-full" />
                                </div>
                            </div>
                        </div>
                        <div className="relative flex items-center justify-between w-full border-[1px] border-dashed border-zinc-50 animation200">
                            <div className="absolute -left-12 h-10 w-10 rounded-full bg-white"></div>
                            <div className="absolute -right-12 group-hover:-right-20 animation200 h-10 w-10 rounded-full bg-white"></div>
                        </div>
                        {/* TIME TICKET */}
                        <div className="mt-1 flex flex-col w-full">
                            <div className="flex flex-col text-[0.7rem]">
                                <span className="text-zinc-400 flex-shrink-0">Hoạt động</span>
                                <p className="truncate">
                                    {startTime}&nbsp;&ndash;&nbsp;{endTime}
                                </p>
                            </div>
                            <div className="flex items-center justify-start text-[0.7rem]">
                                <span className="text-zinc-400 flex-shrink-0">Thời gian còn lại:</span>&nbsp;
                                <p className="truncate">{timeRemaining} ngày</p>
                            </div>
                        </div>
                    </div>
                </section>
            </Link>
        </Tooltip>
    );
};

export default CardSellComponent;
