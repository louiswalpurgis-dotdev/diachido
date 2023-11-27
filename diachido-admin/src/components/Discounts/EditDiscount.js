import { Button, Card, CardBody, CardHeader, Input, Textarea, Switch, ButtonGroup } from '@nextui-org/react';
import { Back, Money, Percent } from '../Icons';
import { useEffect, useState } from 'react';
import { DatePicker } from 'antd';
import { ValidateDiscount } from '../../validates/Discount';
import { updateDocumentFields } from '../../firebase/services';
import { Timestamp } from 'firebase/firestore';
import moment from 'moment/moment';
import showMessage from '../../utils/message';

const { RangePicker } = DatePicker;

const EditDiscount = ({ setType, discount }) => {
    const [isPercent, setIsPercent] = useState(true);
    const [hasCode, setHasCode] = useState(false);
    const [title, setTitle] = useState('');
    const [shopId, setShopId] = useState('');
    const [description, setDescription] = useState('');
    const [discountValue, setDiscountValue] = useState(0);
    const [code, setCode] = useState('');
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [showTime, setShowTime] = useState();
    const [forwardUrl, setForwardUrl] = useState('https://diachido.com.vn');
    const [loading, setLoading] = useState(false);

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
            updateDocumentFields('discounts', discount.id, {
                name: title,
                description: description,
                amount: newAmount,
                code: code ? code : null,
                startTime: Timestamp.fromDate(new Date(startTime)),
                endTime: Timestamp.fromDate(new Date(endTime)),
                showTime: Timestamp.fromDate(new Date(showTime)),
                forwardUrl: forwardUrl,
            });
            showMessage('Cập nhật thành công!', 'success');
            setType('view');
        } catch (error) {
            showMessage(error.message, 'error');
            return;
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (discount) {
            setTitle(discount.name);
            setShopId(discount.shopID);
            setDescription(discount.description);
            setDiscountValue(discount.amount <= 1 ? discount.amount * 100 : discount.amount);
            setCode(discount.code);
            setStartTime(discount.startTime);
            setEndTime(discount.endTime);
            setShowTime(discount.showTime);
            setForwardUrl(discount.forwardUrl);
            setIsPercent(discount.amount <= 1);
            setHasCode(discount.code !== null);
        }
    }, [discount]);
    return (
        <div className=" mx-auto container">
            <div className="flex flex-col gap-4">
                <Card className=" bg-background/60 dark:bg-default-100/50 space-y-2 mt-4 py-4">
                    <CardHeader>
                        <Button
                            auto
                            size="sm"
                            variant="light"
                            isIconOnly
                            onClick={() => setType('view')}
                            className="mr-2"
                        >
                            <Back />
                        </Button>
                        <p className="font-semibold text-lg uppercase">Cập nhật ưu đãi</p>
                    </CardHeader>
                    <CardBody className="gap-y-4">
                        <Input
                            type="text"
                            variant="bordered"
                            label="Tên ưu đãi"
                            labelPlacement="outside"
                            placeholder="vd: Cá sấu hấp xì dầu"
                            isRequired
                            className="font-medium text-large"
                            value={title}
                            onValueChange={setTitle}
                        />
                        <Textarea
                            variant="bordered"
                            isRequired
                            label="Mô tả ưu đãi"
                            labelPlacement="outside"
                            placeholder="vd: Giảm 20% cho tất cả các món cá sấu hấp xì dầu, hoặc các điều kiện để sử dụng ưu đãi"
                            className="col-span-12 md:col-span-6 mb-6 md:mb-0 font-base text-foreground/90"
                            minRows={3}
                            maxRows={3}
                            value={description}
                            onValueChange={setDescription}
                        />
                        {/* Ưu đãi và code */}
                        <div className="flex justify-between gap-x-8">
                            <div className="flex flex-col gap-x-2 w-1/2">
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
                                        <p className="font-medium text-sm">{isPercent ? 'Phần trăm' : 'VND'}</p>
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
                                            <span className="text-default-400 text-small">
                                                {isPercent ? '%' : 'VND'}
                                            </span>
                                        </div>
                                    }
                                />
                            </div>
                            <div className="flex flex-col justify-end items-end gap-x-2 w-1/2">
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
                                            <span className="text-default-400 text-small">@</span>
                                        </div>
                                    }
                                    value={code}
                                    onValueChange={setCode}
                                />
                            </div>
                        </div>
                        <div className="flex justify-between gap-8 w-full mt-4">
                            <div className="w-1/2 space-y-2">
                                <h1 className="text-sm font-medium">
                                    Thời gian khuyến mãi
                                    <span className="text-red-500 ml-1">*</span>
                                </h1>
                                <RangePicker
                                    className="w-full p-2 rounded-xl bg-transparent"
                                    showTime
                                    size="large"
                                    onCalendarChange={handleCalendarChange}
                                    value={startTime && endTime ? [moment(startTime), moment(endTime)] : null}
                                    placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
                                />
                            </div>
                            <div className="w-1/2 space-y-2 flex flex-col items-end">
                                <h1 className="text-sm font-medium">
                                    Thời gian áp dụng
                                    <span className="text-red-500 ml-1">*</span>
                                </h1>
                                <DatePicker
                                    showTime
                                    size="large"
                                    className="w-[20rem] rounded-xl p-2 bg-transparent"
                                    placeholder="Ngày áp dụng"
                                    value={showTime ? moment(showTime) : null}
                                    onChange={handleShowTime}
                                />
                            </div>
                        </div>
                        <div className="flex gap-x-4 items-end">
                            <Input
                                type="url"
                                label="Link ưu đãi"
                                placeholder="vd: diachido.com.vn"
                                variant="bordered"
                                labelPlacement="outside"
                                className="max-w-xs mt-4"
                                value={forwardUrl}
                                onValueChange={setForwardUrl}
                                pattern="https://.*"
                                startContent={
                                    <div className="pointer-events-none flex items-center">
                                        <span className="text-default-400 text-small">https://</span>
                                    </div>
                                }
                            />
                        </div>
                    </CardBody>
                </Card>
                <div className="ml-auto">
                    <ButtonGroup className="gap-1">
                        <Button
                            auto
                            size="small"
                            onClick={() => {
                                setType('view');
                            }}
                            color="danger"
                            variant="ghost"
                            className="uppercase"
                        >
                            Huỷ
                        </Button>
                        <Button
                            auto
                            size="small"
                            loading={loading}
                            onClick={() => {
                                handleSubmit();
                            }}
                            color="primary"
                            variant="shadow"
                            className="uppercase"
                        >
                            Cập nhật
                        </Button>
                    </ButtonGroup>
                </div>
            </div>
        </div>
    );
};

export default EditDiscount;
