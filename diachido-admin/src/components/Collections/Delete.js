import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from '@nextui-org/react';
import { DeleteIcon } from '../Icons';
import showMessage from '../../utils/message';
import { deleteDocument, deleteImage } from '../../firebase/services';

export default function Delete({ collection }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const handleDelete = async function () {
        try {
            setIsLoading(true);
            await Promise.all([
                deleteImage(collection.imageURL),
                deleteImage(collection.icon),
                deleteDocument('collections', collection.id),
            ]);
            showMessage('Xoá thành công', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <>
            <Button onPress={onOpen} color="danger" variant="light" isIconOnly>
                <DeleteIcon />
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} defaultOpen>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-secondary">Xác nhận</ModalHeader>
                            <ModalBody>
                                <p>
                                    Bạn chắc chắn muốn xoá danh mục: <b>{collection.name || 'tên'}</b>
                                </p>
                                <p>ID: {collection.id || 'ID'}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Đóng
                                </Button>
                                <Button
                                    color="danger"
                                    isDisabled={isLoading}
                                    isLoading={isLoading}
                                    onPress={handleDelete}
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
