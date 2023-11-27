import { useEffect, useState } from 'react';
import { Timestamp, collection, getCountFromServer, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';

const useCollectionCount = (collectionName) => {
    const [totalCount, setTotalCount] = useState(0); //Tổng số lượt
    const [aWeekCount, setAWeekCount] = useState(0); //Số lượt trong 1 tuần
    const [countByDay, setCountByDay] = useState({}); //sắp xếp theo ngày

    useEffect(() => {
        const fetchData = async () => {
            const oneWeekAgo = Timestamp.fromDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
            let collectionRef = collection(db, collectionName);

            // Tổng số lượt
            const totalSnapshot = await getCountFromServer(collectionRef);
            setTotalCount(totalSnapshot.data().count);

            // Số lượt trong 1 tuần
            const weekQuery = query(collectionRef, where('createdAt', '>=', oneWeekAgo));
            const unsubscribe = onSnapshot(weekQuery, (snapshot) => {
                setAWeekCount(snapshot.size);
                const newCountByDay = {};
                snapshot.docs.forEach((doc) => {
                    const date = doc.data().createdAt.toDate().toISOString().split('T')[0];
                    newCountByDay[date] = (newCountByDay[date] || 0) + 1;
                });
                setCountByDay(newCountByDay);
            });

            return () => {
                unsubscribe(); // Gọi phương thức unsubscribe
            };
        };

        fetchData();
    }, [collectionName]);

    return { totalCount, aWeekCount, countByDay };
};

export default useCollectionCount;
