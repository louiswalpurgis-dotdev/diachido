import { useMemo, useState } from 'react';
import useFirestore from '~/hooks/useFirestore';
import useDocument from '~/hooks/useDocument';
import filterDiscountsForShop from '~/utils/filterDiscountsForShop';

function useDataWithLocation(location, district = null) {
    const [limit, setLimit] = useState(16);
    // Lấy dữ liệu shop từ firestore
    const shopsCondition = useMemo(() => {
        return {
            fieldName: 'locations',
            operator: 'array-contains',
            compareValue: { city: location },
        };
    }, [location]);
    const { documents: shopBanner, loadMore } = useFirestore('shops', shopsCondition, limit, 'likersCount');
    const filteredShops = useMemo(() => {
        if (!district || district === 'all') return shopBanner;
        const shops = shopBanner.filter((shop) => {
            return shop.locations.some((item) => item.city === location && item.address.includes(district));
        });
        if (!shops.length || shops.length < 5) {
            if (shopBanner.length < limit) return shops;
            setLimit((prev) => prev + 8);
        }
        return shops;
    }, [shopBanner, location, district, limit]);
    // Lấy dữ liệu collection từ firestore
    const collectionIds = useMemo(() => {
        return filteredShops.map((item) => item.collectionsID[0]);
    }, [filteredShops]);

    const collectionsBanner = useDocument('collections', collectionIds);

    // Lấy dữ liệu sản phẩm từ firestore với shopID
    const shopIdsForDiscount = useMemo(() => {
        return filteredShops.map((item) => item.id);
    }, [filteredShops]);

    const { documents: discounts } = useFirestore('discounts', null);

    const filteredDiscounts = useMemo(() => {
        let discountsForShop = filterDiscountsByShopIds(discounts, shopIdsForDiscount);
        if (!filteredShops.length) return [];
        return filterDiscountsForShop(discountsForShop);
    }, [discounts, filteredShops.length, shopIdsForDiscount]);

    // Lấy thông tin cửa hàng tương ứng với sản phẩm
    const shopIds = useMemo(() => {
        return discounts.map((item) => item.shopID);
    }, [discounts]);
    const shopWithDiscount = useDocument('shops', shopIds);

    return {
        filteredShops,
        collectionsBanner,
        filteredDiscounts,
        loadMore,
        shopWithDiscount,
    };
}

function filterDiscountsByShopIds(discounts, shopIds) {
    if (!Array.isArray(discounts) || discounts.length === 0 || !Array.isArray(shopIds) || shopIds.length === 0) {
        return [];
    }

    // Tạo một Set chứa các shopId để tối ưu hóa việc kiểm tra tồn tại.
    const shopIdSet = new Set(shopIds);

    // Sử dụng filter để lọc qua danh sách giảm giá và chỉ giữ lại các mục có shopID nằm trong shopIds.
    const filteredDiscounts = discounts.filter((discount) => {
        return shopIdSet.has(discount.shopID);
    });

    return filteredDiscounts;
}

export default useDataWithLocation;
