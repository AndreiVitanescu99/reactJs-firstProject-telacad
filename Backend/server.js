require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/userRoutes');
const API_PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/dbFiles', express.static(__dirname + '/dbFiles'));
app.use('/users', userRoutes); // Use user-related routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`));


