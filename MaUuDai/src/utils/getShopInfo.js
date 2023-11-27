function getShopInfo(shopId, shops) {
    const matchedShops = shops.filter((shop) => shop.id === shopId);
    return matchedShops.length > 0 ? matchedShops[0] : { name: 'Unknown Shop' };
}

export default getShopInfo;
