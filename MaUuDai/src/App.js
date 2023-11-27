import { useEffect } from 'react';
import { Routes, Route, BrowserRouter, useLocation } from 'react-router-dom';
import { Layout } from 'antd';

import AuthProvider from '~/Context/AuthProvider';
import AppProvider from './Context/AppProvider';

import routers from './routes';
import Header from '~/components/layout/header/header';
import Sidebar from './components/layout/sidebar';
import Footer from './components/layout/footer';
import BackToTop from './components/layout/backToTop';
import Hotline from './components/layout/hotline';
import ReactGA from 'react-ga4';
import Helmets from './components/helmet/Helmets';
import { IconSvg } from './components/constant';
function ScrollToTop() {
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);
    return null;
}

ReactGA.initialize([
    {
        trackingId: process.env.TRACKING_ID,
    },
    {
        trackingId: process.env.FIREBASE_TRACKING_ID,
    },
]);

ReactGA.send({
    hitType: 'pageview',
    page: window.location.pathname,
    title: document.title,
});

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppProvider>
                    <ScrollToTop />
                    <Helmets image={IconSvg.logo} description="Tìm kiếm ưu đãi, giảm giá tại các cửa hàng gần bạn!" />
                    <Layout className="bg-gray-50 md:min-w-[800px] px-0 md:px-14 lg:px-20">
                        <Header />
                        <Layout className="bg-gray-50 px-2 md:px-0">
                            <Layout.Sider
                                width={240}
                                className="w-0 hidden lg:w-64 lg:block mr-10 min-w-screen overflow-y-auto rounded-lg shadow-sm shadow-slate-200"
                                style={{ backgroundColor: '#f9fafb' }}
                            >
                                <Sidebar />
                            </Layout.Sider>
                            <Layout.Content>
                                <Routes>
                                    {routers.map((route, index) => {
                                        const Page = route.component;
                                        return <Route key={index} path={route.path} element={<Page />} />;
                                    })}
                                </Routes>
                            </Layout.Content>
                        </Layout>
                    </Layout>
                    <div className="fixed bottom-10 md:right-10 right-4 z-50">
                        <div className="flex flex-col items-end justify-center gap-2">
                            <Hotline />
                            <BackToTop />
                        </div>
                    </div>
                    <Footer css={'px-4 md:px-14 lg:px-20'} />
                </AppProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
