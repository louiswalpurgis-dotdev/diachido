import { useState } from 'react';
import { updateDocumentFields } from '~/firebase/services';
import { message } from 'antd';
import { arrayRemove, arrayUnion, increment } from 'firebase/firestore';

const useLike = (uid, shopDetail) => {
    const [isLike, setIsLike] = useState(false);
    const handleLike = async () => {
        const updateField = {
            likers: isLike ? arrayRemove(uid) : arrayUnion(uid),
            likersCount: isLike ? increment(-1) : increment(1),
        };
        if (!uid) {
            message.error('Bạn cần đăng nhập để thích !');
            return;
        }
        try {
            await updateDocumentFields('shops', shopDetail.id, updateField);
            message.success(`${isLike ? 'Bỏ thích' : 'Đã thích'} ${shopDetail.name} thành công !`);
            setIsLike(!isLike);
        } catch (error) {
            message.error('Có lỗi xảy ra khi cập nhật dữ liệu.');
        }
    };
    return { isLike, setIsLike, handleLike };
};

export default useLike;
