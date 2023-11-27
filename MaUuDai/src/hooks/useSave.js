import { useState } from 'react';
import { updateDocumentFields } from '~/firebase/services';
import { message } from 'antd';
import { arrayRemove, arrayUnion, increment } from 'firebase/firestore';

const useSave = (uid, shopDetail) => {
    const [isSave, setIsSave] = useState(false);
    const handleSave = async () => {
        const updateField = {
            followers: isSave ? arrayRemove(uid) : arrayUnion(uid),
            followersCount: isSave ? increment(-1) : increment(1),
        };
        if (!uid) {
            message.error('Bạn cần đăng nhập để theo dõi !');
            return;
        }
        try {
            await updateDocumentFields('shops', shopDetail.id, updateField);
            message.success(`${isSave ? 'Bỏ theo dõi' : 'Đã theo dõi'} ${shopDetail.name} thành công !`);
            setIsSave(!isSave);
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật dữ liệu.');
        }
    };
    return { isSave, setIsSave, handleSave };
};

const handleSaveInMap = async (isSave, setIsSave, uid, shopDetail) => {
    const updateField = {
        followers: isSave ? arrayRemove(uid) : arrayUnion(uid),
        followersCount: isSave ? increment(-1) : increment(1),
    };
    if (!uid) {
        message.error('Bạn cần đăng nhập để theo dõi !');
        return;
    }
    try {
        await updateDocumentFields('shops', shopDetail.id, updateField);
        message.success(`${isSave ? 'Bỏ theo dõi' : 'Đã theo dõi'} ${shopDetail.name} thành công !`);
        setIsSave(!isSave);
    } catch (error) {
        message.error('Có lỗi xảy ra khi cập nhật dữ liệu.');
    }
};
export { handleSaveInMap };

export default useSave;
