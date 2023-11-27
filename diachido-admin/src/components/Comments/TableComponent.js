import { useCallback, useContext, useMemo, useState } from 'react';
import { SearchIcon, ChevronDownIcon } from '../Icons';
import { columnsForComments as columns } from '../constant/index';
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
    Spinner,
    Tooltip,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Chip,
} from '@nextui-org/react';
import { AppContext } from '../../Context/AppProvider';
import DeleteModal from './Delete.modal';

const INITIAL_VISIBLE_COLUMNS = ['uid', 'shopID', 'content', 'createdAt', 'actions'];

export default function TableComponent() {
    const [filterValue, setFilterValue] = useState('');
    const [visibleColumns, setVisibleColumns] = useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [sortDescriptor, setSortDescriptor] = useState({
        column: 'createdAt',
        direction: 'ascending',
    });
    const hasSearchFilter = Boolean(filterValue);

    const { comments, loadMoreComment, hasMoreComment, isLoadingComment: isLoading } = useContext(AppContext);

    const headerColumns = useMemo(() => {
        if (visibleColumns === 'all') return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    const filteredItems = useMemo(() => {
        let filteredComments = [...comments];

        if (hasSearchFilter) {
            filteredComments = filteredComments.filter((user) =>
                user.content.toLowerCase().includes(filterValue.toLowerCase()),
            );
        }
        return filteredComments;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [comments, filterValue]);

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

    const renderCell = useCallback((comment, columnKey) => {
        const cellValue = comment[columnKey];

        switch (columnKey) {
            case 'uid':
                return (
                    <Chip color="secondary" className="text-small">
                        {cellValue || 'Không xác định'}
                    </Chip>
                );
            case 'shopID':
                return (
                    <Chip color="success" className="text-small">
                        {cellValue || 'Không xác định'}
                    </Chip>
                );
            case 'createdAt':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'actions':
                return (
                    <div className="relative flex items-end">
                        <Tooltip content="Xoá ưu đãi">
                            <span className="cursor-pointer text-lg text-danger active:opacity-50">
                                <DeleteModal comment={comment} />
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
                <div className="flex items-end justify-between gap-3">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Tìm kiếm theo bình luận..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
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
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-small text-default-400">Tổng: {comments.length} ưu đãi</span>
                </div>
            </div>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterValue, comments.length, onSearchChange, visibleColumns, hasSearchFilter]);

    return (
        <>
            <Table
                aria-label="comments table"
                isHeaderSticky
                bottomContent={
                    hasMoreComment ? (
                        <div className="flex w-full justify-center">
                            <Button color="primary" onClick={loadMoreComment}>
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
