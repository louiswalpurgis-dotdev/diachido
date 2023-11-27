function formatPrice(price) {
    let formattedPrice = '';
    if (price <= 1) {
        formattedPrice = `${price * 100}%`;
    } else if (price > 1) {
        formattedPrice = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    }

    return formattedPrice;
}

export default formatPrice;
