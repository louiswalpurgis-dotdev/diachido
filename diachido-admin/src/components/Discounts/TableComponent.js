import { useCallback, useContext, useMemo, useState } from 'react';
import { ChevronDownIcon, EditIcon, PlusIcon, SearchIcon } from '../Icons';
import { columnsForDiscounts as columns, providerOptionsForDisCounts as providerOptions } from '../constant/index';
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
    Spinner,
    Link,
    Tooltip,
} from '@nextui-org/react';
import { AppContext } from '../../Context/AppProvider';
import DeleteModal from './Delete.modal';
import intToVnd from '../../utils/intToVnd';

const INITIAL_VISIBLE_COLUMNS = ['name', 'amount', 'code', 'showTime', 'actions'];

export default function TableComponent({ setType, setDiscount }) {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'createdAt',
        direction: 'ascending',
    });
    const hasSearchFilter = Boolean(filterValue);

    const { discounts, loadMoreDiscount, hasMoreDiscount, isLoadingDiscount: isLoading } = useContext(AppContext);

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    const filteredItems = useMemo(() => {
        let filteredUsers = [...discounts];

        if (hasSearchFilter) {
            filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(filterValue.toLowerCase()));
        }
        return filteredUsers;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [discounts, filterValue, statusFilter]);

    const sortedItems = useMemo(() => {
        return [...filteredItems].sort((a, b) => {
            if (sortDescriptor.column in ['createdAt', 'showTime', 'startTime', 'endTime']) {
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

    const renderCell = useCallback((discount, columnKey) => {
        const cellValue = discount[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue || 'Không xác định'}</p>
                    </div>
                );
            case 'amount':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {(cellValue <= 1 ? `${cellValue * 100}%` : intToVnd(cellValue)) || '0'}
                        </p>
                    </div>
                );
            case 'code':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue || 'Không xác định'}</p>
                    </div>
                );
            case 'createdAt':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'showTime':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'startTime':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'endTime':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'forwardUrl':
                return (
                    <Link isExternal href={cellValue} showAnchorIcon>
                        {cellValue}
                    </Link>
                );
            case 'actions':
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Chỉnh sửa">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <Button
                                    onClick={() => {
                                        setDiscount(discount);
                                        setType('edit');
                                    }}
                                    isIconOnly
                                    color="primary"
                                    variant="light"
                                    aria-label="Chỉnh sửa ưu đãi"
                                    className='className="text-lg text-default-400 cursor-pointer active:opacity-50 min-w-unit-0 w-[18px] h-fit'
                                >
                                    <EditIcon />
                                </Button>
                            </span>
                        </Tooltip>
                        <Tooltip content="Xoá ưu đãi">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteModal discount={discount} />
                            </span>
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
                            onClick={() => {
                                setType('add');
                            }}
                            className="uppercase"
                            endContent={<PlusIcon />}
                        >
                            Thêm mới
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">Tổng: {discounts.length} ưu đãi</span>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValue, statusFilter, visibleColumns, discounts.length, onSearchChange, hasSearchFilter]);

    return (
        <>
            <Table
                aria-label="discount table"
                isHeaderSticky
                bottomContent={
                    hasMoreDiscount ? (
                        <div className="flex w-full justify-center">
                            <Button color="primary" onClick={loadMoreDiscount}>
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
                    emptyContent={'Không có dữ liệu'}
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
        </>
    );
}
