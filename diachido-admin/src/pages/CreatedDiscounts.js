import React, { useContext, useMemo } from 'react';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Link,
    Tooltip,
    Button,
} from '@nextui-org/react';
import { DeleteIcon } from '../components/Icons';
import { AuthContext } from '../Context/AuthProvider';
import useFirestore from '../hooks/useFirebase';
import { deleteDocument } from '../firebase/services';
import showMessage from '../utils/message';
import { Link as RouterLink } from 'react-router-dom';
import intToVnd from '../utils/intToVnd';

const columns = [
    { name: 'ID', uid: 'id' },
    { name: 'TÊN', uid: 'name' },
    { name: 'GIẢM GIÁ', uid: 'amount' },
    { name: 'MÔ TẢ', uid: 'description' },
    { name: 'BẮT ĐẦU', uid: 'startTime' },
    { name: 'KẾT THÚC', uid: 'endTime' },
    { name: 'URL', uid: 'forwardUrl' },
    { name: 'HÀNH ĐỘNG', uid: 'actions' },
];

export default function CreatedDiscounts() {
    const {
        user: { uid },
    } = useContext(AuthContext);
    const discountsConditions = useMemo(() => {
        return [
            {
                fieldName: 'createdBy.uid',
                operator: '==',
                compareValue: uid,
            },
            {
                fieldName: 'isPuslished',
                operator: '==',
                compareValue: false,
            },
        ];
    }, [uid]);

    const { documents } = useFirestore('discounts', discountsConditions, 'createdAt');

    const handleDelete = async function (id) {
        try {
            await deleteDocument('discounts', id);
            documents.forEach((doc) => {
                if (doc.id === id) {
                    doc.delete();
                }
            });
            showMessage('Xoá thành công', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        }
    };

    const renderCell = React.useCallback((doc, columnKey) => {
        const cellValue = doc[columnKey];

        switch (columnKey) {
            case 'name':
                return (
                    <User avatarProps={{ radius: 'lg', src: doc.imageURL }} description={doc.name} name={cellValue}>
                        {doc.name}
                    </User>
                );
            case 'amount':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {(cellValue <= 1 ? `${cellValue * 100}%` : intToVnd(cellValue)) || '0'}
                        </p>
                    </div>
                );
            case 'description':
                return (
                    <div className="flex flex-col">
                        <p className="line-clamp-2 max-w-lg text-small font-light">{cellValue}</p>
                    </div>
                );
            case 'showTime':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'startTime':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'endTime':
                return <p className="text-small">{new Date(cellValue).toLocaleString() || 'Không xác định'}</p>;
            case 'forwardUrl':
                return (
                    <Link
                        isExternal
                        href={cellValue.startsWith('https://') ? cellValue : `https://${cellValue}`}
                        showAnchorIcon
                    >
                        {cellValue}
                    </Link>
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
                                className="cursor-pointer text-lg text-danger active:opacity-50"
                            >
                                <DeleteIcon />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
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
                        Không có ưu đãi nào đang chờ duyệt, hãy{' '}
                        <RouterLink to="/add-discount" className="text-blue-500">
                            thêm mới.
                        </RouterLink>
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
    );
}
