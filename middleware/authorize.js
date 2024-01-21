const jwt = require('jsonwebtoken');
const User = require("../model/login");

exports.authorizationToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        const secretKey = process.env.SECRET_KEY;
        
        console.log('token',token);
        if (!token) {
            return res.status(401).json({ message: "Authorization token is missing" });
        }

        const decodedId = jwt.verify(token, secretKey);

        console.log('decode =',decodedId.userId);
        const loggedUser = await User.findByPk(decodedId.userId );

        if (!loggedUser) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = loggedUser;
        next();

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};
