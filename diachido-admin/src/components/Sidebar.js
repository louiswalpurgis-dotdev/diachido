import { SidebarLink, SidebarLinkKiemDuyet, SidebarLinkModAuthor } from './constant';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/AuthProvider';
import { Accordion, AccordionItem, Divider, Spacer, User } from '@nextui-org/react';
import { Logout, SortLeft } from './Icons';

const ListboxWrapper = ({ children }) => (
    <div className="flex h-screen flex-col items-start justify-between">
        {children}
    </div>
);

const SidebarBox = ({ children }) => <div className="flex w-60 flex-col items-start">{children}</div>;

export default function Sidebar() {
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const defaultSideBar = user?.role === 'admin' ? SidebarLink : SidebarLinkModAuthor;
    const acceptRole = ['admin', 'moderator'];
    return (
        <ListboxWrapper>
            <div className="flex h-full w-full flex-col items-start">
                <div className="flex w-full items-center justify-between">
                    <User
                        name={user?.displayName.toUpperCase() || 'Người dùng'}
                        description={<span className="text-blue-500">{user?.role || 'Không xác định'}</span>}
                        className="mx-2 font-semibold"
                        avatarProps={{
                            src: `${user?.photoURL || 'https://i.pravatar.cc/150?u=a04258114e29026702d'}`,
                        }}
                    />
                    <button title="Đăng xuất">
                        <Logout className="h-8 w-8" />
                    </button>
                </div>
                <Spacer y={1} />
                <Divider />
                <SidebarBox>
                    <Accordion
                        isCompact
                        selectionMode="multiple"
                        showDivider={false}
                        defaultExpandedKeys={Array.from({ length: defaultSideBar.length }, (_, i) => i.toString())}
                    >
                        {defaultSideBar.map((section) => (
                            <AccordionItem
                                key={section.id}
                                className="w-full"
                                aria-label={section.title.text}
                                title={section.title.text}
                                startContent={section.title.icon}
                                isCompact={true}
                                indicator={<SortLeft />}
                            >
                                <div className="pl-4">
                                    <div className="flex w-full flex-col border-l border-gray-300 pl-2 text-gray-500">
                                        {section.items.map((item) => (
                                            <Link
                                                to={item.path}
                                                key={item.path}
                                                className={`inline-block w-full rounded-xl px-4 py-2 text-sm font-semibold
                                            ${location.pathname === item.path ? `bg-indigo-200 text-white` : ''}
                                            hover:bg-indigo-200 hover:text-white focus:outline-none`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </AccordionItem>
                        ))}

                        {acceptRole.includes(user.role) && (
                            <AccordionItem
                                className="w-full"
                                aria-label={SidebarLinkKiemDuyet.title.text}
                                title={SidebarLinkKiemDuyet.title.text}
                                startContent={SidebarLinkKiemDuyet.title.icon}
                                isCompact={true}
                                indicator={<SortLeft />}
                            >
                                <div className="pl-4">
                                    <div className="flex w-full flex-col border-l border-gray-300 pl-2 text-gray-500">
                                        {SidebarLinkKiemDuyet.items.map((item) => (
                                            <Link
                                                to={item.path}
                                                key={item.path}
                                                className={`inline-block w-full rounded-xl px-4 py-2 text-sm font-semibold
                                            ${location.pathname === item.path ? `bg-indigo-200 text-white` : ''}
                                            hover:bg-indigo-200 hover:text-white focus:outline-none`}
                                            >
                                                {item.label}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </AccordionItem>
                        )}
                    </Accordion>
                </SidebarBox>
            </div>
        </ListboxWrapper>
    );
}
