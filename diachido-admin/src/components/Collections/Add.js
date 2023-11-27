import React, { useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Textarea,
    Image,
    Avatar,
} from '@nextui-org/react';
import { Upload } from 'antd';
import { CategoryIcon, PlusIcon, UploadImage } from '../Icons';
import showMessage from '../../utils/message';
import { addDocument, uploadImage } from '../../firebase/services';
import { removeAccentsAndLowerCase } from '../../utils/removeAccents';

const { Dragger } = Upload;

export default function Add() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [imageUrl, setImageUrl] = useState();
    const [iconImage, setIconImage] = useState();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const props = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        accept: 'image/jpeg, image/png, image/jpg',
        className: 'bg-gray-100/90 rounded-md hover:bg-gray-200/90 transition duration-300 ease-in-out',
        showUploadList: false,
        beforeUpload: () => {
            return false;
        },
        onChange(info) {
            // Check image type
            const isImage =
                info.file.type === 'image/jpeg' || info.file.type === 'image/png' || info.file.type === 'image/jpg';
            if (!isImage) {
                showMessage('Chỉ hỗ trợ định dạng JPG/JPEG/PNG', 'error');
                return;
            }
            if (info.fileList.length === 1) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImageUrl(reader.result);
                };
                reader.readAsDataURL(info.fileList[0].originFileObj);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const iconProps = {
        name: 'avatar',
        listType: 'picture-circle',
        className: 'avatar-uploader',
        accept: 'image/svg+xml',
        multiple: false,
        maxCount: 1,
        showUploadList: false,
        beforeUpload: () => {
            return false;
        },
        onChange(info) {
            const isSvg = info.file.type === 'image/svg+xml';
            if (!isSvg) {
                showMessage('Chỉ hỗ trợ định dạng SVG', 'error');
                return;
            }
            if (info.fileList.length === 1) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setIconImage(reader.result);
                };
                reader.readAsDataURL(info.fileList[0].originFileObj);
            }
        },
    };

    const handleAddNew = async function () {
        const isValid = name && description && index && imageUrl && iconImage;
        if (!isValid) {
            showMessage('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }
        try {
            setIsLoading(true);
            const [imageURL, icon] = await Promise.all([
                uploadImage('collections', imageUrl),
                uploadImage('collections', iconImage),
            ]);
            await addDocument('collections', {
                name,
                description,
                index,
                imageURL,
                icon,
                collectionName: removeAccentsAndLowerCase(name),
            });
            showMessage('Thêm danh mục thành công', 'success');
            onOpenChange();
            clearForm();
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const clearForm = function () {
        setName('');
        setDescription('');
        setIndex(0);
        setImageUrl('');
        setIconImage('');
    };

    return (
        <>
            <Button onPress={onOpen} color="primary" variant="shadow" className="uppercase" endContent={<PlusIcon />}>
                Mới
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} defaultOpen size="4xl">
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-secondary">Thêm danh mục</ModalHeader>
                            <ModalBody>
                                <div className="flex w-full flex-wrap gap-4 md:flex-nowrap">
                                    <div className=" w-full max-w-xs">
                                        <Upload {...iconProps}>
                                            {iconImage ? (
                                                <Avatar src={iconImage} alt="Icon" className=" h-24 w-24 text-large" />
                                            ) : (
                                                <div className="flex flex-col items-center justify-center">
                                                    <CategoryIcon />
                                                    <p className="text-sm font-light">Icon (svg)</p>
                                                </div>
                                            )}
                                        </Upload>
                                    </div>
                                    <div className="flex-1 space-y-4">
                                        <Input
                                            label="Tên danh mục"
                                            placeholder="Mua sắm..."
                                            isRequired
                                            value={name}
                                            onValueChange={setName}
                                        />
                                        <Input
                                            label="Độ ưu tiên"
                                            type="number"
                                            auto
                                            placeholder="Giá trị càng lớn càng ưu tiên"
                                            isRequired
                                            min={0}
                                            value={index}
                                            onValueChange={setIndex}
                                        />
                                    </div>
                                </div>
                                <Textarea
                                    label="Mô tả"
                                    placeholder="Sống phải mua sắm..."
                                    isRequired
                                    value={description}
                                    onValueChange={setDescription}
                                />
                                <Dragger {...props}>
                                    {imageUrl ? (
                                        <div className="flex w-full items-center justify-center">
                                            <Image src={imageUrl} width={240} isZoomed />
                                        </div>
                                    ) : (
                                        <>
                                            <i className="flex w-full justify-center">
                                                <UploadImage />
                                            </i>
                                            <p className="ant-upload-text">Chọn hoặc thả ảnh để tải lên</p>
                                            <p className="ant-upload-hint">
                                                Chỉ có thể tải lên ảnh với định dạng JPG, JPEG, PNG.
                                            </p>
                                        </>
                                    )}
                                </Dragger>
                            </ModalBody>
                            <ModalFooter>
                                <Button
                                    color="danger"
                                    variant="light"
                                    onPress={() => {
                                        onClose();
                                        setImageUrl('');
                                    }}
                                >
                                    Đóng
                                </Button>
                                <Button
                                    color="primary"
                                    isDisabled={isLoading}
                                    onPress={handleAddNew}
                                    isLoading={isLoading}
                                >
                                    Lưu
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
