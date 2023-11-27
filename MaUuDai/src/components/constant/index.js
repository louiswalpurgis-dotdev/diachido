import Home from '~/assets/icons/home.svg';
import Explore from '~/assets/icons/explore.svg';
import Store from '~/assets/icons/store.svg';
import Search from '~/assets/icons/search.svg';
import MapMarker from '~/assets/icons/marker.svg';
import BookmarkFill from '~/assets/icons/bookmarkFill.svg';
import Bookmark from '~/assets/icons/bookmark.svg';
import Star from '~/assets/icons/star.svg';
import StarFill from '~/assets/icons/starFill.svg';
import Share from '~/assets/icons/share.svg';
import Sale from '~/assets/icons/sale.svg';
import Product from '~/assets/icons/product.svg';
import Heart from '~/assets/icons/heart.svg';
import HeartFill from '~/assets/icons/heartFill.svg';
import RightParol from '~/assets/icons/right.svg';
import Logout from '~/assets/icons/logout.svg';
import LightningBolt from '~/assets/icons/lightning-bolt.svg';
import Fire from '~/assets/icons/fire.svg';
import Translate from '~/assets/icons/translate.svg';
import Logo from '~/assets/logo_dcd.svg';
import Chat from '~/assets/icons/chat.svg';
import Korea from '~/assets/icons/korea.svg';
import Japan from '~/assets/icons/japan.svg';
import China from '~/assets/icons/china.svg';
import Vietnam from '~/assets/icons/vietnam.svg';
import English from '~/assets/icons/english.svg';
import Menu from '~/assets/icons/menu.svg';
import Collection from '~/assets/icons/collection.svg';
import ExpandArrow from '~/assets/icons/ExpandArrow.svg';
import CollapseArrow from '~/assets/icons/CollapseArrow.svg';
import Language from '~/assets/icons/language.svg';
import Prev from '~/assets/icons/prev.svg';
import Next from '~/assets/icons/next.svg';
import Loading from '~/assets/icons/loading.svg';
import Copy from '~/assets/icons/copy.svg';
import Hotline from '~/assets/images/tiger.png';
import Send from '~/assets/icons/send.svg';
import Test from '~/assets/images/sport.svg';
import Update from '~/assets/icons/update.svg';
import Qr from '~/assets/icons/qr.svg';
import arrowLeft from '~/assets/icons/arrowLeft.svg';

export const IconSvg = {
    star: Star,
    chat: Chat,
    menu: Menu,
    language: Language,
    expandArrow: ExpandArrow,
    collapseArrow: CollapseArrow,
    collection: Collection,
    starFill: StarFill,
    store: Store,
    share: Share,
    marker: MapMarker,
    sale: Sale,
    product: Product,
    heart: Heart,
    heartFill: HeartFill,
    bookmark: Bookmark,
    bookmarkFill: BookmarkFill,
    lightningBolt: LightningBolt,
    rightParol: RightParol,
    translate: Translate,
    logout: Logout,
    fire: Fire,
    prev: Prev,
    next: Next,
    logo: Logo,
    loading: Loading,
    copy: Copy,
    send: Send,
    update: Update,
    qr: Qr,
    arrowLeft: arrowLeft,
};

export const ImageAssets = {
    hotline: Hotline,
    test: Test,
};

export const NavLinks = [
    { href: '/', key: '1', text: 'home', icon: Home },
    { href: '/explore', key: '2', text: 'explore', icon: Explore },
    { href: '/stores', key: '3', text: 'stores', icon: Store },
    { href: '/search', key: '4', text: 'search', icon: Search },
    { href: '/allAreas', key: '5', text: 'area', icon: MapMarker },
    { href: '/saved', key: '6', text: 'saved', icon: BookmarkFill },
];

export const DropAvatarLinks = [
    { href: '/explore', key: '1', text: 'explore', icon: Explore },
    { href: '/saved', key: '2', text: 'saved', icon: BookmarkFill },
];

export const randomBgColors = [
    'bg-gradient-to-tr from-[#f94144]/0 via-[#f3722c]/10 to-[#f8961e]/5',
    'bg-gradient-to-tr from-[#f3722c]/0 via-[#f8961e]/10 to-[#f8961e]/5',
    'bg-gradient-to-tr from-[#f8961e]/0 via-[#f9844a]/10 to-[#f9c74f]/5',
    'bg-gradient-to-tr from-[#f9c74f]/0 via-[#90be6d]/10 to-[#43aa8b]/5',
    'bg-gradient-to-tr from-[#90be6d]/0 via-[#43aa8b]/10 to-[#4d908e]/5',
    'bg-gradient-to-tr from-[#43aa8b]/0 via-[#4d908e]/10 to-[#577590]/5',
    'bg-gradient-to-tr from-[#4d908e]/0 via-[#577590]/10 to-[#277da1]/5',
    'bg-gradient-to-tr from-[#577590]/0 via-[#277da1]/10 to-[#264653]/5',
    'bg-gradient-to-tr from-[#277da1]/0 via-[#264653]/10 to-[#2a9d8f]/5',
    'bg-gradient-to-tr from-[#264653]/0 via-[#2a9d8f]/10 to-[#e9c46a]/5',
    'bg-gradient-to-tr from-[#2a9d8f]/0 via-[#e9c46a]/10 to-[#f4a261]/5',
    'bg-gradient-to-tr from-[#e9c46a]/0 via-[#f4a261]/10 to-[#e76f51]/5',
    'bg-gradient-to-tr from-[#f4a261]/0 via-[#e76f51]/10 to-[#d62828]/5',
    'bg-gradient-to-tr from-[#e76f51]/0 via-[#d62828]/10 to-[#f94144]/5',
];

export const languages = [
    { id: 1, name: 'Tiếng Việt', code: 'vi', icon: Vietnam },
    { id: 2, name: 'English', code: 'en', icon: English },
    { id: 3, name: '日本語', code: 'ja', icon: Japan },
    { id: 4, name: '中文', code: 'zh', icon: China },
    { id: 5, name: '한국어', code: 'ko', icon: Korea },
];

export const footerLinks = [
    {
        title: 'us',
        links: [
            { text: 'about', url: '/about' },
            { text: 'contact', url: '/contact' },
        ],
    },
    {
        title: 'fastLinks',
        links: [
            { text: 'explore', url: '/explore' },
            { text: 'stores', url: '/stores' },
            { text: 'search', url: '/search' },
        ],
    },
    {
        title: 'followus',
        links: [
            { text: 'facebook', url: 'https://www.facebook.com/' },
            { text: 'instagram', url: 'https://www.instagram.com/' },
            { text: 'twitter', url: 'https://twitter.com/' },
            { text: 'youtube', url: 'https://www.youtube.com/' },
            { text: 'tiktok', url: 'https://www.tiktok.com/' },
        ],
    },
];
