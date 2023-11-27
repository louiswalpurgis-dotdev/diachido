import { useState, useRef, useContext, useEffect } from 'react';
import {
    Card,
    CardBody,
    Image,
    Input,
    SelectItem,
    Textarea,
    Select,
    CardHeader,
    Button,
    Chip,
} from '@nextui-org/react';
import SelectLocation from '../components/Stores/SelectLocation';
import { Back, SelectorIcon } from '../components/Icons';
import { message } from 'antd';
import { validateImageShop } from '../validates/Image';
import { ValidateShop } from '../validates/Store';
import { removeAccents } from '../utils/removeAccents';
import { AppContext } from '../Context/AppProvider';
import { deleteImage, updateDocumentFields, uploadImage } from '../firebase/services';
import { generateKeywords } from '../utils/generateKeywords';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import showMessage from '../utils/message';

const EditStore = ({ setType, store }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const imageInputRef = useRef(null);
    const [collections, setCollections] = useState(new Set([]));
    const [completedAddress, setCompletedAddress] = useState([]);
    const [onSubmit, setOnSubmit] = useState(false); // loading
    const [image, setImage] = useState('');
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);

    const {
        collections: allCollections,
        loadMoreCollection: onLoadMore,
        hasMoreCollection: hasMore,
        isLoadingCollection,
    } = useContext(AppContext);
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isCollectionOpen,
        shouldUseLoader: false,
        onLoadMore,
    });
    const [locations, setLocations] = useState([
        <SelectLocation
            key={0}
            index={0}
            setCompletedAddress={setCompletedAddress}
            completedAddress={completedAddress}
            onSubmit={onSubmit}
        />,
    ]);

    const addLocation = () => {
        setLocations([
            ...locations,
            <SelectLocation
                key={locations.length}
                index={locations.length}
                setCompletedAddress={setCompletedAddress}
                completedAddress={completedAddress}
            />,
        ]);
    };

    const handleAddLocation = () => {
        console.log(completedAddress);
        if (completedAddress[completedAddress.length - 1] === '') {
            message.error('Hãy hoàn thành địa chỉ trước khi thêm địa chỉ mới');
            return;
        }
        addLocation();
    };

    const handleTitleChange = (value) => {
        value = value.replaceAll(/\W/g, '');
        let slug = value.toLowerCase().replace(/đ/g, 'd').replaceAll(' ', '');
        slug = removeAccents(slug);
        setSlug(slug);
        setTitle(value);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        validateImageShop(file).then((isValid) => {
            if (!isValid) {
                return;
            }
            setImage(file);
        });
    };

    const handleImageClick = () => {
        imageInputRef.current.click();
    };

    const handleUpDateStore = async () => {
        const isValid = ValidateShop(title, description, slug, completedAddress, collections);
        if (!isValid) return;
        if (image) {
            await validateImageShop(image).then((isValid) => {
                if (!isValid) {
                    return;
                }
            });
        }
        setOnSubmit(true);
        try {
            // check new and old address
            const newLocations = completedAddress.map((item) => {
                return { address: item, city: 'Đà Nẵng' };
            });
            const newCollections = Array.from(collections);
            let oldImageURL = store.imageURL;
            let imageURL = store.imageURL;
            if (image) {
                imageURL = await uploadImage(image, 'stores');
            }
            const data = {
                name: title,
                shopName: slug,
                description: description,
                imageURL: imageURL,
                collectionsID: newCollections,
                locations: newLocations,
                keywords: generateKeywords(title?.toLowerCase()),
            };
            updateDocumentFields('shops', store.id, data);
            deleteImage(oldImageURL);

            showMessage('Cập nhật cửa hàng thành công', 'success');
        } catch (error) {
            showMessage(error.message, 'error');
        } finally {
            setOnSubmit(false);
        }
    };

    useEffect(() => {
        if (store) {
            setTitle(store.name);
            setDescription(store.description);
            setSlug(store.shopName);
            setCollections(new Set(store.collectionsID));
            const newLocations = store.locations.map((location) => {
                return (
                    <SelectLocation
                        key={location.address}
                        index={locations.length - 1}
                        setCompletedAddress={setCompletedAddress}
                        completedAddress={completedAddress}
                        onSubmit={onSubmit}
                        hasAddress={location}
                    />
                );
            });
            setLocations(newLocations);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [store]);
    return (
        <div className=" container mx-auto">
            <div className="mb-4 flex items-center">
                {setType && (
                    <Button auto size="sm" variant="light" isIconOnly onClick={() => setType('view')} className="mr-2">
                        <Back />
                    </Button>
                )}
                <h1 className="text-xl font-bold text-foreground/90">Chỉnh sửa cửa hàng</h1>
            </div>
            <div className="flex flex-col gap-4">
                {/* Thông tin cửa hàng */}
                <Card isBlurred className="border-none bg-background/60 dark:bg-default-100/50">
                    <CardBody>
                        <div className="flex gap-6">
                            <div className="flex flex-shrink-0 flex-col items-center gap-y-2">
                                <div
                                    className="h-32 w-32 cursor-pointer overflow-hidden rounded-2xl shadow-md transition-all duration-400 hover:bg-gray-50"
                                    onClick={handleImageClick}
                                >
                                    {image ? (
                                        <Image
                                            alt="Album cover"
                                            className="h-full w-full object-cover shadow-2xl"
                                            src={URL.createObjectURL(image)}
                                        />
                                    ) : (
                                        <Image
                                            alt="Album cover"
                                            className="h-full w-full object-cover shadow-2xl"
                                            src={store?.imageURL}
                                        />
                                    )}
                                </div>
                                <input
                                    type="file"
                                    accept="image/jpeg, image/png"
                                    className="hidden rounded border p-2"
                                    onChange={handleImageUpload}
                                    ref={imageInputRef}
                                />
                                <Input
                                    type="text"
                                    variant="bordered"
                                    value={slug}
                                    isReadOnly
                                    description="Dùng để tạo url cửa hàng"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-small text-default-400">/</span>
                                        </div>
                                    }
                                />
                            </div>
                            <div className="flex w-full flex-col">
                                <Input
                                    type="text"
                                    variant="bordered"
                                    label="Tên cửa hàng"
                                    labelPlacement="outside"
                                    placeholder="Tên cửa hàng"
                                    isRequired
                                    className="text-large font-medium"
                                    value={title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                />
                                <Textarea
                                    variant="bordered"
                                    isRequired
                                    label="Mô tả cửa hàng"
                                    labelPlacement="outside"
                                    placeholder="Mô tả cửa hàng"
                                    className="font-base col-span-12 mb-6 mt-2 text-foreground/90 md:col-span-6 md:mb-0"
                                    minRows={3}
                                    maxRows={3}
                                    value={description}
                                    onValueChange={setDescription}
                                />
                            </div>
                        </div>
                    </CardBody>
                </Card>
                {/* Địa chỉ */}
                <Card isBlurred className=" mt-4 space-y-2 bg-background/60 py-4 dark:bg-default-100/50">
                    <CardHeader className="justify-between">
                        <p className="ml-4 text-lg font-semibold">Địa chỉ</p>
                        <Button
                            auto
                            size="small"
                            color="secondary"
                            variant="shadow"
                            className="mr-6"
                            onClick={() => {
                                handleAddLocation();
                            }}
                        >
                            Thêm địa chỉ
                        </Button>
                    </CardHeader>
                    <CardBody className="gap-y-8">
                        {locations.map((location, index) => (
                            <div key={index}>{location}</div>
                        ))}
                    </CardBody>
                </Card>
                {/* Danh mục */}
                <Card className=" mt-4 space-y-2 bg-background/60 py-4 dark:bg-default-100/50">
                    <CardHeader>
                        <p className="ml-4 text-lg font-semibold">Danh mục</p>
                    </CardHeader>
                    <CardBody className="capitalize">
                        <Select
                            items={allCollections}
                            isRequired
                            selectedKeys={collections}
                            onSelectionChange={setCollections}
                            isLoading={isLoadingCollection}
                            scrollRef={scrollerRef}
                            onOpenChange={setIsCollectionOpen}
                            label="Danh mục"
                            variant="flat"
                            selectionMode="multiple"
                            selectorIcon={<SelectorIcon />}
                            placeholder="Chọn danh mục"
                            description="Có thể chọn nhiều mục"
                            className="max-w-sm"
                            renderValue={(items) => {
                                return (
                                    <div className="flex flex-wrap gap-2">
                                        {items.map((item) => (
                                            <Chip key={item.key} className="capitalize">
                                                {item.data.name}
                                            </Chip>
                                        ))}
                                    </div>
                                );
                            }}
                        >
                            {(coll) => (
                                <SelectItem key={coll.id} className="capitalize">
                                    {coll.name}
                                </SelectItem>
                            )}
                        </Select>
                    </CardBody>
                </Card>
                <div className="ml-auto">
                    <Button
                        auto
                        size="small"
                        color="danger"
                        variant="light"
                        className="uppercase"
                        onClick={() => {
                            setType('view');
                        }}
                    >
                        Huỷ
                    </Button>
                    <Button
                        auto
                        size="small"
                        color="primary"
                        isLoading={onSubmit}
                        variant="shadow"
                        className="uppercase"
                        onClick={() => {
                            handleUpDateStore();
                        }}
                    >
                        Cập nhật
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default EditStore;
