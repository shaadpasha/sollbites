const Razorpay = require('razorpay');

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount } = req.body;
        
        if (!amount || amount < 100) {
            return res.status(400).json({ error: 'Invalid amount. Minimum amount is 100 paise (₹1).' });
        }

        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        const options = {
            amount: amount, // amount in smallest currency unit (paise)
            currency: 'INR',
            receipt: 'receipt_order_' + Math.floor(Math.random() * 1000000)
        };

        const order = await razorpay.orders.create(options);
        
        if (!order) {
            return res.status(500).json({ error: 'Failed to create order' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error('Razorpay Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
};
