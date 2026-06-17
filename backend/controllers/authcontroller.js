require('dotenv').config();
const pool = require('../db/config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const registeruser = async (req,res) => {
    try {
        const { username, email, password} = req.body;

        if (!username || !email || !password){
            return res.status(400).json({error : "all fields required"});
        }

        const saltround = 10;
        const passwordhash = await bcrypt.hash(password, saltround);

        const querytext = 'INSERT INTO users (username, email, password_hash) VALUES ($1,$2,$3)';
        const values = [username, email, passwordhash];

        const result = await pool.query(querytext,values);

        return res.status(201).json({message : 'user created', user : result.rows[0]});
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: "Username or Email already exists" });
        }
        console.error("Registration Error:", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }

    };

const loginuser = async (req,res) => {
    try {
        const {email,password}=req.body;

        if (!email || !password){
            return res.status(400).json({error:"email and password required"})

        }

        const userquery = 'SELECT * FROM users WHERE email =$1 ';
        const result = await pool.query(userquery, [email]);

        if (result.rows.length === 0){
            return res.status(401).json({error : 'Invalid Credentials'});

        }

        const user = result.rows[0];

        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordCorrect){
            return res.status(401).json({
                error : 'Invalid Credentials'
            });

        }

        const tokenPayload = {
            userId : user.id,
            username : user.username,
            email : user.email
        };

        const jwt_secret = process.env.JWT_SECRET;

        const token = jwt.sign(tokenPayload, jwt_secret, {expiresIn : '24h'});

        return res.status(200).json({
            message : 'Login Successfull',
            token : token,
            user :{
                id : user.id,
                username : user.username,
                email : user.email
            }
        });
    } catch (error){
        console.error("Login Error : ", error.message);
        return res.status(500).json({error : "Internal Server Error"});
    }
};


module.exports= {registeruser, loginuser};

