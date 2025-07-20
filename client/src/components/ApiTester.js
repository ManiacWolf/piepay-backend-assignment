import React, { useState } from 'react';
import axios from 'axios';

const ApiTester = () => {
    const [flipkartResponse, setFlipkartResponse] = useState('');
    const [offerResult, setOfferResult] = useState(null);
    const [discountParams, setDiscountParams] = useState({
        amountToPay: '10000',
        bankName: 'AXIS',
        paymentInstrument: 'CREDIT'
    });
    const [discountResult, setDiscountResult] = useState(null);

    const testOfferEndpoint = async () => {
        try {
            const response = await axios.post('http://localhost:3000/offer', {
                flipkartOfferApiResponse: JSON.parse(flipkartResponse)
            });
            setOfferResult(response.data);
        } catch (error) {
            setOfferResult({ error: error.response?.data || error.message });
        }
    };

    const testDiscountEndpoint = async () => {
        try {
            const response = await axios.get(
                `http://localhost:3000/highest-discount?amountToPay=${discountParams.amountToPay}&bankName=${discountParams.bankName}&paymentInstrument=${discountParams.paymentInstrument}`
            );
            setDiscountResult(response.data);
        } catch (error) {
            setDiscountResult({ error: error.response?.data || error.message });
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <h1>PiePay API Tester</h1>
            
            {/* POST /offer testing */}
            <div style={{ marginBottom: '40px', border: '1px solid #ccc', padding: '20px' }}>
                <h2>POST /offer</h2>
                <textarea
                    placeholder="Paste Flipkart API response here..."
                    value={flipkartResponse}
                    onChange={(e) => setFlipkartResponse(e.target.value)}
                    style={{ width: '100%', height: '200px', marginBottom: '10px' }}
                />
                <button onClick={testOfferEndpoint}>Test Offer Endpoint</button>
                {offerResult && (
                    <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
                        {JSON.stringify(offerResult, null, 2)}
                    </pre>
                )}
            </div>

            {/* GET /highest-discount testing */}
            <div style={{ border: '1px solid #ccc', padding: '20px' }}>
                <h2>GET /highest-discount</h2>
                <div style={{ marginBottom: '10px' }}>
                    <label>Amount to Pay: </label>
                    <input
                        type="number"
                        value={discountParams.amountToPay}
                        onChange={(e) => setDiscountParams({...discountParams, amountToPay: e.target.value})}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Bank Name: </label>
                    <select
                        value={discountParams.bankName}
                        onChange={(e) => setDiscountParams({...discountParams, bankName: e.target.value})}
                    >
                        <option value="AXIS">AXIS</option>
                        <option value="HDFC">HDFC</option>
                        <option value="ICICI">ICICI</option>
                        <option value="SBI">SBI</option>
                        <option value="IDFC">IDFC</option>
                    </select>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Payment Instrument: </label>
                    <select
                        value={discountParams.paymentInstrument}
                        onChange={(e) => setDiscountParams({...discountParams, paymentInstrument: e.target.value})}
                    >
                        <option value="CREDIT">CREDIT</option>
                        <option value="DEBIT">DEBIT</option>
                        <option value="EMI_OPTIONS">EMI_OPTIONS</option>
                    </select>
                </div>
                <button onClick={testDiscountEndpoint}>Test Discount Endpoint</button>
                {discountResult && (
                    <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', marginTop: '10px' }}>
                        {JSON.stringify(discountResult, null, 2)}
                    </pre>
                )}
            </div>
        </div>
    );
};

export default ApiTester;
