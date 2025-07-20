const Offer = require('../models/Offer');
const { processFlipkartResponse } = require('../services/flipkartApiService');

/**
 * POST /offer - Processes Flipkart API response and stores offers
 */
exports.createOffersFromFlipkart = async (req, res) => {
    try {
        const { flipkartOfferApiResponse } = req.body;
        
        if (!flipkartOfferApiResponse) {
            return res.status(400).json({
                error: 'flipkartOfferApiResponse is required'
            });
        }
        
        const processedOffers = processFlipkartResponse(flipkartOfferApiResponse);
        
        let identifiedCount = processedOffers.length;
        let createdCount = 0;
        
        for (const offerData of processedOffers) {
            try {
                const existingOffer = await Offer.findOne({ 
                    offerId: offerData.offerId 
                });
                
                if (!existingOffer) {
                    await Offer.create(offerData);
                    createdCount++;
                }
            } catch (error) {
                console.error('Error saving offer:', error);
            }
        }
        
        res.status(200).json({
            noOfOffersIdentified: identifiedCount,
            noOfNewOffersCreated: createdCount
        });
        
    } catch (error) {
        console.error('Error processing offers:', error);
        res.status(500).json({
            error: 'Internal server error',
            message: error.message
        });
    }
};
