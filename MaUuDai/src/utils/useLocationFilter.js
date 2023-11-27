import { AppContext } from '~/Context/AppProvider';
import getMaxDiscountForShop from './getMaxDiscountForShop';

const { useState, useContext, useEffect } = require('react');

const useLocationFilter = (shops, discounts) => {
    const { districtOptions, setSort, district, discounts: allDiscounts } = useContext(AppContext);

    const [shopData, setShopData] = useState([]);
    const [discountData, setDiscountData] = useState([]);

    const handleSortChange = (e) => {
        const sortType = e.target.value;
        setSort(sortType);
        switch (sortType) {
            case '1':
                setShopData(shopData.sort((a, b) => b.createdAt - a.createdAt));
                if (discounts) setDiscountData(discountData.sort((a, b) => b.createdAt - a.createdAt));
                break;
            case '2':
                setShopData(shopData.sort((a, b) => b.likersCount - a.likersCount));
                if (discounts) setDiscountData(discountData.sort((a, b) => b.likersCount - a.likersCount));
                break;
            case '3':
                setShopData(shopData.sort((a, b) => a.createdAt - b.createdAt));
                if (discounts) setDiscountData(discountData.sort((a, b) => a.createdAt - b.createdAt));
                break;
            case '4':
                setShopData(
                    shopData.sort((a, b) =>
                        compareDiscounts(
                            getMaxDiscountForShop(a.id, allDiscounts),
                            getMaxDiscountForShop(b.id, allDiscounts),
                        ),
                    ),
                );

                if (discounts) setDiscountData(discountData.sort((a, b) => compareDiscounts(a.amount, b.amount)));
                break;
            case '5':
                setShopData(
                    shopData.sort(
                        (a, b) => countDiscountsForShop(b.id, allDiscounts) - countDiscountsForShop(a.id, allDiscounts),
                    ),
                );
                if (discounts) setDiscountData(discountData.sort((a, b) => compareDiscounts(a.amount, b.amount)));
                break;
            default:
                break;
        }
    };

    const checkDistrictInAddress = (address, district) => {
        return address.includes(district);
    };

    const handleDistrictChange = () => {
        if (district === '1') {
            setShopData(shops);
            setDiscountData(discounts);
            return;
        }

        const filteredShops = shops.filter((shop) => {
            return shop.locations.some((location) => {
                return checkDistrictInAddress(location.address, districtOptions[district - 1].label);
            });
        });

        setShopData(filteredShops);

        if (discounts) {
            const filteredDiscounts = discounts.filter((discount) => {
                return filteredShops.some((shop) => shop.id === discount.shopID);
            });

            setDiscountData(filteredDiscounts);
        }
    };

    useEffect(() => {
        handleDistrictChange();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [district]);

    return {
        shopData,
        setShopData,
        discountData,
        setDiscountData,
        handleSortChange,
        handleDistrictChange,
    };
};
const compareDiscounts = (a, b) => {
    if (a < 1 && b < 1) {
        // Cả hai đều nhỏ hơn 1, sắp xếp theo giảm dần
        return b - a;
    } else if (a < 1) {
        // a nhỏ hơn 1, đặt a lên trước
        return -1;
    } else if (b < 1) {
        // b nhỏ hơn 1, đặt b lên trước
        return 1;
    } else {
        // Cả hai đều lớn hơn hoặc bằng 1, sắp xếp theo giảm dần
        return b - a;
    }
};
const countDiscountsForShop = (shopID, discounts) => {
    return discounts.filter((discount) => discount.shopID === shopID).length;
};
export default useLocationFilter;
