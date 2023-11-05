const express = require('express');
const router = express.Router();
const dbOperations = require('../dbFiles/dbUser/dbOperations');

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