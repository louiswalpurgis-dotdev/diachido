import React, { Suspense, lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import checkUserRole from '../utils/checkUserRole';
import paths from '../configs/paths';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Dashboard from '../pages/Dashboard';
import { Spinner } from '@nextui-org/react';
const Users = lazy(() => import('../pages/Users'));
const Admin = lazy(() => import('../pages/Admin'));
const AddStore = lazy(() => import('../pages/AddStore'));
const AddDiscount = lazy(() => import('../pages/AddDiscount'));
const Stores = lazy(() => import('../pages/Stores'));
const Discounts = lazy(() => import('../pages/Discounts'));
const Comments = lazy(() => import('../pages/Comments'));
const Notification = lazy(() => import('../pages/Notification'));
const CreatedStores = lazy(() => import('../pages/CreatedStores'));
const CreatedDiscounts = lazy(() => import('../pages/CreatedDiscounts'));
const StoreKiemDuyet = lazy(() => import('../pages/KiemDuyet/Store'));
const DiscountKiemDuyet = lazy(() => import('../pages/KiemDuyet/Discount'));
const Banners = lazy(() => import('../pages/Banners'));
const Collections = lazy(() => import('../pages/Collections'));

const routes = [
    {
        path: paths.home,
        component: Home,
        role: ['admin', 'moderator', 'author'],
    },
    {
        path: paths.users,
        component: Users,
        role: ['admin'],
    },
    {
        path: paths.admin,
        component: Admin,
        role: ['admin'],
    },
    {
        path: paths.dashboard,
        component: Dashboard,
        role: ['admin', 'moderator', 'author'],
    },
    {
        path: paths.addStore,
        component: AddStore,
        role: ['admin', 'moderator', 'author'],
    },
    {
        path: paths.stores,
        component: Stores,
        role: ['admin'],
    },
    {
        path: paths.addDiscount,
        component: AddDiscount,
        role: ['admin', 'moderator', 'author'],
    },
    {
        path: paths.discounts,
        component: Discounts,
        role: ['admin'],
    },
    {
        path: paths.comments,
        component: Comments,
        role: ['admin'],
    },
    {
        path: paths.notification,
        component: Notification,
        role: ['admin'],
    },
    {
        path: paths.banners,
        component: Banners,
        role: ['admin'],
    },
    {
        path: paths.createdStores,
        component: CreatedStores,
        role: ['author', 'moderator'],
    },
    {
        path: paths.createdDiscounts,
        component: CreatedDiscounts,
        role: ['author', 'moderator'],
    },
    {
        path: paths.storeKiemDuyet,
        component: StoreKiemDuyet,
        role: ['moderator', 'admin'],
    },
    {
        path: paths.discountKiemDuyet,
        component: DiscountKiemDuyet,
        role: ['moderator', 'admin'],
    },
    {
        path: paths.collections,
        component: Collections,
        role: ['admin'],
    },
];

const renderRoutes = (userRole) => {
    if (!userRole) return <Route path="/" element={<Navigate to={paths.home} replace="true" />} />;
    return routes.map((route, index) => {
        const Page = route.component;
        const isAllowed = checkUserRole(userRole, route.role);
        return (
            <Route
                key={index}
                path={route.path}
                exact
                element={
                    isAllowed ? (
                        <Layout>
                            <Suspense fallback={<Spinner />}>
                                <Page />
                            </Suspense>
                        </Layout>
                    ) : (
                        <Navigate to={paths.dashboard} replace="true" />
                    )
                }
            />
        );
    });
};

export default renderRoutes;
