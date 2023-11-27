function filterDiscountsForShop(discountsForShop) {
    const currentTime = new Date().getTime();
    return discountsForShop.filter((discount) => {
        const discountShowTime = discount.showTime.seconds * 1000 + Math.floor(discount.showTime.nanoseconds / 1000000);
        const discountEndTime = discount.endTime.seconds * 1000 + Math.floor(discount.endTime.nanoseconds / 1000000);
        return discountShowTime <= currentTime && discountEndTime >= currentTime;
    });
}

export default filterDiscountsForShop;
