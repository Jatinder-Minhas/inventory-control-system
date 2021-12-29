const jwt = require('jsonwebtoken');
const config = require('config');
var cookies = require("cookie-parser");

module.exports = function (req, res, next)
{
    const token = req.cookies['jwt'];
    if(!token) return res.render('accessDenied');

    try{
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decoded;
        next();
    }
    catch(es) {
        res.status(400).send('Invalid token.');
    }
}