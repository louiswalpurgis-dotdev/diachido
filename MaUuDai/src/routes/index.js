import paths from '~/config/path';

import Home from '~/pages/home';
import About from '~/pages/about';
import Contact from '~/pages/contact';
import Stores from '~/pages/stores';
import Detail from '~/pages/detailShop';
import Search from '~/pages/search';
import Area from '~/pages/area';
import AllAreas from '~/pages/allAreas';
import Explore from '~/pages/explore';
import ExploreDetail from '~/pages/exploreDetail';
import Saved from '~/pages/saved';
import NotificationDetai from '~/pages/notificationDetail';
import Error from '~/pages/error';

const routers = [
    {
        path: paths.home,
        component: Home,
    },
    {
        path: paths.about,
        component: About,
    },
    {
        path: paths.contact,
        component: Contact,
    },
    {
        path: paths.stores,
        component: Stores,
    },
    {
        path: paths.detail,
        component: Detail,
    },
    {
        path: paths.search,
        component: Search,
    },
    {
        path: paths.searchWithParam,
        component: Search,
    },
    {
        path: paths.area,
        component: Area,
    },
    {
        path: paths.allAreas,
        component: AllAreas,
    },
    {
        path: paths.explore,
        component: Explore,
    },
    {
        path: paths.exploreDetail,
        component: ExploreDetail,
    },
    {
        path: paths.saved,
        component: Saved,
    },
    {
        path: paths.notification,
        component: NotificationDetai,
    },
    {
        path: paths.error,
        component: Error,
    },
];

export default routers;
