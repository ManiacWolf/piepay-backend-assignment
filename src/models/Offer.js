const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    // Offer identification
    offerId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    
    // Discount details
    discountType: {
        type: String,
        enum: ['percentage', 'fixed', 'cashback'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true,
        min: 0
    },
    maxDiscountAmount: {
        type: Number,
        min: 0
    },
    minOrderValue: {
        type: Number,
        min: 0,
        default: 0
    },
    
    // Bank and payment instrument details
    supportedBanks: [{
        type: String,
        required: true,
        uppercase: true
    }],
    supportedPaymentInstruments: [{
        type: String,
        enum: ['CREDIT', 'DEBIT', 'EMI_OPTIONS', 'UPI', 'WALLET'],
        required: true
    }],
    
    // Validity and conditions
    validFrom: {
        type: Date,
        default: Date.now
    },
    validTill: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    
    // Terms and conditions
    terms: String,
    applicableOn: [String],
    
    // Metadata
    source: {
        type: String,
        default: 'flipkart'
    },
    rawData: mongoose.Schema.Types.Mixed,
    
    // Timestamps
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Indexes for better query performance
offerSchema.index({ supportedBanks: 1 });
offerSchema.index({ supportedPaymentInstruments: 1 });
offerSchema.index({ isActive: 1, validTill: 1 });
offerSchema.index({ minOrderValue: 1 });

// Method to calculate discount for a given amount
offerSchema.methods.calculateDiscount = function(orderAmount) {
    if (orderAmount < this.minOrderValue) {
        return 0;
    }
    
    let discount = 0;
    
    switch (this.discountType) {
        case 'percentage':
            discount = (orderAmount * this.discountValue) / 100;
            if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
                discount = this.maxDiscountAmount;
            }
            break;
        case 'fixed':
            discount = this.discountValue;
            break;
        case 'cashback':
            discount = this.discountValue;
            break;
    }
    
    return Math.min(discount, orderAmount);
};

module.exports = mongoose.model('Offer', offerSchema);
