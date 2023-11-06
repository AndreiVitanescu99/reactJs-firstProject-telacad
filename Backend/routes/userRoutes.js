const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const dbOperations = require('../dbFiles/dbUser/dbOperations');

// Connect to the database
dbOperations.connectToDatabase();

// Define user-related routes

// Route to handle user data submission
router.post('/postUser', async (req, res) => {
    try {
        const { firstName_user, lastName_user, email_user, age_user, gold_user, profilPicture_user } = req.body;
        const user = {
            firstName_user,
            lastName_user,
            email_user,
            age_user,
            gold_user: gold_user ? 1 : 0,
            profilPicture_user
        };
        await dbOperations.insertUsers(user);
        res.json({ success: true, message: 'User data inserted successfully' });
    } catch (error) {
        handleError(error, res);
    }
});

// Configure multer for handling file uploads (in this case images)

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

// Route to handle user profile picture upload
router.post('/postUserPicture', upload.single('profilPicture'), async function (req, res) {
    try {
        if (req.fileValidationError) {
            // Respond with an error if file validation fails
            return res.status(400).json({ success: false, message: req.fileValidationError });
        }
        if (!req.file) {
            // Respond with an error if no file is uploaded
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }
        // Extract the image filename and email from the request
        const image = req.file.filename;
        let profil = {
            Picture: image,
            email_user: req.body.email_user
        }
        // Insert user's profile picture data into the database
        await dbOperations.insertUsersPicture(profil);
        // Respond with a success message
        res.json({ success: true, message: 'User data image inserted successfully' });
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to retrieve user data
router.get('/getUser', async (req, res) => {
    try {
        const result = await dbOperations.getUsers();
        res.send(result);
    } catch (error) {
        console.error('Error handling GET request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Route to retrieve user emails
router.get('/getUsersEmails', async function (req, res) {
    try {
        const result = await dbOperations.getUsersEmails();
        res.send(result);
    } catch (error) {
        console.error('Error handling GET request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Function to handle errors and respond with an error message
function handleError(error, res) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}

module.exports = router;
