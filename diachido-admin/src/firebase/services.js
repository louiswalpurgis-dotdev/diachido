import {
    doc,
    setDoc,
    collection,
    Timestamp,
    updateDoc,
    deleteDoc,
    where,
    getDocs,
    writeBatch,
    query,
} from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { db } from '../firebase/config';
import { createUserWithEmailAndPassword, getAuth, updateProfile } from 'firebase/auth';
import showMessage from '../utils/message';

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

export const deleteDocuments = async (collectionName, fieldName, docId) => {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where(fieldName, '==', docId));
    const querySnapshot = await getDocs(q);
    const batch = writeBatch(db);
    querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
    });
    await batch.commit();
};

export const uploadImage = async (image, folder) => {
    const storage = getStorage();
    const formattedDate = new Date().toISOString();
    const type = image.type.split('/')[1];
    const bucket = `${folder}/${formattedDate}.${type}`;
    const storageRef = ref(storage, bucket);
    await uploadBytes(storageRef, image);
    const url = await getDownloadURL(storageRef);
    return url;
};

export const deleteImage = async (url) => {
    const storage = getStorage();
    const storageRef = ref(storage, url);

    deleteObject(storageRef)
        .then(() => {
            return true;
        })
        .catch((error) => {
            return false;
        });
};

export const toggleDisableUser = async (docId, isDeleted) => {
    const userRef = doc(db, 'users', docId);
    await updateDoc(userRef, {
        isDeleted: !isDeleted || false,
    });
};

const defaultImageURL =
    'https://firebasestorage.googleapis.com/v0/b/mauudai.appspot.com/o/defaultAvatar.svg?alt=media&token=a950e653-aab7-40a9-8e82-586fdb3aad4c';

export const createUserWithEmailAndPW = async (email, password, displayName, role) => {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            updateProfile(user, {
                displayName: displayName,
            });
            addDocument('users', {
                displayName: displayName,
                email: email,
                role: role,
                uid: user.uid,
                point: 0,
                providerId: user.providerId,
                photoURL: defaultImageURL,
            });
        })
        .catch((error) => {
            const errorMessage = error.message;
            showMessage(errorMessage, 'error');
        });
};
