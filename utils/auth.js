var jwt = require('jsonwebtoken');
const password = "secret";

var payload = {};
// Generate JWT token
function generateToken(payload, callback) {
    jwt.sign(payload, password, callback);
}
generateToken(payload,callback);

function callback(err , data){
 console.log(data);
}
// Verify JWT token
function verifyToken(token, callback) {
    jwt.verify(token, password, callback);
}

module.exports.verifyToken = verifyToken;
