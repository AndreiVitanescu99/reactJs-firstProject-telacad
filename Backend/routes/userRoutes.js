const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const dbOperations = require('../dbFiles/dbUser/dbOperations');

dbOperations.connectToDatabase();

// Define user-related routes
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

router.post('/postUserPicture', upload.single('profilPicture'), async function (req, res) {
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


router.get('/getUser', async (req, res) => {
    try {
        const result = await dbOperations.getUsers();
        res.send(result);
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/getUsersEmails', async function (req, res) {
    try {
        const result = await dbOperations.getUsersEmails();
        res.send(result);
    } catch (error) {
        console.error('Error handling POST request:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
})

function handleError(error, res) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
}

module.exports = router;