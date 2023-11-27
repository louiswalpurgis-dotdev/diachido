import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query, where, limit } from 'firebase/firestore';
import { db } from '~/firebase/config';

const useFirestore = (collectionName, condition, initialLimit = null, orderByField = 'createdAt') => {
    const [documents, setDocuments] = useState([]);
    const [limitValue, setLimitValue] = useState(initialLimit);

    useEffect(() => {
        let collectionRef = collection(db, collectionName);
        let collectionQuery = query(collectionRef, orderBy(orderByField, 'desc'));

        // Kiểm tra xem condition có phải là 1 mảng các điều kiện không
        if (condition && condition.length >= 2) {
            condition.forEach((cond) => {
                if (cond && cond.compareValue && cond.compareValue.length) {
                    collectionQuery = query(collectionQuery, where(cond.fieldName, cond.operator, cond.compareValue));
                }
            });
        } else if (condition && condition.compareValue && condition.compareValue.length > 0) {
            collectionQuery = query(
                collectionQuery,
                where(condition.fieldName, condition.operator, condition.compareValue),
            );
        }

        if (limitValue) {
            collectionQuery = query(collectionQuery, limit(limitValue));
        }

        const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));
            setDocuments(documents);
        });

        return () => {
            unsubscribe();
        };
    }, [collectionName, condition, limitValue, orderByField]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, collectionName), () => {});
        return () => {
            unsubscribe();
        };
    }, [collectionName, limitValue]);
    const loadMore = () => {
        setLimitValue((prev) => (prev !== null ? prev + 8 : 16));
    };
    return { documents, loadMore };
};

export default useFirestore;
