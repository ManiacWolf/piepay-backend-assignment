// const Offer = require('../models/Offer');

// exports.getHighestDiscount = async (req, res) => {
//   try {
//     const { amountToPay, bankName, paymentInstrument } = req.query;
//     // Validate required query params
//     if (!amountToPay || !bankName) {
//       return res.status(400).json({
//         error: 'amountToPay and bankName are required parameters'
//       });
//     }

//     const amountNum = Number(amountToPay);
//     if (isNaN(amountNum) || amountNum <= 0) {
//       return res.status(400).json({
//         error: 'amountToPay must be a positive number'
//       });
//     }

//     // Build query for offers
//     const query = {
//       isActive: true,
//       supportedBanks: { $in: [bankName.toUpperCase()] },
//       minOrderValue: { $lte: amountNum },
//       $or: [
//         { validTill: { $gte: new Date() } },
//         { validTill: { $exists: false } }
//       ]
//     };
//     if (paymentInstrument) {
//       query.supportedPaymentInstruments = { $in: [paymentInstrument.toUpperCase()] };
//     }

//     const offers = await Offer.find(query);

//     // Calculate the highest discount
//     let highestDiscount = 0;
//     let bestOffer = null;
//     for (const offer of offers) {
//       let discount = 0;
//       if (offer.discountType === 'percentage') {
//         discount = (amountNum * offer.discountValue) / 100;
//         if (offer.maxDiscountAmount != null) {
//           discount = Math.min(discount, offer.maxDiscountAmount);
//         }
//       } else {
//         discount = offer.discountValue;
//       }
//       if (discount > highestDiscount) {
//         highestDiscount = discount;
//         bestOffer = offer;
//       }
//     }

//     return res.json({
//       highestDiscountAmount: Math.round(highestDiscount * 100) / 100,
//       bestOffer: bestOffer
//         ? {
//             offerId: bestOffer.offerId,
//             title: bestOffer.title,
//             description: bestOffer.description,
//           }
//         : null,
//       applicableOffersCount: offers.length,
//     });
//   } catch (err) {
//     console.error('[discountController.getHighestDiscount] Error:', err);
//     return res.status(500).json({
//       error: 'Internal server error',
//       message: err.message,
//     });
//   }
// };
