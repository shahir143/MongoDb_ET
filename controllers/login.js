const User=require('../model/login');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');


exports.wrongpage=(req,res)=> res.send("404 File not found")
exports.signupPage = (req, res) => {
    res.sendFile('signup.html', { root: './public/signup' });
};

exports.loginPage=(req,res)=>{
    res.sendFile('login.html', { root: './public/login' });
}

exports.signup = async (req, res,) => {
    try {
        const saltRounds = 10;
        const { email, password } = req.body;

        const hash = await bcrypt.hash(password, saltRounds);
        const existingUser = await User.findOne({ where: { userEmail: email } });

        if (existingUser) {
            return res.status(409).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            userName: req.body.name,
            userEmail: email,
            userPassword: hash
        });
        console.log(user);
        return res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Error in user signup:', error);
        res.status(500).json({ success: false, message: 'Error signing up user' });
    }
};

function generateTokenAuthorization(user) {
    const payload = { userId: user.id };
    const secretKey = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secretKey);
    return token;
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { userEmail: email } });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.userPassword);

        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Password wrong' });
        }

        const token = generateTokenAuthorization(user);
        res.status(200).json({ success: true, message: 'Login successful', token ,encryptedId:token, Premium: user.premium,});
    } catch (error) {
        console.error('Error in user login:', error);
        res.status(500).json({ success: false, message: 'Error logging in user' });
    }
};