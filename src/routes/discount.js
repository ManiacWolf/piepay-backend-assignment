console.log("discount.js router loaded");

const express = require('express');
const router = express.Router();
const discountController = require('../controllers/discountController');

router.get('/test', (req, res) => res.json({ok: true}));

router.get('/highest-discount', discountController.getHighestDiscount);

module.exports = router;
