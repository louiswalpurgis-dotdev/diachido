const paths = {
    home: '/',
    about: '/about',
    contact: '/contact',
    search: '/search',
    searchWithParam: '/search/:query',
    stores: '/stores',
    detail: '/store/:shopName',
    area: '/area/:nameArea',
    allAreas: '/allAreas',
    explore: '/explore',
    exploreDetail: '/explore/:nameDetail',
    saved: '/saved',
    notification: '/notification/:notificationId',
    error: '*',
};

export default paths;
