import React, { useContext } from 'react';
import { auth } from '../firebase/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarMenuToggle,
    NavbarMenu,
    Avatar,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Dropdown,
    Image,
    NavbarItem,
    Button,
} from '@nextui-org/react';
import { AuthContext } from '../Context/AuthProvider';
import capitalize from '../utils/capitalize';
import { Logos, NavLink } from './constant';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const {
        user: { displayName, photoURL, email },
    } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogOut = () => {
        auth.signOut();
        localStorage.removeItem('accessToken');
        navigate('/', { replace: true });
    };

    return (
        <Navbar onMenuOpenChange={setIsMenuOpen} maxWidth="xl">
            <NavbarContent className="flex gap-3">
                <NavbarMenuToggle aria-label={isMenuOpen ? 'Close menu' : 'Open menu'} className="md:hidden" />
                <NavbarBrand>
                    <Link to="/dashboard">
                        <Image src={Logos.logo} alt="logo" className="h-6 w-full" />
                    </Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden gap-4 md:flex" style={{ justifyContent: 'center' }}>
                {NavLink.map((item) => (
                    <NavbarItem key={`item-${item.id}`} isActive={location.pathname === item.path}>
                        <Link
                            to={item.path}
                            className={`inline-block text-gray-600 hover:text-sky-600 ${
                                location.pathname === item.path ? 'text-sky-600' : ''
                            }`}
                        >
                            <p className="inline-block font-semibold">{item.title}</p>
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent style={{ justifyContent: 'end' }}>
                <Dropdown placement="bottom-end">
                    <DropdownTrigger>
                        <Avatar
                            isBordered
                            as="button"
                            className="transition-transform"
                            color="secondary"
                            name={displayName ?? email ?? 'D'}
                            size="sm"
                            src={photoURL ?? capitalize(displayName ?? email ?? 'D')}
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Profile Actions" variant="flat">
                        <DropdownItem key="profile" className="h-14 gap-2" textValue={email}>
                            <p className="font-semibold">Đăng nhập với:</p>
                            <p className="font-semibold">{email}</p>
                        </DropdownItem>
                        <DropdownItem
                            key="logout"
                            color="danger"
                            textValue="Log Out"
                            onClick={() => {
                                handleLogOut();
                            }}
                        >
                            Đăng xuất
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
            <NavbarMenu>
                {NavLink.map((item) => (
                    <NavbarItem key={`item-${item.id}`}>
                        <Link to={item.path} className="w-full" size="lg">
                            <p className="inline-block font-semibold">{item.title}</p>
                        </Link>
                    </NavbarItem>
                ))}
                <NavbarItem>
                    <Button color="danger" variant="shadow" size="md" auto>
                        Đăng xuất
                    </Button>
                </NavbarItem>
            </NavbarMenu>
        </Navbar>
    );
}
