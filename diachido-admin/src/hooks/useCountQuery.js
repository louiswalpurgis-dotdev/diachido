import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const useCountQuery = (collectionName, createdByUid) => {
    const [totalCount, setTotalCount] = useState(0); //Tổng số lượt
    const [published, setPublished] = useState(0); // Đếm số lượng đã duyệt
    const [pending, setPending] = useState(0); // Đếm số lượng chờ duyệt

    useEffect(() => {
        const fetchData = async () => {
            let collectionRef = collection(db, collectionName);
            let collectionQuery = query(collectionRef, where('createdBy.uid', '==', createdByUid));

            const unsubscribe = onSnapshot(collectionQuery, (snapshot) => {
                let count = snapshot.size;
                let countPublished = snapshot.docs.filter((doc) => doc.data().published === true).length;
                let countPending = snapshot.docs.filter((doc) => doc.data().published === false).length;

                setTotalCount(count);
                setPublished(countPublished || 0);
                setPending(countPending || 0);
            });

            return () => {
                unsubscribe(); // Gọi phương thức unsubscribe
            };
        };

        fetchData();
    }, [collectionName, createdByUid]);

    return { totalCount, published, pending };
};

export default useCountQuery;
