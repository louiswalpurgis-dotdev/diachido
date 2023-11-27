import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Button,
    Link,
    Image,
} from '@nextui-org/react';
import Text from '../components/Text';
import { ReloadIcon } from '../components/Icons';
import React, { useMemo } from 'react';
import { Tooltip } from 'antd';
import AddBanner from '../components/Banner/AddBanner';
import useFirestore from '../hooks/useFirebase';
import DeleteBanner from '../components/Banner/DeleteBanner';
import EditBanner from '../components/Banner/EditBanner';

const columns = [
    { name: 'ĐỘ ƯU TIÊN', uid: 'index' },
    { name: 'CỬA HÀNG', uid: 'shopName' },
    { name: 'HÌNH ẢNH', uid: 'image' },
    { name: 'NGÀY TẠO', uid: 'createdAt' },
    { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

export default function App() {
    const bannerCondition = useMemo(() => {
        return {};
    }, []);
    const { documents, isLoading, hasMore, loadMore } = useFirestore('banners', bannerCondition, 'createdAt');

    const renderCell = React.useCallback((banner, columnKey) => {
        const cellValue = banner[columnKey];

        switch (columnKey) {
            case 'shopName':
                return (
                    <Link href={`https://diachido.com.vn/store/${cellValue}`} underline isExternal>
                        /{cellValue}
                    </Link>
                );
            case 'index':
                return (
                    <Chip color="default" size="small" radius="full">
                        <Text text={cellValue} fontSize="14px" fontWeight="font-bold" className="text-default-400" />
                    </Chip>
                );
            case 'image':
                return (
                    <Image loading="lazy" isZoomed width={400} src={cellValue} alt="Banner image" classNames="m-5" />
                );
            case 'createdAt':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'actions':
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip color="danger" content="Xoá ngay">
                            <DeleteBanner banner={banner} />
                        </Tooltip>
                        <Tooltip color="success" content="Chỉnh sửa">
                            <EditBanner banner={banner} />
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <>
            <div className="flex justify-between py-4">
                <Tooltip color="primary" content="Tải thêm">
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
                <AddBanner />
            </div>
            <Table
                aria-label="Example table with custom cells, pagination and sorting"
                isHeaderSticky
                classNames={{
                    base: 'pb-4',
                    wrapper: 'min-h-[222px]',
                }}
                topContentPlacement="outside"
            >
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
                </TableHeader>
                <TableBody emptyContent={'No data.'} items={documents}>
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
