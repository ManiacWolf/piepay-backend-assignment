const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

const offerRoutes = require('./routes/offers');
const discountRoutes = require('./routes/discount');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/piepay', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/offer', offerRoutes);
app.use('/', discountRoutes);

// --- POST /offer ENDPOINT ---
app.post('/offer', async (req, res) => {
  try {
    const { flipkartOfferApiResponse } = req.body;
    if (!flipkartOfferApiResponse) {
      return res.status(400).json({ error: 'flipkartOfferApiResponse is required' });
    }
    const offersArray = Array.isArray(flipkartOfferApiResponse.offers)
      ? flipkartOfferApiResponse.offers
      : [];
    let identifiedCount = offersArray.length;
    let createdCount = 0;

    // Loop: normalize and insert unique offers
    for (const rawOffer of offersArray) {
      // Create a unique offer ID based on title+bank+discountValue as a primitive duplicate check
      const offerId = [
        rawOffer.title || '',
        rawOffer.bank || '',
        rawOffer.discountValue || ''
      ].join('-').replace(/\s+/g, '-').toLowerCase();

      const offerDoc = {
        offerId,
        title: rawOffer.title || rawOffer.description || 'Bank Offer',
        description: rawOffer.description || '',
        discountType:
          (rawOffer.discountType || (typeof rawOffer.discountValue === 'number' ? 'percentage' : 'fixed') || 'percentage'),
        discountValue: rawOffer.discountValue || 0,
        maxDiscountAmount: rawOffer.maxDiscountAmount || null,
        minOrderValue: rawOffer.minOrderValue || 0,
        supportedBanks: [ (rawOffer.bank || '').toUpperCase() ].filter(Boolean),
        supportedPaymentInstruments: Array.isArray(rawOffer.paymentInstruments)
          ? rawOffer.paymentInstruments.map(pi => pi.toUpperCase())
          : [],
        validFrom: rawOffer.validFrom || new Date(),
        validTill: rawOffer.validTill || null,
        isActive: true,
        terms: rawOffer.terms || '',
        source: "flipkart",
        rawData: rawOffer,
      };

      // Upsert - only insert new unique offers
      const exists = await Offer.findOne({ offerId });
      if (!exists) {
        await Offer.create(offerDoc);
        createdCount++;
      }
    }

    return res.json({
      noOfOffersIdentified: identifiedCount,
      noOfNewOffersCreated: createdCount,
    });
  } catch (err) {
    console.error('[POST /offer] Error:', err);
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`PiePay Backend Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
