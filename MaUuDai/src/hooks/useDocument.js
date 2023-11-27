import { useState, useEffect } from 'react';
import { doc, getDoc, collection } from 'firebase/firestore';
import { db } from '~/firebase/config';

const useDocument = (collectionName, documentIds) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        const fetchDocuments = async () => {
            let collectionRef = collection(db, collectionName);
            const documentPromises = documentIds.map(async (documentId) => {
                const documentRef = doc(collectionRef, documentId);
                const docSnapshot = await getDoc(documentRef);
                if (docSnapshot.exists()) {
                    return { ...docSnapshot.data(), id: docSnapshot.id };
                }
                return null;
            });

            const fetchedDocuments = await Promise.all(documentPromises);
            setDocuments(fetchedDocuments.filter((document) => document !== null));
        };
        fetchDocuments();
    }, [collectionName, documentIds]);
    return documents;
};

export default useDocument;
