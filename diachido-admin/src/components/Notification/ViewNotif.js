import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Textarea,
    useDisclosure,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import showMessage from '../../utils/message';
import { deleteDocument, updateDocumentFields } from '../../firebase/services';

export default function ViewNotification({ selectedDoc, setType, type, setSelectedDoc }) {
    const [title, setTitle] = useState(selectedDoc.title || '');
    const [content, setContent] = useState(selectedDoc.content || '');
    const [createdAt, setCreatedAt] = useState(selectedDoc.createdAt || '');
    const [isLoading, setIsLoading] = useState(false);
    const [uid, setUid] = useState(selectedDoc.uid || '');

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    useEffect(() => {
        setTitle(selectedDoc.title);
        setContent(selectedDoc.content);
        setCreatedAt(selectedDoc.createdAt);
        setUid(selectedDoc.uid);
    }, [selectedDoc]);

    const handleCancelEdit = () => {
        setTitle(selectedDoc.title);
        setContent(selectedDoc.content);
        setType('view');
    };

    const handleSaveEdit = async () => {
        if (!title || !content) {
            showMessage('Vui lòng nhập đầy đủ nội dung!', 'error');
            return;
        }

        try {
            setIsLoading(true);
            await updateDocumentFields('notifications', selectedDoc.id, {
                title,
                content,
            });
            setType('view');
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async function () {
        try {
            setIsLoading(true);
            await deleteDocument('notifications', selectedDoc.id);
            setType('view');
            showMessage('Xoá thông báo thành công!', 'success');
            setSelectedDoc({});
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setIsLoading(false);
            onOpenChange();
        }
    };
    return (
        <div className="container mx-auto flex  flex-col rounded-xl bg-white  p-6">
            <Input
                type="text"
                isRequired
                variant="underlined"
                label="Tiêu đề thông báo"
                className="whitespace-normal text-3xl font-semibold"
                value={title}
                onValueChange={setTitle}
                isReadOnly={type === 'view'}
            />
            <div className="flex items-center space-x-2">
                <span className="font-light text-gray-400 ">Được viết bởi: </span>{' '}
                <span className="text-blue-400"> Admin - {uid} </span>
                <p className="ml-2 text-sm font-light text-gray-400">
                    Thời gian: {new Date(createdAt).toLocaleString()}
                </p>
            </div>
            <Textarea
                label="Nội dung thông báo"
                labelPlacement="outside"
                placeholder="Nhập nội dung thông báo"
                className="mt-4 whitespace-pre-line text-justify text-base font-normal"
                value={content}
                isRequired
                minRows={14}
                maxRows={20}
                radius="sm"
                onValueChange={setContent}
                isReadOnly={type === 'view'}
            />
            {type === 'view' && (
                <>
                    <Button
                        className="mt-4"
                        color="primary"
                        auto
                        onClick={() => {
                            setType('edit');
                        }}
                    >
                        Chỉnh sửa
                    </Button>
                    <Button
                        className="mt-4 text-red-500 hover:underline"
                        color="error"
                        auto
                        variant="ghost"
                        onPress={onOpen}
                        isLoading={isLoading}
                    >
                        Xoá
                    </Button>
                    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                        <ModalContent>
                            {(onClose) => (
                                <>
                                    <ModalHeader className="flex flex-col gap-1">Xoá thông báo</ModalHeader>
                                    <ModalBody>
                                        <p>Bạn có chắc chắn muốn xoá thông báo này không?</p>
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="danger" variant="light" onPress={onClose}>
                                            Huỷ
                                        </Button>
                                        <Button color="primary" onPress={handleDelete}>
                                            Xoá đi
                                        </Button>
                                    </ModalFooter>
                                </>
                            )}
                        </ModalContent>
                    </Modal>
                </>
            )}
            {type === 'edit' && (
                <>
                    <Button
                        className="mt-4"
                        color="primary"
                        auto
                        isLoading={isLoading}
                        onClick={() => {
                            handleSaveEdit();
                        }}
                    >
                        Lưu
                    </Button>
                    <Button
                        className="mt-4 hover:underline"
                        auto
                        variant="ghost"
                        onClick={() => {
                            handleCancelEdit();
                        }}
                    >
                        Huỷ
                    </Button>
                </>
            )}
        </div>
    );
}
