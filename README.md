# PiePay Backend Assignment

Backend service for processing Flipkart offers and calculating discount amounts.

## Features

- ✅ POST /offer endpoint for processing Flipkart API responses
- ✅ GET /highest-discount endpoint for calculating best discounts
- ✅ MongoDB integration for offer storage
- ✅ Payment instrument support (bonus feature)
- ✅ React testing interface
- ✅ Comprehensive error handling and validation

## Installation & Setup

1. **Clone the repository**
git clone https://github.com/yourusername/piepay-backend-assignment.git
cd piepay-backend-assignment

text

2. **Install dependencies**
npm install
cd client && npm install

text

3. **Start MongoDB**
mongod

text

4. **Create .env file** (see .env.example)

5. **Run the application**
Backend
npm run dev

Frontend (new terminal)
cd client && npm start

text

## API Endpoints

### POST /offer
Processes Flipkart API response and stores offers.

**Request:**
{
"flipkartOfferApiResponse": {
"offers": [...]
}
}

text

**Response:**
{
"noOfOffersIdentified": 5,
"noOfNewOffersCreated": 3
}

text

### GET /highest-discount
Calculates highest discount for given parameters.

**Parameters:**
- `amountToPay` (required): Order amount
- `bankName` (required): Bank name (AXIS, HDFC, etc.)
- `paymentInstrument` (optional): Payment type

**Response:**
{
"highestDiscountAmount": 500
}

text

## Architecture Decisions

### Database Schema
- **MongoDB** chosen for flexible document storage
- Indexes on frequently queried fields (banks, payment instruments)
- Built-in discount calculation methods

### Scaling Strategy for 1000 RPS
1. **Horizontal scaling** with load balancers
2. **MongoDB read replicas** for query distribution
3. **Redis caching** for frequently accessed offers
4. **Connection pooling** for efficient database connections
5. **API rate limiting** to prevent abuse

## Future Improvements

Given more time, I would implement:
- [ ] Comprehensive test suite with Jest
- [ ] API documentation with Swagger
- [ ] Caching layer with Redis
- [ ] Advanced logging and monitoring
- [ ] Input sanitization and security hardening
- [ ] Performance optimizations for complex discount calculations

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** React.js (for testing)
- **Testing:** Thunder Client, custom React interface

## Assignment Assumptions

1. Flipkart API structure varies - implemented flexible parsing
2. Duplicate detection based on generated offer IDs
3. Payment instruments are optional for Part 4 bonus feature
4. Bank names are standardized (UPPERCASE)