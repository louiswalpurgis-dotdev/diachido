import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Input,
    Textarea,
    Switch,
    SelectItem,
    Select,
    Avatar,
} from '@nextui-org/react';
import { Money, Percent, SelectorIcon } from '../components/Icons';
import { useContext, useState } from 'react';
import { DatePicker, message } from 'antd';
import { ValidateDiscount } from '../validates/Discount';
import { AppContext } from '../Context/AppProvider';
import { addDocument } from '../firebase/services';
import { Timestamp } from 'firebase/firestore';
import { useInfiniteScroll } from '@nextui-org/use-infinite-scroll';
import moment from 'moment/moment';
import { AuthContext } from '../Context/AuthProvider';
import Text from '../components/Text';

const { RangePicker } = DatePicker;

const AddDiscount = () => {
    const [isPercent, setIsPercent] = useState(true);
    const [hasCode, setHasCode] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [code, setCode] = useState('');
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [showTime, setShowTime] = useState();
    const [forwardUrl, setForwardUrl] = useState('');
    const [shopId, setShopId] = useState('');
    const [loading, setLoading] = useState(false);

    const [isSelectShopOpen, setIsSelectShopOpen] = useState(false);

    const { stores, isLoadingShop, hasMoreShop: hasMore, loadMoreShop: onLoadMore } = useContext(AppContext);
    const {
        user: { displayName, role, uid },
    } = useContext(AuthContext);
    const [, scrollerRef] = useInfiniteScroll({
        hasMore,
        isEnabled: isSelectShopOpen,
        shouldUseLoader: false, // We don't want to show the loader at the bottom of the list
        onLoadMore,
    });

    const handleCalendarChange = (dates, dateStrings) => {
        if (dates && dates.length > 0) {
            setStartTime(dateStrings[0]?.toString());
            setEndTime(dateStrings[1]?.toString());
            return;
        }
        setStartTime(null);
        setEndTime(null);
    };

    const handleShowTime = (date, dateString) => {
        if (dateString) {
            setShowTime(dateString.toString());
            return;
        }
        setShowTime(null);
    };

    const handleSelectionChange = (e) => {
        const newShopId = e.target.value;
        if (newShopId) {
            setShopId(newShopId);
            return;
        }
        setShopId('');
    };

    const handleSubmit = () => {
        setLoading(true);
        const isValid = ValidateDiscount(
            title,
            description,
            discountValue,
            code,
            startTime,
            endTime,
            showTime,
            forwardUrl,
            shopId,
            isPercent,
            hasCode,
        );
        if (!isValid) {
            setLoading(false);
            return;
        }
        try {
            let newAmount = isPercent ? discountValue / 100 : discountValue;
            addDocument('discounts', {
                name: title,
                description: description,
                amount: newAmount,
                code: code ? code : null,
                startTime: Timestamp.fromDate(new Date(startTime)),
                endTime: Timestamp.fromDate(new Date(endTime)),
                showTime: Timestamp.fromDate(new Date(showTime)),
                forwardUrl: forwardUrl.startsWith('https://') ? forwardUrl : `https://${forwardUrl}`,
                shopID: shopId,
                createdBy: {
                    name: displayName,
                    uid: uid,
                },
                isPuslished: ['admin', 'moderator'].includes(role) ? true : false,
            });
            removeDataField();
            setLoading(false);
            message.success('Đã thêm ưu đãi thành công');
        } catch (error) {
            setLoading(false);
            message.error('Đã có lỗi xảy ra, vui lòng thử lại sau');
            return;
        }
        setLoading(false);
    };
    const removeDataField = () => {
        setTitle('');
        setDescription('');
        setDiscountValue(0);
        setEndTime(null);
        setStartTime(null);
        setShowTime(null);
        setCode('');
        setForwardUrl('');
        setShopId('');
    };
    return (
        <div className=" container mx-auto py-4">
            <div className="flex flex-col">
                <Card className=" space-y-2 bg-background/60 py-4 dark:bg-default-100/50">
                    <CardHeader>
                        <Text
                            text="::.Thêm ưu đãi mới"
                            fontSize="25px"
                            fontWeight="font-bold"
                            colorFrom="#e63946"
                            colorVia="#f1af4c"
                            colorTo="#de99fd"
                        />
                    </CardHeader>
                    <CardBody className="gap-y-4">
                        <Input
                            type="text"
                            variant="bordered"
                            label="Tên ưu đãi"
                            labelPlacement="outside"
                            placeholder="vd: Cá sấu hấp xì dầu"
                            isRequired
                            className="text-large font-medium"
                            value={title}
                            onValueChange={setTitle}
                        />
                        <Textarea
                            variant="bordered"
                            isRequired
                            label="Mô tả ưu đãi"
                            labelPlacement="outside"
                            placeholder="vd: Giảm 20% cho tất cả các món cá sấu hấp xì dầu, hoặc các điều kiện để sử dụng ưu đãi"
                            className="font-base col-span-12 mb-6 text-foreground/90 md:col-span-6 md:mb-0"
                            minRows={3}
                            maxRows={3}
                            value={description}
                            onValueChange={setDescription}
                        />
                        {/* Ưu đãi và code */}
                        <div className="flex justify-between gap-x-8">
                            <div className="flex w-1/2 flex-col gap-x-2">
                                <div className="flex gap-x-2">
                                    <p>Loại ưu đãi: </p>
                                    <Switch
                                        defaultSelected
                                        size="sm"
                                        color="secondary"
                                        className="mb-1"
                                        isSelected={isPercent}
                                        onValueChange={setIsPercent}
                                        thumbIcon={({ isSelected, className }) =>
                                            isSelected ? (
                                                <Percent className={className} />
                                            ) : (
                                                <Money className={className} />
                                            )
                                        }
                                    >
                                        <p className="text-sm font-medium">{isPercent ? 'Phần trăm' : 'VND'}</p>
                                    </Switch>
                                </div>
                                <Input
                                    type="number"
                                    label="Giá trị ưu đãi"
                                    placeholder="0.00"
                                    isRequired
                                    min={0}
                                    max={isPercent ? 100 : 100000000}
                                    value={discountValue}
                                    onValueChange={setDiscountValue}
                                    labelPlacement="outside"
                                    variant="bordered"
                                    className="max-w-xs"
                                    endContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-small text-default-400">
                                                {isPercent ? '%' : 'VND'}
                                            </span>
                                        </div>
                                    }
                                />
                            </div>
                            <div className="flex w-1/2 flex-col items-end justify-end gap-x-2">
                                <div className="flex gap-x-2">
                                    <p>Yêu cầu mã: </p>
                                    <Switch
                                        defaultSelected
                                        size="md"
                                        color="success"
                                        className="mb-1"
                                        isSelected={hasCode}
                                        onValueChange={setHasCode}
                                    >
                                        <p className="font-medium">{hasCode ? 'Có' : 'Không'}</p>
                                    </Switch>
                                </div>
                                <Input
                                    label="Mã ưu đãi (nếu có)"
                                    isDisabled={!hasCode}
                                    placeholder="ABC123"
                                    labelPlacement="outside"
                                    variant="bordered"
                                    className="max-w-xs"
                                    startContent={
                                        <div className="pointer-events-none flex items-center">
                                            <span className="text-small text-default-400">@</span>
                                        </div>
                                    }
                                    value={code}
                                    onValueChange={setCode}
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex w-full justify-between gap-8">
                            <div className="w-1/2 space-y-2">
                                <h1 className="text-sm font-medium">
                                    Thời gian khuyến mãi
                                    <span className="ml-1 text-red-500">*</span>
                                </h1>
                                <RangePicker
                                    className="w-full rounded-xl bg-transparent p-2"
                                    showTime
                                    size="large"
                                    onCalendarChange={handleCalendarChange}
                                    value={startTime && endTime ? [moment(startTime), moment(endTime)] : null}
                                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                />
                            </div>
                            <div className="flex w-1/2 flex-col items-end space-y-2">
                                <h1 className="text-sm font-medium">
                                    Thời gian áp dụng
                                    <span className="ml-1 text-red-500">*</span>
                                </h1>
                                <DatePicker
                                    showTime
                                    size="large"
                                    className="w-[20rem] rounded-xl bg-transparent p-2"
                                    placeholder="Ngày áp dụng"
                                    value={showTime ? moment(showTime) : null}
                                    onChange={handleShowTime}
                                />
                            </div>
                        </div>
                        <div className="flex items-end gap-x-4">
                            <Input
                                type="url"
                                label="Link ưu đãi"
                                placeholder="vd: diachido.com.vn"
                                variant="bordered"
                                labelPlacement="outside"
                                className="mt-4 max-w-xs"
                                value={forwardUrl}
                                onValueChange={setForwardUrl}
                                pattern="https://.*"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-small text-default-400">https://</span>
                                    </div>
                                }
                            />
                            <Select
                                items={stores}
                                isLoading={isLoadingShop}
                                onChange={handleSelectionChange}
                                onOpenChange={setIsSelectShopOpen}
                                scrollRef={scrollerRef}
                                isRequired
                                label="Cửa hàng"
                                variant="bordered"
                                selectionMode="single"
                                selectorIcon={<SelectorIcon />}
                                placeholder="Chọn cửa hàng"
                                className="ml-auto max-w-xs"
                            >
                                {(store) => (
                                    <SelectItem
                                        key={store.id}
                                        value={store.id}
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
                        </div>
                    </CardBody>
                </Card>
                <Button
                    auto
                    loading={loading}
                    onClick={() => {
                        handleSubmit();
                    }}
                    color="primary"
                    variant="shadow"
                    className="mt-4 uppercase"
                >
                    Tải lên
                </Button>
            </div>
        </div>
    );
};

export default AddDiscount;
