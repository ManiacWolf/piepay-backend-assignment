/**
 * Service to process Flipkart API responses and extract offer information
 */
function processFlipkartResponse(flipkartResponse) {
    const offers = [];
    
    try {
        const rawOffers = extractOffersFromResponse(flipkartResponse);
        
        for (const rawOffer of rawOffers) {
            const processedOffer = {
                offerId: generateOfferId(rawOffer),
                title: rawOffer.title || rawOffer.description || 'Bank Offer',
                description: rawOffer.description || rawOffer.terms,
                discountType: determineDiscountType(rawOffer),
                discountValue: parseDiscountValue(rawOffer),
                maxDiscountAmount: parseMaxDiscount(rawOffer),
                minOrderValue: parseMinOrderValue(rawOffer),
                supportedBanks: parseSupportedBanks(rawOffer),
                supportedPaymentInstruments: parsePaymentInstruments(rawOffer),
                terms: rawOffer.terms || rawOffer.conditions,
                rawData: rawOffer
            };
            
            offers.push(processedOffer);
        }
        
    } catch (error) {
        console.error('Error processing Flipkart response:', error);
        throw new Error('Failed to process Flipkart API response');
    }
    
    return offers;
}

function extractOffersFromResponse(response) {
    // Adjust based on actual Flipkart API structure
    return response.offers || response.data?.offers || [];
}

function generateOfferId(rawOffer) {
    const bankInfo = rawOffer.bank || rawOffer.bankName || 'unknown';
    const discountInfo = rawOffer.discount || rawOffer.discountValue || 'unknown';
    const timestamp = Date.now();
    
    return `offer_${bankInfo}_${discountInfo}_${timestamp}`.toLowerCase().replace(/[^a-z0-9_]/g, '_');
}

function parseSupportedBanks(rawOffer) {
    const banks = [];
    
    if (rawOffer.bank) {
        banks.push(rawOffer.bank.toUpperCase());
    } else {
        const text = (rawOffer.description || rawOffer.title || '').toUpperCase();
        const bankNames = ['HDFC', 'AXIS', 'ICICI', 'SBI', 'IDFC', 'YES', 'KOTAK'];
        
        for (const bankName of bankNames) {
            if (text.includes(bankName)) {
                banks.push(bankName);
            }
        }
    }
    
    return banks.length > 0 ? banks : ['ALL'];
}

// Add other parsing functions here...

module.exports = {
    processFlipkartResponse
};
