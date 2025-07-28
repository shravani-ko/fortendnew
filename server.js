const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const path = require('path');
require('dotenv').config();

const app = express(); // ✅ Fix: Should be express(), not require()

const PORT = process.env.PORT || 3000;

// ✅ Fix: Use correct Mongoose URI key and options
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.log('❌ MongoDB connection failed:', err));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html')); // ✅ Fix: -dirname -> __dirname
});

// Route to serve home.html
app.get('/home.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password }); // ✅ Fix: user.FindOne -> User.findOne

        if (user) {
            res.send(`<h2>WELCOME, ${user.username}!</h2>`); // ✅ Fix: use backticks and variable interpolation
        } else {
            res.send('<h2>INVALID CREDENTIALS</h2>');
        }
    } catch (error) {
        res.status(500).send('Server error');
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

