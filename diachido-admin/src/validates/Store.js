import { message } from 'antd';

export const ValidateShop = (title, description, slug, address, collections) => {
    if (!title || !description || !slug || !address || !collections) {
        message.error('Hãy điền đầy đủ thông tin');
        return false;
    }
    if (title.length > 50) {
        message.error('Tên cửa hàng không được quá 50 ký tự');
        return false;
    }
    if (description.length > 500) {
        message.error('Mô tả cửa hàng không được quá 500 ký tự');
        return false;
    }
    if (slug.length > 50) {
        message.error('Slug không được quá 50 ký tự');
        return false;
    }
    if (address.find((item) => item === '')) {
        message.error('Hãy nhập đầy đủ địa chỉ!');
        return false;
    }
    if (collections.length === 0) {
        message.error('Hãy chọn ít nhất 1 danh mục!');
        return false;
    }
    return true;
};
