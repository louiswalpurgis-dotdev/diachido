import React from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Chip,
    Tooltip,
    Button,
} from '@nextui-org/react';
import { ReloadIcon } from '../Icons';
import Add from './Add';
import Delete from './Delete';
import Edit from './Edit';

const columns = [
    { name: 'TÊN', uid: 'name' },
    { name: 'MÔ TẢ', uid: 'description' },
    { name: 'HÌNH ẢNH', uid: 'imageURL' },
    { name: 'ĐỘ ƯU TIÊN', uid: 'index' },
    { name: 'NGÀY TẠO', uid: 'createdAt' },
    { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

export default function TableCollections({ collections, loadMore, isLoading, hasMore }) {
    const renderCell = React.useCallback((doc, columnKey) => {
        const cellValue = doc[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <User
                        avatarProps={{ radius: 'lg', src: doc.icon }}
                        description={`/${doc.collectionName}`}
                        name={cellValue}
                    >
                        {doc.name}
                    </User>
                );
            case 'description':
                return (
                    <div className="flex flex-col">
                        <p className="line-clamp-2 max-w-lg text-small font-light">{cellValue}</p>
                    </div>
                );
            case 'imageURL':
                return <img src={cellValue} alt={doc.name} className="h-20 w-20 rounded-lg object-cover" />;
            case 'index':
                return <Chip color="success">{cellValue}</Chip>;
            case 'createdAt':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'actions':
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip color="danger" content="Xoá ngay">
                            <Delete collection={doc} />
                        </Tooltip>
                        <Tooltip color="success" content="Chỉnh sửa">
                            <Edit collection={doc} />
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <div className="mb-4 flex justify-between">
                <Tooltip color="primary" content="Cập nhật">
                    <Button
                        auto
                        onClick={() => {
                            loadMore();
                        }}
                        isIconOnly
                        loading={isLoading}
                        disabled={!hasMore}
                        variant="light"
                        className="cursor-pointer"
                    >
                        <ReloadIcon />
                    </Button>
                </Tooltip>
                <Add />
            </div>
            <Table aria-label="Example table with custom cells">
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={collections}
                    emptyContent={
                        <div>
                            Hiện tại bạn chưa có danh mục nào, hãy thêm một danh mục mới để bắt đầu.
                            <Add />
                        </div>
                    }
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
