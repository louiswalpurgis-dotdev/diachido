import Logo from '../../logo.svg';
import { AdminIcon, Comment, PrivateIcon, SpecialOfferIcon, StoreIcon } from '../Icons';

export const Logos = {
    logo: Logo,
};

export const NavLink = [
    {
        id: 1,
        title: 'Trang chủ',
        path: '/dashboard',
    },
    {
        id: 3,
        title: 'Thêm cửa hàng',
        path: '/add-store',
    },
    {
        id: 4,
        title: 'Thêm ưu đãi',
        path: '/add-discount',
    },
    {
        id: 5,
        path: '/store-kiem-duyet',
        title: 'Chờ duyệt cửa hàng',
    },
    {
        id: 6,
        path: '/discount-kiem-duyet',
        title: 'Chờ duyệt ưu đãi',
    },
];

export const SidebarLink = [
    {
        id: 2,
        title: { text: 'Cửa hàng', icon: <StoreIcon /> },
        items: [
            {
                path: '/stores',
                label: 'Danh sách cửa hàng',
            },
            {
                path: '/add-store',
                label: 'Thêm cửa hàng',
            },
        ],
    },
    {
        id: 3,
        title: { text: 'Ưu đãi', icon: <SpecialOfferIcon /> },
        items: [
            {
                path: '/discounts',
                label: 'Danh sách ưu đãi',
            },
            {
                path: '/add-discount',
                label: 'Thêm ưu đãi',
            },
        ],
    },
    {
        id: 4,
        title: { text: 'Bình luận', icon: <Comment /> },
        items: [
            {
                path: '/comments',
                label: 'Danh sách bình luận',
            },
        ],
    },
    {
        id: 5,
        title: { text: 'Admin', icon: <AdminIcon /> },
        items: [
            {
                path: '/notification',
                label: 'Thông báo',
            },
            {
                path: '/collections',
                label: 'Danh mục',
            },
            {
                path: '/banners',
                label: 'Banner',
            },
            {
                path: '/users',
                label: 'Quản lý người dùng',
            },
        ],
    },
];
export const SidebarLinkModAuthor = [
    {
        id: 2,
        title: { text: 'Cửa hàng', icon: <StoreIcon /> },
        items: [
            {
                path: '/add-store',
                label: 'Thêm cửa hàng',
            },
            {
                path: '/created-stores',
                label: 'Chờ duyệt',
            },
        ],
    },
    {
        id: 3,
        title: { text: 'Ưu đãi', icon: <SpecialOfferIcon /> },
        items: [
            {
                path: '/add-discount',
                label: 'Thêm ưu đãi',
            },
            {
                path: '/created-discounts',
                label: 'Chờ duyệt',
            },
        ],
    },
];

export const SidebarLinkKiemDuyet = {
    id: 999,
    title: { text: 'Kiểm duyệt', icon: <PrivateIcon /> },
    items: [
        {
            path: '/store-kiem-duyet',
            label: 'Kiểm duyệt cửa hàng',
        },
        {
            path: '/discount-kiem-duyet',
            label: 'Kiểm duyệt ưu đãi',
        },
    ],
};
// For user account
const columns = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN', uid: 'displayName', sortable: true },
    { name: 'ĐIỂM', uid: 'point', sortable: true },
    { name: 'VAI TRÒ', uid: 'role', sortable: true },
    { name: 'ĐĂNG NHẬP', uid: 'providerId', sortable: true },
    { name: 'EMAIL', uid: 'email' },
    { name: 'NGÀY TẠO', uid: 'createdAt', sortable: true },
    { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

const providerOptions = [
    { name: 'Firebase', uid: 'firebase' },
    { name: 'Google', uid: 'google.com' },
    { name: 'Facebook', uid: 'facebook.com' },
    { name: 'Không xác định', uid: 'unknown' },
];
export { columns, providerOptions };

// For stores
const columnsForStores = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN', uid: 'name', sortable: true },
    { name: 'MÔ TẢ', uid: 'description' },
    { name: 'THEO DÕI', uid: 'followersCount', sortable: true },
    { name: 'YÊU THÍCH', uid: 'likersCount', sortable: true },
    { name: 'ĐÁNH GIÁ', uid: 'ratings', sortable: true },
    { name: 'NGÀY TẠO', uid: 'createdAt', sortable: true },
    { name: 'VỊ TRÍ', uid: 'locations' },
    { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

export { columnsForStores };

export const userRoles = [
    { name: 'Quản trị viên', uid: 'admin' },
    { name: 'Kiểm duyệt viên', uid: 'moderator' },
    { name: 'Người viết bài', uid: 'author' },
    { name: 'Người dùng', uid: 'user' },
];

// For discounts
const columnsForDiscounts = [
    { name: 'ID', uid: 'id', sortable: true },
    { name: 'TÊN', uid: 'name', sortable: true },
    { name: 'GIẢM GIÁ', uid: 'amount', sortable: true },
    { name: 'MÃ', uid: 'code', sortable: true },
    { name: 'SHOPID', uid: 'shopID', sortable: true },
    { name: 'MÔ TẢ', uid: 'description' },
    { name: 'NGÀY TẠO', uid: 'createdAt', sortable: true },
    { name: 'BẮT ĐẦU', uid: 'startTime', sortable: true },
    { name: 'HIỂN THỊ', uid: 'showTime', sortable: true },
    { name: 'KẾT THÚC', uid: 'endTime', sortable: true },
    { name: 'URL', uid: 'forwardUrl' },
    { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

const providerOptionsForDisCounts = [
    { name: 'Hết hạn', uid: 'endTime' },
    { name: 'Còn sử dụng', uid: 'startTime' },
    { name: 'Chưa công khai', uid: 'showTime' },
];
export { columnsForDiscounts, providerOptionsForDisCounts };

const columnsForComments = [
    { name: 'ID', uid: 'id' },
    { name: 'ID NGƯỜI DÙNG', uid: 'uid', sortable: true },
    { name: 'ID CỬA HÀNG', uid: 'shopID', sortable: true },
    { name: 'NỘI DUNG', uid: 'content' },
    { name: 'NGÀY TẠO', uid: 'createdAt', sortable: true },
    { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

export { columnsForComments };
