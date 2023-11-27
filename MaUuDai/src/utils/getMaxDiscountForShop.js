function getMaxDiscountForShop(shopId, discounts) {
    let maxPercentageDiscount = 0;
    let maxAmountDiscount = 0;

    for (const discount of discounts) {
        if (discount.shopID === shopId) {
            if (discount.amount <= 1 && discount.amount > maxPercentageDiscount) {
                maxPercentageDiscount = discount.amount;
            } else if (discount.amount > 1 && discount.amount > maxAmountDiscount) {
                maxAmountDiscount = discount.amount;
            }
        }
    }

    // Ưu tiên trả về giá trị % nếu có, nếu không thì trả về giá trị số tiền
    return maxPercentageDiscount > 0 ? maxPercentageDiscount : maxAmountDiscount;
}

export default getMaxDiscountForShop;
