import { doc, setDoc, collection, Timestamp, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '~/firebase/config';
export const addDocument = async (collectionName, data) => {
    const newDocRef = doc(collection(db, collectionName));
    await setDoc(newDocRef, {
        ...data,
        createdAt: Timestamp.now(),
    });
};

export const updateDocumentFields = async (collectionName, docId, fieldsToUpdate) => {
    // Tạo tham chiếu đến tài liệu cần cập nhật
    const docRef = doc(db, collectionName, docId);

    // Cập nhật các trường trong tài liệu
    await updateDoc(docRef, {
        ...fieldsToUpdate,
        updatedAt: Timestamp.now(),
    });
};

export const deleteDocument = async (collectionName, docId) => {
    // Tạo tham chiếu đến tài liệu cần xóa
    const docRef = doc(db, collectionName, docId);

    // Xóa tài liệu
    await deleteDoc(docRef);
};
