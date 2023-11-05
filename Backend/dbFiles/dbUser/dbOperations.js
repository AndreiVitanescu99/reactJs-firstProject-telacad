const { ConnectionPool } = require('mssql');
const config = require('../config');

const pool = new ConnectionPool(config);

const connectToDatabase = async () => {
    try {
        await pool.connect();
    } catch (error) {
        throw new Error(`Database connection failed: ${error.message}`);
    }
}

const getUsers = async () => {
    try {
        let result = await pool.query`SELECT * FROM [users]`;
        return result.recordset;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const getUsersEmails = async () => {
    try {
        const result = await pool.query`SELECT email FROM [users]`;
        return result.recordset;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const insertUsers = async (user) => {
    try {
        const result = await pool.query`
        INSERT INTO [users] (first_name, last_name, email, user_gold, user_age, ImgProfile_user)
        VALUES(${user.firstName_user}, ${user.lastName_user}, ${user.email_user}, ${user.gold_user}, ${Number(user.age_user)}, ${user.profilPicture_user})`;
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const insertUsersPicture = async (profile) => {
    try {
        const result = await pool.query`
        UPDATE users
        SET ImgProfile_user = ${profile.Picture}
        WHERE email = ${profile.email_user}`;
        return result;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

module.exports = {
    connectToDatabase,
    getUsers,
    getUsersEmails,
    insertUsers,
    insertUsersPicture
};