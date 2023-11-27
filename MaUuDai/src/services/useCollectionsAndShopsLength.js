import { useMemo } from 'react';
import useFirestore from '~/hooks/useFirestore';

function useCollectionsAndShopsLength() {
    const { documents: collections } = useFirestore('collections',null,null, 'index');

    const collectionIds = useMemo(() => {
        return collections.map((item) => item.id);
    }, [collections]);

    const shopsInCollectionsCondition = useMemo(() => {
        return {
            fieldName: 'collectionsID',
            operator: 'array-contains-any',
            compareValue: collectionIds,
        };
    }, [collectionIds]);

    const { documents: shopsInCollections } = useFirestore('shops', shopsInCollectionsCondition);

    const collectionsWithShopLength = useMemo(() => {
        return collections.map((collection) => {
            const shopLength = shopsInCollections.filter((shop) => shop.collectionsID.includes(collection.id)).length;
            return {
                ...collection,
                shopLength,
            };
        });
    }, [collections, shopsInCollections]);

    return collectionsWithShopLength;
}

export default useCollectionsAndShopsLength;
