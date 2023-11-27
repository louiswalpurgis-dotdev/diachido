import { useState, useEffect } from 'react';
import { collection, onSnapshot, orderBy, query, where, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase/config';

const useFirestore = (collectionName, condition, orderByField = 'createdAt') => {
    const [documents, setDocuments] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [lastDocument, setLastDocument] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const initLimit = 20;
    useEffect(() => {
        let collectionRef = collection(db, collectionName);
        let collectionQuery = query(collectionRef, orderBy(orderByField, 'desc'), limit(initLimit));
        // Kiểm tra xem condition có phải là 1 mảng các điều kiện không
        if (condition && condition.length >= 2) {
            condition.forEach((cond) => {
                if (cond && cond.compareValue && cond.compareValue.length) {
                    collectionQuery = query(collectionQuery, where(cond.fieldName, cond.operator, cond.compareValue));
                }
            });
        } else if (condition && condition.fieldName) {
            collectionQuery = query(
                collectionQuery,
                where(condition.fieldName, condition.operator, condition.compareValue),
            );
        }
        const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
            const documents = snapshot.docs.map((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt?.toDate();
                return {
                    ...data,
                    id: doc.id,
                    createdAt: createdAt ? createdAt.toString() : null,
                };
            });
            setDocuments(documents);
            setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(snapshot.docs.length >= initLimit);
        });
        return () => {
            unsubscribe();
        };
    }, [collectionName, condition, orderByField]);
    const loadMore = async () => {
        if (!hasMore) {
            return;
        }
        setIsLoading(true);
        let collectionRef = collection(db, collectionName);
        let collectionQuery = query(
            collectionRef,
            orderBy(orderByField, 'desc'),
            startAfter(lastDocument),
            limit(initLimit),
        );
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
        // Snapshot data
        const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
            const documents = snapshot.docs.map((doc) => {
                const data = doc.data();
                const createdAt = data.createdAt?.toDate();
                return {
                    ...data,
                    id: doc.id,
                    createdAt: createdAt ? createdAt.toString() : null,
                };
            });
            setDocuments((prev) => [...prev, ...documents]);
            setLastDocument(snapshot.docs[snapshot.docs.length - 1]);
            setHasMore(snapshot.docs.length >= initLimit);
            setIsLoading(false);
        });
        return () => {
            unsubscribe();
        };
    };
    return { documents, isLoading, hasMore, loadMore };
};

export default useFirestore;
