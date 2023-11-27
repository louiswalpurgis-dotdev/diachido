import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '@mui/material';
import { BiSolidCity } from 'react-icons/bi';
import { TbExternalLink } from 'react-icons/tb';
import { useTranslation } from 'react-i18next';
import { TabTitle } from '~/utils/generalFunctions';
const AllAreas = () => {
    const [t] = useTranslation('translation');
    TabTitle(t('area.name'));
    return (
        <div className="min-h-screen">
            {/* Chỉ mục trang */}
            <Breadcrumbs aria-label="breadcrumb" separator="›" className="flex items-center pt-2 lg:pt-0 xl:pt-0">
                <Link underline="hover" color="inherit" to="/">
                    DiaChiDo
                </Link>
                <Link underline="hover" color="inherit" to="/allAreas/">
                    {t('area.name')}
                </Link>
            </Breadcrumbs>
            {/* Hiện thị tât cả cửa hàng */}
            <div className="w-full bg-gray-100 rounded-lg my-2 h-auto">
                <Link to="/area/danang">
                    <figure v-for="image in images" className="[break-inside:avoid]">
                        <div className="hover:bg-active/10 group relative flex flex-col gap-y-2 rounded-2xl transition duration-200">
                            <div className="relative overflow-hidden rounded-xl">
                                <img
                                    src="https://th.bing.com/th/id/R.53514b003101c8672ee1ebba8ac4b70d?rik=JOpmbTWWMSQQ%2fg&pid=ImgRaw&r=0"
                                    className="pointer-events-none h-48 w-full object-cover object-center transition duration-200 group-hover:scale-105"
                                    alt="Đà Nẵng"
                                />
                                {/* <!-- Overlay --> */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
                                    <div className="flex h-full bg-white/40 px-3 py-4 flex-col justify-between">
                                        <div className="flex items-center justify-between">
                                            <div className="inline-block bg-black/80 rounded-full px-4 py-1">
                                                <div className="flex items-center gap-x-2 text-white">
                                                    <BiSolidCity size={20} />
                                                    <span className="flex items-center gap-x-1">Đà Nẵng</span>
                                                </div>
                                            </div>
                                            <TbExternalLink size={20} />
                                        </div>
                                        <p className="text-gray-800 font-bold text-lg line-clamp-2">
                                            Thành phố đáng sống nhất Việt Nam
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </figure>
                </Link>
            </div>
        </div>
    );
};

export default AllAreas;
