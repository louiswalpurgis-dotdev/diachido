import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '~/firebase/config';
import { AuthContext } from '~/Context/AuthProvider';

import { Drawer } from 'antd';
import { useTranslation } from 'react-i18next';
import { Modal, Fade, Backdrop, Box } from '@mui/material';

import { IconSvg } from '~/components/constant';
import { MapMarker, Notification, UserMenu, Language } from './index';

import Login from '~/components/layout/Login';
import { AppContext } from '~/Context/AppProvider';
import Sidebar from '~/components/layout/sidebar';

function Header() {
    const [t] = useTranslation('translation');
    const [open, setOpen] = useState(false);
    const location = useLocation();
    const { openSideBar, setOpenSideBar } = useContext(AppContext);
    const {
        user: { displayName, photoURL, uid, point },
    } = useContext(AuthContext);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleLogout = async () => {
        await signOut(auth);
        setOpen(false);
    };

    // Kiểm tra nếu tại trang search thì ẩn ô tìm kiếm
    const pathName = location.pathname.split('/')[1];
    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur transition-colors duration-500 px-4 md:px-0">
            {/* CONTEXT HEADER */}
            <div className="relative flexBetween h-[4rem] border-b border-slate-900/10 lg:mx-0 lg:border-0">
                <div className="flexCenter gap-x-4">
                    {/* LOGO */}
                    <div className="sm:mr-6 flexStart gap-x-2">
                        <button onClick={() => setOpenSideBar(true)} type="button" className="lg:hidden flexCenter radiusButton ring-1 ring-slate-200 animation200 hover:scale-105">
                            <img src={IconSvg.menu} alt="" className="w-5 h-5 my-0.5" />
                        </button>
                        <Link to="/" className="hidden sm:flex">
                            <img src={IconSvg.logo} alt="" className="h-6" />
                        </Link>
                    </div>
                    {/* BUTTON-SEARCH */}
                    <div className="flex items-center gap-x-10 text-sm font-semibold leading-6 text-slate-700">
                        {/* MAP_MARKER */}
                        <MapMarker t={t} />
                        {/* SEARCH BTN */}
                        {pathName === 'search' ? null : (
                            <Link
                                to="/search"
                                className="cursor-pointer wh-full focus-within:bg-white/70 hidden lg:flex gap-x-2 items-center justify-center radiusButton ring-1 ring-slate-200 animation200 hover:scale-105"
                            >
                                <span className="font-semibold text-sm py-0.5 pr-20 text-gray-400">{`${t('header.search')}...`}</span>
                                <lord-icon src="https://cdn.lordicon.com/xfftupfv.json" trigger="hover" style={{ width: '1rem', height: '1rem' }}></lord-icon>
                            </Link>
                        )}
                    </div>
                </div>
                {/* RIGHT NAVBAR */}
                <div className="relative flexCenter">
                    {/* Đăng nhập */}
                    {uid ? (
                        ''
                    ) : (
                        <>
                            {/* LOGIN */}
                            <button onClick={handleOpen} className="md:ml-4 inline-flex items-center justify-between transition duration-200 hover:scale-105">
                                <span className="text-sm font-semibold textColorTwice">{t('header.login')}</span>
                            </button>
                            <Modal
                                aria-labelledby="transition-modal-title"
                                aria-describedby="transition-modal-description"
                                open={open}
                                className="backdrop-blur"
                                onClose={handleClose}
                                closeAfterTransition={false}
                                slots={{ backdrop: Backdrop }}
                                slotProps={{
                                    backdrop: {
                                        timeout: 500,
                                    },
                                }}
                            >
                                <Fade in={open}>
                                    <Box className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-400 bg-gray-100 px-20 py-10 rounded-lg">
                                        <div className="w-full h-16 flexCenter">
                                            <img src={IconSvg.logo} alt="logo" className="wh-full" />
                                        </div>
                                        <h2 className="font-medium">{t('header.loginSocial')}</h2>
                                        <Login />
                                    </Box>
                                </Fade>
                            </Modal>
                            {/* END - LOGIN */}
                        </>
                    )}
                    <nav className={`${uid ? '' : 'border-l border-slate-200 ml-4'} text-sm font-semibold leading-6 text-slate-700`}>
                        <ul className="flex items-center space-x-4">
                            <li className={`${uid ? 'mr-4' : 'ml-4'}`}>
                                {/* LANGUAGES */}
                                <Language />
                            </li>
                        </ul>
                    </nav>
                    <div className="flex items-center gap-x-4">
                        {/* USER */}
                        {uid ? (
                            <>
                                {/* NOTIFICATION */}
                                <Notification />
                                {/* PROFILE */}
                                <UserMenu displayName={displayName} photoURL={photoURL} point={point} handleLogout={handleLogout} />
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                </div>
            </div>
            {/* END - CONTEXT HEADER */}
            <Drawer
                placement="left"
                title={
                    <div className="flexBetween">
                        <Link to="/" className="w-32">
                            <img src={IconSvg.logo} alt="logo" className="wh-full" />
                        </Link>
                        <button type="button" onClick={() => setOpenSideBar(false)} className="flexCenter">
                            <span className="sr-only">Close</span>
                            <lord-icon src="https://cdn.lordicon.com/nhfyhmlt.json" trigger="hover" style={{ width: '1.2rem', height: '1.2rem' }}></lord-icon>
                        </button>
                    </div>
                }
                open={openSideBar}
                onClose={() => setOpenSideBar(false)}
                closeIcon={null}
                className="lg:hidden"
                width={320}
            >
                <Sidebar />
            </Drawer>
            {/* END - MOBILE HEADER REPINSIVE */}
        </header>
    );
}

export default Header;
