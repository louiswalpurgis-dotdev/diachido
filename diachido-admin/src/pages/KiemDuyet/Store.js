import React, { useMemo } from 'react';
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
import { AcceptIcon, DeleteIcon, PlusIcon, ReloadIcon } from '../../components/Icons';
import { deleteDocument, updateDocumentFields } from '../../firebase/services';
import showMessage from '../../utils/message';
import { Link } from 'react-router-dom';
import useFirestore from '../../hooks/useFirebase';

const columns = [
    { name: 'TÊN', uid: 'name', sortable: true },
    { name: 'MÔ TẢ', uid: 'description' },
    { name: 'NGÀY TẠO', uid: 'createdAt', sortable: true },
    { name: 'VỊ TRÍ', uid: 'locations' },
    { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

export default function StoreKiemDuyet() {
    const storesKiemDuyetCondition = useMemo(() => {
        return {
            fieldName: 'isPuslished',
            operator: '==',
            compareValue: false,
        };
    }, []);

    const { documents, isLoading, hasMore, loadMore } = useFirestore('shops', storesKiemDuyetCondition, 'createdAt');

    const handleDelete = async function (id) {
        try {
            await deleteDocument('shops', id);
            showMessage('Xoá thành công', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    };

    const handleAccept = async function (id) {
        try {
            await updateDocumentFields('shops', id, { isPuslished: true });
            showMessage('Đã phê duyệt!', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    };

    const renderCell = React.useCallback((doc, columnKey) => {
        const cellValue = doc[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <User avatarProps={{ radius: 'lg', src: doc.imageURL }} description={doc.shopName} name={cellValue}>
                        {doc.name}
                    </User>
                );
            case 'locations':
                return (
                    <div className=" flex flex-col space-y-1 overflow-auto">
                        {cellValue.map((location) => (
                            <Chip key={location.address} color="success" className="text-small">
                                {location.address}
                            </Chip>
                        ))}
                    </div>
                );
            case 'description':
                return (
                    <div className="flex flex-col">
                        <p className="line-clamp-2 max-w-lg text-small font-light">{cellValue}</p>
                    </div>
                );
            case 'createdAt':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'actions':
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip color="danger" content="Xoá ngay">
                            <Button
                                onClick={() => handleDelete(doc.id)}
                                isIconOnly
                                variant="light"
                                className="cursor-pointer text-lg text-danger active:opacity-50"
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                        <Tooltip color="success" content="Chấp nhận">
                            <Button
                                onClick={() => handleAccept(doc.id)}
                                isIconOnly
                                variant="light"
                                className="cursor-pointer text-lg text-danger active:opacity-50"
                            >
                                <AcceptIcon />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
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
                <Link to="/add-store" className="flex rounded-xl bg-blue-500 p-2 text-center uppercase text-white">
                    MỚi
                    <PlusIcon />
                </Link>
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
                    items={documents}
                    emptyContent={
                        <div>
                            Hiện tại bạn chưa có cửa hàng nào, hãy{' '}
                            <Link to="/add-store" className="text-blue-500">
                                tạo
                            </Link>{' '}
                            cửa hàng.
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
