import { createContext, useMemo } from 'react';
import useFirestore from '../hooks/useFirebase';
export const AppContext = createContext();

export default function AppProvider({ children }) {
    const collectionsCondition = useMemo(() => {
        return {};
    }, []);
    const {
        documents: collections,
        loadMore: loadMoreCollection,
        hasMore: hasMoreCollection,
        isLoading: isLoadingCollection,
    } = useFirestore('collections', collectionsCondition);

    const storesCondition = useMemo(() => {
        return {};
    }, []);

    const {
        documents: stores,
        loadMore: loadMoreShop,
        hasMore: hasMoreShop,
        isLoading: isLoadingShop,
    } = useFirestore('shops', storesCondition);

    const updatedStores = useMemo(() => {
        return stores.map((store) => ({
            ...store,
            ratings:
                store.ratings.reduce((accumulator, rating) => accumulator + rating.rating, 0) / store.ratings.length,
            locations: store.locations.map((location) => location.address),
        }));
    }, [stores]);

    const userCondition = useMemo(() => {
        return {};
    }, []);
    const {
        documents: users,
        loadMore: loadMoreUser,
        hasMore: hasMoreUser,
        isLoading: isLoadingUser,
    } = useFirestore('users', userCondition, 'createdAt');

    const discountsCondition = useMemo(() => {
        return {};
    }, []);

    const {
        documents: discounts,
        loadMore: loadMoreDiscount,
        hasMore: hasMoreDiscount,
        isLoading: isLoadingDiscount,
    } = useFirestore('discounts', discountsCondition);
    const updatedDiscounts = useMemo(() => {
        return discounts.map((discount) => ({
            ...discount,
            showTime: discount.showTime.toDate(),
            startTime: discount.startTime.toDate(),
            endTime: discount.endTime.toDate(),
        }));
    }, [discounts]);

    const commentsCondition = useMemo(() => {
        return {};
    }, []);

    const {
        documents: comments,
        loadMore: loadMoreComment,
        hasMore: hasMoreComment,
        isLoading: isLoadingComment,
    } = useFirestore('comments', commentsCondition);

    return (
        <AppContext.Provider
            value={{
                collections,
                loadMoreCollection,
                isLoadingCollection,
                hasMoreCollection,
                users,
                loadMoreUser,
                hasMoreUser,
                isLoadingUser,
                stores: updatedStores,
                loadMoreShop,
                hasMoreShop,
                isLoadingShop,

                discounts: updatedDiscounts,
                loadMoreDiscount,
                hasMoreDiscount,
                isLoadingDiscount,
                comments,
                loadMoreComment,
                hasMoreComment,
                isLoadingComment,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}
