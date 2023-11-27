import { useCallback, useContext, useMemo, useState } from 'react';
import { PlusIcon, ChevronDownIcon, SearchIcon, EyeIcon, EditIcon, DeleteIcon } from '../Icons';
import { columnsForStores as columns } from '../constant/index';
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
    User,
    Spinner,
    Chip,
    Link,
    Tooltip,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from '@nextui-org/react';
import { AppContext } from '../../Context/AppProvider';
import { deleteDocument, deleteDocuments, deleteImage } from '../../firebase/services';
import showMessage from '../../utils/message';

const INITIAL_VISIBLE_COLUMNS = ['name', 'description', 'followersCount', 'likersCount', 'actions'];

export default function TableComponent({ setType, setStore }) {
    const [filterValue, setFilterValue] = useState('');
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isProcess, setIsProcess] = useState(false);
    const [shopDelete, setShopDelete] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'createdAt',
        direction: 'ascending',
    });
    const hasSearchFilter = Boolean(filterValue);

    const { stores, loadMoreShop, hasMoreShop, isLoadingShop: isLoading } = useContext(AppContext);

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    const filteredItems = useMemo(() => {
        let filteredUsers = [...stores];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) =>
                user.displayName.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        return filteredUsers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stores, filterValue]);

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

    const handleDeleteStore = useCallback(async function (shop) {
        const id = shop.id;
        const imageURL = shop.imageURL.split('?')[0].substring(shop.imageURL.lastIndexOf('/') + 1);
        setIsProcess(true);
        try {
            await deleteDocuments('discounts', 'shopID', id);
            await deleteDocuments('comments', 'shopID', id);
            await deleteDocument('shops', id);
            await deleteImage(imageURL);
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setIsProcess(false);
            onOpenChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const renderCell = useCallback((shop, columnKey) => {
        const cellValue = shop[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <Link isExternal href={`https://diachido.onrender.com/store/${shop.shopName}`} showAnchorIcon>
                        <User
                            avatarProps={{ radius: 'md', src: shop.imageURL }}
                            name={cellValue}
                            className="font-semibold"
                        >
                            {shop.name}
                        </User>
                    </Link>
                );
            case 'description':
                return (
                    <div className="flex flex-col">
                        <p className="font-light text-small line-clamp-2 max-w-lg">{cellValue}</p>
                    </div>
                );
            case 'createdAt':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'ratings':
                return <p className="text-small">{cellValue.toFixed(2) || 'Không xác định'}</p>;
            case 'locations':
                return (
                    <div className="flex flex-col space-y-1">
                        {cellValue.map((location) => (
                            <Chip key={location} color="success" className="text-small">
                                {location}
                            </Chip>
                        ))}
                    </div>
                );
            case 'actions':
                return (
                    <div className="relative flex items-center gap-2">
                        <Link isExternal href={`https://diachido.onrender.com/store/${shop.shopName}`}>
                            <Tooltip content="Xem ngay">
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <EyeIcon />
                                </span>
                            </Tooltip>
                        </Link>
                        <Tooltip content="Chỉnh sửa">
                            <Button
                                variant="light"
                                color="default"
                                isIconOnly
                                aria-label="edit"
                                className="text-lg text-default-400 cursor-pointer active:opacity-50 min-w-unit-0 w-[18px] h-fit"
                                onClick={() => {
                                    setStore(shop);
                                    setType('edit');
                                }}
                            >
                                <EditIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip color="danger" content="Xoá cửa hàng">
                            <Button
                                variant="light"
                                color="default"
                                isIconOnly
                                className="text-lg text-danger cursor-pointer active:opacity-50 min-w-unit-0 w-[18px] h-fit"
                                aria-label="Delete"
                                onPress={onOpen}
                                onClick={() => setShopDelete(shop)}
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
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
            <div className="flex flex-col gap-4">
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
                        <Button
                            color="primary"
                            endContent={<PlusIcon />}
                            onClick={() => {
                                setType('add');
                            }}
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Tổng: {stores.length} Cửa hàng</span>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValue, visibleColumns, stores.length, onSearchChange, hasSearchFilter]);

    return (
        <>
            <Table
                aria-label="store table"
                isHeaderSticky
                bottomContent={
                    hasMoreShop ? (
                        <div className="flex w-full justify-center">
                            <Button color="primary" onClick={loadMoreShop}>
                                Tải thêm
                            </Button>
                        </div>
                    ) : null
                }
                classNames={{
                    base: 'max-h-[620px] ',
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
                    emptyContent={'Không có dữ liệu nào được tìm thấy'}
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
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Xác nhận!</ModalHeader>
                            <ModalBody>
                                <p>
                                    Bạn có chắc chắn muốn xoá cửa hàng{' '}
                                    <span className="font-semibold">{shopDelete?.name}</span> không?
                                </p>
                                <p>
                                    Mọi thông tin liên quan đến cửa hàng sẽ bị xoá vĩnh viễn và không thể khôi phục lại.
                                </p>
                                <p>Danh sách những dữ liệu sẽ bị xoá nếu bạn tiếp tục:</p>
                                <ul className="list-disc list-inside">
                                    <li>Thông tin cửa hàng</li>
                                    <li>Thông tin khuyến mãi</li>
                                    <li>Thông tin bình luận</li>
                                </ul>
                                <p>
                                    <span className="font-semibold">Lưu ý:</span> Bạn không thể hoàn tác hành động này.
                                </p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button color="danger" onPress={handleDeleteStore} isLoading={isProcess}>
                                    Xoá
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
