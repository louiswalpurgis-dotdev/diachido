import { collection, orderBy, query, where, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '~/firebase/config'; // Đảm bảo bạn đã import db từ firebase config

// Custom hook to fetch data based on conditions
const useDataByConditions = (collectionName, conditions) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        if (!collectionName || !conditions || !Array.isArray(conditions) || conditions.length === 0) {
            return;
        }

        let collectionRef = collection(db, collectionName);
        let collectionQuery = query(collectionRef, orderBy('createdAt', 'desc'));

        conditions.forEach((cond) => {
            if (cond && cond.compareValue && cond.compareValue.length > 0) {
                collectionQuery = query(collectionQuery, where(cond.fieldName, cond.operator, cond.compareValue));
            }
        });

        try {
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
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }, [collectionName, conditions]);

    return documents;
};

export default useDataByConditions;
