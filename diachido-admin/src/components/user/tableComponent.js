import { useCallback, useContext, useMemo, useState } from 'react';
import { ChevronDownIcon, SearchIcon, VerticalDotsIcon } from '../Icons';
import { columns, providerOptions, userRoles } from '../constant/index';
import capitalize from '../../utils/capitalize';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    User,
    useDisclosure,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Modal,
    Spinner,
    Select,
    SelectItem,
} from '@nextui-org/react';
import { toggleDisableUser, updateDocumentFields } from '../../firebase/services';
import { AppContext } from '../../Context/AppProvider';
import AddUser from './AddUser';
import showMessage from '../../utils/message';
import { checkPermission } from '../../validates/checkPermission';

const roleColorMap = {
    firebase: 'success',
    google: 'warning',
    facebook: 'secondary',
    unknown: 'danger',
};
const INITIAL_VISIBLE_COLUMNS = ['displayName', 'role', 'providerId', 'actions', 'createdAt'];

export default function TableComponent() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const {
        isOpen: isOpenChangeRole,
        onOpen: onOpenChangeRole,
        onOpenChange: onOpenChangeRoleChange,
    } = useDisclosure();
    const [user, setUser] = useState({});
    const [role, setRole] = useState(new Set([])); // Dùng để cập nhật lại quyền người dùng
    const [isProcess, setIsProcess] = useState(false);
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'createdAt',
        direction: 'ascending',
    });
    const hasSearchFilter = Boolean(filterValue);

    const { users, loadMoreUser, hasMoreUser, isLoadingUser: isLoading } = useContext(AppContext);

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    const filteredItems = useMemo(() => {
        let filteredUsers = [...users];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.displayName.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        if (statusFilter !== 'all' && Array.from(statusFilter).length !== providerOptions.length) {
            filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.providerId));
        }

        return filteredUsers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [users, filterValue, statusFilter]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            if (sortDescriptor.column === 'createdAt') {
                const first = new Date(a[sortDescriptor.column]);
                const second = new Date(b[sortDescriptor.column]);
                const cmp = first < second ? -1 : first > second ? 1 : 0;
                return sortDescriptor.direction === 'descending' ? -cmp : cmp;
            }
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === 'descending' ? -cmp : cmp;
        });
    }, [sortDescriptor, filteredItems]);

    const handleDisableUser = async () => {
        if (!checkPermission(user.role, ['admin'])) {
            showMessage('Bạn không có quyền để thực hiện thao tác này', 'error');
            return;
        }
        setIsProcess(true);
        try {
            await toggleDisableUser(user.id, user.isDeleted);
            showMessage(`${user.isDeleted ? 'Đã bỏ chặn người dùng' : 'Đã chặn người dùng'}`, 'success');
            onOpenChange();
        } catch (e) {
            showMessage(e.message, 'error');
        } finally {
            setIsProcess(false);
        }
    };

    const handleChangeRole = async () => {
        const newRole = role.values().next().value;
        if (role === user.role) {
            showMessage('Vai trò không thay đổi', 'info');
        }
        if (!checkPermission(user.role, ['admin'])) {
            showMessage('Bạn không có quyền thay đổi vai trò của người dùng', 'error');
            return;
        }
        setIsProcess(true);
        try {
            await updateDocumentFields('users', user.id, { role: newRole });
            showMessage('Cập nhật vai trò thành công', 'success');
            onOpenChangeRoleChange();
        } catch (e) {
            showMessage(e.message, 'error');
        } finally {
            setIsProcess(false);
        }
    };

    const renderCell = useCallback((user, columnKey) => {
        const cellValue = user[columnKey];

        switch (columnKey) {
            case 'displayName':
                return (
                    <User avatarProps={{ radius: 'lg', src: user.photoURL }} description={user.email} name={cellValue}>
                        {user.email}
                    </User>
                );
            case 'role':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue || 'Người dùng'}</p>
                    </div>
                );
            case 'providerId':
                return (
                    <Chip
                        className="capitalize"
                        color={roleColorMap[user.providerId.split('.')[0]]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case 'createdAt':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'actions':
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown>
                            <DropdownTrigger aria-label="Toggle dropdown">
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu aria-label="Dropdown menu">
                                <DropdownItem
                                    color="secondary"
                                    onPress={onOpenChangeRole}
                                    onClick={() => {
                                        setUser(user);
                                    }}
                                >
                                    Đổi Quyền
                                </DropdownItem>
                                <DropdownItem
                                    color="danger"
                                    onPress={onOpen}
                                    onClick={() => {
                                        setUser(user);
                                    }}
                                >
                                    {user.isDeleted ? 'Bỏ chặn' : 'Chặn'}
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onSearchChange = useCallback((value) => {
        if (value) {
            setFilterValue(value);
        } else {
            setFilterValue('');
        }
    }, []);
    const onClear = useCallback(() => {
        setFilterValue('');
    }, []);
    const topContent = useMemo(() => {
        return (
            <div className="flex flex-col gap-4 w-full">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Tìm kiếm theo tên..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Đăng nhập
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {providerOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Hiển thị
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <AddUser />
                    </div>
                </div>
                <div className="flex justify-start items-center">
                    <span className="text-default-400 text-small">Tổng: {users.length} tài khoản</span>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValue, statusFilter, visibleColumns, users.length, onSearchChange, hasSearchFilter]);

    return (
        <>
            <Table
                aria-label="Users Table"
                isHeaderSticky
                bottomContent={
                    hasMoreUser ? (
                        <div className="flex w-full justify-center">
                            <Button color="primary" onClick={loadMoreUser}>
                                Tải thêm
                            </Button>
                        </div>
                    ) : null
                }
                classNames={{
                    base: 'max-h-[620px]',
                    table: 'min-h-[400px] overflow-y-scroll',
                }}
                selectionMode="multiple"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={column.uid === 'createdAt' ? 'center' : 'start'}
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={'Không có dữ liệu người dùng'}
                    loadingContent={<Spinner color="white" />}
                    isLoading={isLoading}
                    items={sortedItems}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <div className="w-full h-full hidden">
                {/* model disable user */}
                <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Xác nhận!</ModalHeader>
                                <ModalBody>
                                    <p>
                                        {user.isDeleted
                                            ? 'Người dùng sẽ được bỏ chặn và có thể truy cập vào hệ thống'
                                            : 'Người dùng sẽ bị chặn và không thể đăng nhập vào hệ thống.'}
                                        Bạn có chắc chắn muốn xoá người dùng này?
                                    </p>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        variant="light"
                                        onPress={() => {
                                            setUser({});
                                            onClose();
                                        }}
                                    >
                                        Đóng
                                    </Button>
                                    <Button color="danger" onPress={handleDisableUser} isLoading={isProcess}>
                                        {user.isDeleted ? 'Bỏ chặn' : 'Chặn'}
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
                {/* model change role */}
                <Modal isOpen={isOpenChangeRole} onOpenChange={onOpenChangeRoleChange}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">Cập nhật vai trò</ModalHeader>
                                <ModalBody className="items-center">
                                    <Select
                                        label="Cập nhật vai trò"
                                        placeholder="Chọn vai trò mới"
                                        defaultSelectedKeys={[user.role ?? 'user']}
                                        className="max-w-xs"
                                        onSelectionChange={setRole}
                                    >
                                        {userRoles.map((role) => (
                                            <SelectItem key={role.uid} value={role.uid}>
                                                {role.name}
                                            </SelectItem>
                                        ))}
                                    </Select>
                                </ModalBody>
                                <ModalFooter>
                                    <Button
                                        variant="light"
                                        onPress={() => {
                                            setUser({});
                                            onClose();
                                        }}
                                    >
                                        Đóng
                                    </Button>
                                    <Button color="danger" onPress={handleChangeRole} isLoading={isProcess}>
                                        Cập nhật
                                    </Button>
                                </ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>
            </div>
        </>
    );
}
