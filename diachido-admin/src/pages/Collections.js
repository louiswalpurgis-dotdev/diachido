import { useContext } from 'react';
import TableCollections from '../components/Collections/Table';
import { AppContext } from '../Context/AppProvider';

export default function Collections() {
    const {
        collections,
        loadMoreCollection: loadMore,
        isLoadingCollection: isLoading,
        hasMoreCollection: hasMore,
    } = useContext(AppContext);
    return <TableCollections collections={collections} loadMore={loadMore} isLoading={isLoading} hasMore={hasMore} />;
}
