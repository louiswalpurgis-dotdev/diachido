import React, { useContext, useState } from 'react';
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
    Input,
    Image,
    SelectItem,
    Select,
    Avatar,
} from '@nextui-org/react';
import { Upload } from 'antd';
import { PlusIcon, SelectorIcon, UploadImage } from '../Icons';
import showMessage from '../../utils/message';
import { addDocument, uploadImage } from '../../firebase/services';
import { AppContext } from '../../Context/AppProvider';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';

const { Dragger } = Upload;

export default function AddBanner() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [imageUrl, setImageUrl] = useState();
    const [index, setIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isSelectShopOpen, setIsSelectShopOpen] = useState(false);
    const [shopName, setShopName] = useState('');

    const { stores, isLoadingShop, hasMoreShop: hasMore, loadMoreShop: onLoadMore } = useContext(AppContext);

    const handleSelectionChange = (e) => {
        const shopName = e.target.value;
        if (shopName) {
            setShopName(shopName);
            return;
        }
        setShopName('');
    };

    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isSelectShopOpen,
        shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
        onLoadMore,
    });

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

    const handleAddNew = async function () {
        const isValid = index && imageUrl && shopName;
        if (!isValid) {
            showMessage('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }
        try {
            setIsLoading(true);
            const imageURL = await uploadImage(imageUrl, 'banners');
            await addDocument('banners', {
                image: imageURL,
                index,
                shopName,
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
        setIndex(0);
        setImageUrl('');
        setShopName('');
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
                                <div className="flex gap-4">
                                    <Select
                                        items={stores}
                                        isLoading={isLoadingShop}
                                        onChange={handleSelectionChange}
                                        onOpenChange={setIsSelectShopOpen}
                                        scrollRef={scrollerRef}
                                        isRequired
                                        label="Cửa hàng"
                                        selectionMode="single"
                                        selectorIcon={<SelectorIcon />}
                                        placeholder="Chọn cửa hàng"
                                    >
                                        {(store) => (
                                            <SelectItem
                                                key={store.shopName}
                                                value={store.shopName}
                                                className="capitalize"
                                                startContent={
                                                    <Avatar
                                                        src={store.imageURL}
                                                        alt={store.name}
                                                        size="small"
                                                        className="h-6 w-6"
                                                    />
                                                }
                                            >
                                                {store.name}
                                            </SelectItem>
                                        )}
                                    </Select>
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
                                <Button color="danger" variant="light" onPress={onClose}>
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
