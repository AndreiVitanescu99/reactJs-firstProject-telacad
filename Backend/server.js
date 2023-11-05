require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const multer = require('multer');
const path = require('path'); // Import the 'path' module

const dbOperations = require('./dbFiles/dbUser/dbOperations');
const userRoutes = require('./routes/userRoutes');

const API_PORT = process.env.PORT || 5000;

dbOperations.connectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/dbFiles', express.static(__dirname + '/dbFiles'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        return cb(null, './dbFiles/profilePictureUser');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        const allowedExtensions = ['.jpg', '.jpeg', '.png'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            return cb(null, true);
        }
        return cb(new Error('Invalid file format. Please upload a valid image (jpg, jpeg, png).'));
    }
});

app.post('/postUserPicture', upload.single('profilPicture'), async function (req, res) {
    try {
        if (req.fileValidationError) {
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }
        const image = req.file.filename;
        let profil = {
            Picture: image,
            email_user: req.body.email_user
        }
        await dbOperations.insertUsersPicture(profil);
        res.json({ success: true, message: 'User data image inserted successfully' });
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

app.use('/users', userRoutes); // Use user-related routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(API_PORT, () => console.log(`listening on port ${API_PORT}`));
// app.listen();
