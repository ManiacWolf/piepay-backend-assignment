/**
 * Service for calculating discounts from offers
 */
function calculateHighestDiscount(offers, orderAmount) {
    let highestDiscountAmount = 0;
    let bestOffer = null;
    
    for (const offer of offers) {
        const discountAmount = offer.calculateDiscount(orderAmount);
        
        if (discountAmount > highestDiscountAmount) {
            highestDiscountAmount = discountAmount;
            bestOffer = offer;
        }
    }
    
    return {
        discountAmount: Math.round(highestDiscountAmount * 100) / 100,
        bestOffer
    };
}

module.exports = {
    calculateHighestDiscount
};
