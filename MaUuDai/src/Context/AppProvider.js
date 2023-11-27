import React, { useState, useMemo, useContext, useEffect } from 'react';
import { CiLocationOn } from 'react-icons/ci';
import useFirestore from '~/hooks/useFirestore';
import { AuthContext } from './AuthProvider';
import useDataWithLocation from '~/services/useDataWithLocation';
import useLatestCommentsAndUsers from '~/services/useLatestCommentsAndUsers';
import useCollectionsAndShopsLength from '~/services/useCollectionsAndShopsLength';
import useNotifications from '~/services/useNotifcations';
import i18n from '~/config/i18n';
export const AppContext = React.createContext();

const items = [
    {
        label: 'Đà Nẵng',
        key: '1',
        icon: <CiLocationOn />,
    },
];
const sortOptions = [
    {
        label: 'latest',
        value: '1',
    },
    {
        label: 'popular',
        value: '2',
    },
    {
        label: 'oldest',
        value: '3',
    },
    {
        label: 'discount',
        value: '4',
    },
    {
        label: 'mostDiscount',
        value: '5',
    },
];

const districtOptions = [
    {
        label: 'all',
        value: '1',
    },
    {
        label: 'Hải Châu',
        value: '2',
    },
    {
        label: 'Ngũ Hành Sơn',
        value: '3',
    },
    {
        label: 'Sơn Trà',
        value: '4',
    },
    {
        label: 'Thanh Khê',
        value: '5',
    },
    {
        label: 'Liên Chiểu',
        value: '6',
    },
    {
        label: 'Hòa Vang',
        value: '7',
    },
    {
        label: 'Cẩm Lệ',
        value: '8',
    },
];

export default function AppProvider({ children }) {
    const {
        user: { uid },
    } = useContext(AuthContext);
    const [location, setLocation] = useState('Đà Nẵng');
    const [searchData, setSearchData] = useState('');
    const [openSideBar, setOpenSideBar] = useState(false);
    const [sort, setSort] = useState('1');
    const [district, setDistrict] = useState('1');
    const [openShareModel, setOpenShareModel] = useState(false);
    const [language, setLanguage] = useState('vi'); // ['vi', 'en', 'jp', 'zh', 'ko']

    // Xử lý thay đổi ngôn ngữ
    useEffect(() => {
        try {
            i18n.changeLanguage(language);
        } catch (err) {
            i18n.changeLanguage('vi');
        }
    }, [language]);

    // Lấy dữ liệu từ firestore
    const { filteredShops, collectionsBanner, filteredDiscounts, loadMore, shopWithDiscount } = useDataWithLocation(
        location,
        districtOptions[district - 1].label,
    );
    // 5 comment mới nhất -> sidebar
    const { latestComments, usersForComments } = useLatestCommentsAndUsers(null, 5);
    const shopIdsForComment = useMemo(() => {
        return latestComments.map((item) => item.shopID);
    }, [latestComments]);
    const { documents: shopsForComments } = useFirestore('shops', shopIdsForComment);

    // Lấy các collection hiển thị ở trang chủ(tab)
    const collectionsWithShopLength = useCollectionsAndShopsLength();

    // Lấy những cửa hàng người dùng đã lưu
    const savedShopCondition = useMemo(() => {
        return {
            fieldName: 'followers',
            operator: 'array-contains',
            compareValue: uid,
        };
    }, [uid]);
    const { documents: savedShops } = useFirestore('shops', savedShopCondition);
    // Lấy tất cả discounts
    const { documents: discounts } = useFirestore('discounts', null);
    // Lấy banner quảng cáo
    const { documents: banner } = useFirestore('banners', null);
    // Lấy thông báo của người dùng
    const notificationWithUsers = useNotifications();

    return (
        <AppContext.Provider
            value={{
                items,
                sortOptions,
                districtOptions,
                sort,
                setSort,
                district,
                setDistrict,
                location,
                setLocation,
                filteredShops,
                collectionsBanner,
                filteredDiscounts,
                loadMore,
                shopWithDiscount,
                discounts,
                searchData,
                setSearchData,
                latestComments,
                usersForComments,
                shopsForComments,
                openSideBar,
                setOpenSideBar,
                collectionsWithShopLength,
                savedShops,
                openShareModel,
                setOpenShareModel,
                notificationWithUsers,
                language,
                setLanguage,
                banner,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
