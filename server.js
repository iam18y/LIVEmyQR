const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

// Mock database for users and orders
const users = {};
const orders = [];

// API to send OTP
app.post('/api/send-otp', (req, res) => {
    const { mobile } = req.body;
    if (!mobile || !/^\d{10}$/.test(mobile)) {
        return res.status(400).json({ success: false, message: 'Invalid mobile number.' });
    }
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    users[mobile] = { otp, verified: false };
    console.log(`OTP for ${mobile} is ${otp}`); // Simulate sending OTP
    res.json({ success: true, message: 'OTP sent successfully.' });
});

// API to verify OTP
app.post('/api/verify-otp', (req, res) => {
    const { mobile, otp } = req.body;
    if (!users[mobile] || users[mobile].otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    users[mobile].verified = true;
    res.json({ success: true, message: 'OTP verified successfully.' });
});

// API to get menu
app.get('/api/menu', (req, res) => {
    res.json({
        "Appetizers": [
            { "name": "Paneer Tikka", "price": 250, "rating": 4.8, "description": "Spiced paneer cubes grilled to perfection." },
            { "name": "Samosa", "price": 100, "rating": 4.5, "description": "Crispy pastry with a savory filling." }
        ],
        "Main Course": [
            { "name": "Paneer Butter Masala", "price": 350, "rating": 4.9, "description": "A creamy and rich paneer dish." },
            { "name": "Dal Makhani", "price": 300, "rating": 4.7, "description": "Creamy lentils simmered overnight." }
        ]
    });
});

// API to place an order
app.post('/api/order', (req, res) => {
    const { items, total, paymentMethod } = req.body;
    const orderId = 'ORD' + Date.now();
    const newOrder = { orderId, items, total, paymentMethod, timestamp: new Date() };
    orders.push(newOrder);
    console.log('New Order:', newOrder);
    res.json({ success: true, orderId });
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
