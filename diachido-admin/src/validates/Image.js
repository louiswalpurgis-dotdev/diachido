import { message } from 'antd';

export const validateImageShop = (file) => {
    if (!file) {
        message.error('Hãy chọn ảnh');
        return false;
    }
    // kích thước 474x474 hoặc 96x96
    const maxSize = 474 * 474;
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        message.error('Định dạng ảnh không hợp lệ. Yêu cầu: jpg, png');
        return false;
    }

    // Khởi tạo image
    const img = new Image();
    img.src = URL.createObjectURL(file);

    return new Promise((resolve) => {
        img.onload = () => {
            const width = img.naturalWidth;
            const height = img.naturalHeight;
            if (width !== height) {
                message.error('Hình ảnh phải có kích thước 474x474');
                resolve(false);
            } else if (width * height > maxSize) {
                message.error('Kích thước ảnh quá lớn. Yêu cầu: 474x474');
                resolve(false);
            } else {
                resolve(true);
            }
        };
    });
};
