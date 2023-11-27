import { message } from 'antd';
const validateRequiredFields = (fields) => {
    for (const field of fields) {
        if (!field) {
            message.error('Vui lòng nhập đầy đủ thông tin');
            return false;
        }
    }
    return true;
};

const validateLength = (value, minLength, maxLength, errorMessage) => {
    if (value.length < minLength || value.length > maxLength) {
        message.error(errorMessage);
        return false;
    }
    return true;
};

const validateDiscountValue = (value, isPercent, min, max, errorMessage) => {
    if (isPercent) {
        if (value < min || value > max) {
            message.error(errorMessage);
            return false;
        }
    } else {
        if (value < min || value > max) {
            message.error(errorMessage);
            return false;
        }
    }
    return true;
};

const validateCode = (hasCode, code) => {
    if (hasCode && !code) {
        message.error('Vui lòng nhập mã giảm giá');
        return false;
    }
    return true;
};

const validateTime = (startTime, endTime, showTime) => {
    if (startTime > endTime) {
        message.error('Thời gian bắt đầu phải nhỏ hơn thời gian kết thúc');
        return false;
    }
    if (startTime > showTime || endTime < showTime) {
        message.error('Thời gian hiển thị nằm trong khoảng thời gian bắt đầu và kết thúc');
        return false;
    }
    return true;
};

const validateUrl = (url) => {
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
    // Kiểm tra url đã có http hoặc https chưa
    // nếu chưa sẽ thêm vào và kiểm tra
    if (!url.includes('http://') && !url.includes('https://')) {
        url = 'https://' + url;
    }
    if (!urlRegex.test(url)) {
        message.error('Vui lòng nhập đúng định dạng url');
        return false;
    }
    return true;
};

export const ValidateDiscount = (
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
) => {
    if (
        !validateRequiredFields([title, description, discountValue, startTime, endTime, showTime, forwardUrl, shopId])
    ) {
        return false;
    }
    if (!validateLength(title, 5, 50, 'Tiêu đề phải từ 5 đến 50 ký tự')) {
        return false;
    }
    if (!validateLength(description, 5, 200, 'Mô tả phải từ 5 đến 200 ký tự')) {
        return false;
    }
    if (
        !validateDiscountValue(
            discountValue,
            isPercent,
            isPercent ? 0 : 1000,
            isPercent ? 100 : 1000000000,
            isPercent ? 'Giá trị giảm giá phải từ 0 đến 100' : 'Giá trị giảm giá phải lớn hơn 1000',
        )
    ) {
        return false;
    }
    if (!validateCode(hasCode, code)) {
        return false;
    }
    if (!validateTime(startTime, endTime, showTime)) {
        return false;
    }
    if (!validateUrl(forwardUrl)) {
        return false;
    }
    return true;
};
