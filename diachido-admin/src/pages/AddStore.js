import { useState, useRef, useContext } from 'react';
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
import { UploadImage } from '../components/Icons';
import { validateImageShop } from '../validates/Image';
import { ValidateShop } from '../validates/Store';
import { removeAccents } from '../utils/removeAccents';
import { AppContext } from '../Context/AppProvider';
import { AuthContext } from '../Context/AuthProvider';
import { addDocument, uploadImage } from '../firebase/services';
import { generateKeywords } from '../utils/generateKeywords';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import Text from '../components/Text';

const AddStore = ({ setType }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [slug, setSlug] = useState('');
    const imageInputRef = useRef(null);
    const [collections, setCollections] = useState(new Set([]));
    const [completedAddress, setCompletedAddress] = useState([]);
    const [onSubmit, setOnSubmit] = useState(false); // [true, false
    const [image, setImage] = useState('');
    const [isCollectionOpen, setIsCollectionOpen] = useState(false);

    const {
        collections: allCollections,
        loadMoreCollection: onLoadMore,
        hasMoreCollection: hasMore,
        isLoadingCollection,
    } = useContext(AppContext);
    const {
        user: { displayName, role, uid },
    } = useContext(AuthContext);

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
        let newValue = value.replaceAll(/\W/g, '');
        let slug = newValue.toLowerCase().replace(/đ/g, 'd').replaceAll(' ', '');
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

    const handleAddStore = async () => {
        const isValid = ValidateShop(title, description, slug, completedAddress, collections);
        const imageIsValid = await validateImageShop(image);
        if (!isValid || !imageIsValid) return;
        setOnSubmit(true);
        try {
            const newLocations = completedAddress.map((item) => {
                return { address: item, city: 'Đà Nẵng' };
            });
            const newCollections = Array.from(collections);
            // upload image
            const imageURL = await uploadImage(image, 'stores');
            addDocument('shops', {
                name: title,
                shopName: slug,
                description: description,
                imageURL: imageURL,
                collectionsID: newCollections,
                locations: newLocations,
                followers: [],
                followersCount: 0,
                likers: [],
                likersCount: 0,
                ratings: [],
                keywords: generateKeywords(title?.toLowerCase()),
                createdBy: {
                    name: displayName,
                    uid: uid,
                },
                isPuslished: ['admin', 'moderator'].includes(role) ? true : false,
            });
            removeDataField();
            setOnSubmit(false);
            message.success('Đã thêm cửa hàng thành công');
        } catch (error) {
            setOnSubmit(false);
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
            return;
        }
    };

    const removeDataField = () => {
        setTitle('');
        setDescription('');
        setSlug('');
        setImage('');
        setCollections(new Set([]));
        setLocations([]);
    };
    return (
        <div className=" container mx-auto py-4">
            <div className="flex items-center">
                {setType && (
                    <Button auto size="sm" variant="light" isIconOnly onClick={() => setType('view')} className="mr-2">
                        <Back />
                    </Button>
                )}
                <Text
                    text="::.Thêm cửa hàng"
                    fontSize="25px"
                    fontWeight="font-bold mb-4"
                    colorFrom="#e63946"
                    colorVia="#f1af4c"
                    colorTo="#de99fd"
                />
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
                                        <div className="flex flex-col items-center">
                                            <UploadImage />
                                            <p className="font-light">Tải hình ảnh</p>
                                        </div>
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
                <Button
                    auto
                    color="primary"
                    isLoading={onSubmit}
                    variant="shadow"
                    className="uppercase"
                    onClick={() => {
                        handleAddStore();
                    }}
                >
                    Tải lên
                </Button>
            </div>
        </div>
    );
};

export default AddStore;
