import React, { useCallback, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { DeleteIcon } from '../Icons';
import { deleteDocument } from '../../firebase/services';
import showMessage from '../../utils/message';

export default function DeleteModal({ discount }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [loading, setLoading] = useState(false);

    const handleDeleteDiscount = useCallback(async function () {
        const id = discount.id;
        setLoading(true);
        try {
            await deleteDocument('discounts', id);
            showMessage('Xoá ưu đãi thành công', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setLoading(false);
            onOpenChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <>
            <Button
                onPress={onOpen}
                isIconOnly
                color="danger"
                variant="light"
                aria-label="Xoá ưu đãi"
                className='className="text-lg cursor-pointer active:opacity-50 min-w-unit-0 w-[18px] h-fit'
            >
                <DeleteIcon />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Xoá ưu đãi</ModalHeader>
                            <ModalBody>
                                <p>Bạn có chắc muốn xoá ưu đãi này không? Thao tác này không thể hoàn tác.</p>
                                <p>ID: {discount.id}</p>
                                <p>Tên: {discount.name}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={handleDeleteDiscount}
                                    isLoading={loading}
                                >
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
