// Include the required modules
const { isValidUser } = require('../models/users');
const express = require('express');
const Joi = require('joi'); // JSON validation
const {verifyToken} = require('../utils/auth');

const route = express.Router();

// http://localhost/api/session - POST - {JSON userInfo}
// POST API to create a new session (Login)
route.post('/', (req, res) => {
    // Validate the course info
    const { error } = validateUser(req.body); //Joi
    if (error) {
        res.status(400);
        res.send(error.details[0].message); // Sending 1st error message
        console.log(error);
        return;
    }
    // Validate user credentials
    isValidUser(req.body) // JSON user object
        .then((user) => {
            if (user) {
                // Create JWT, and send it
                // console.log(user._id);
                user.generateAuthToken(function (err, token) {
                    if(!err) {
                        var tokenObj = {"token": token,"id":user._id};
                        res.status(200).send(tokenObj);
                        // console.log("Token: ", tokenObj);
                    }
                    else {
                        res.status(500).send("Token generation failed");
                        console.log("Error: Token generation failed");
                    }
                })
            }
            else {
                res.status(422).send(user);
            }
        })
        .catch((err) => {
            res.status(500);
            res.send("Error: Unable to validate user\n" + err.message);
            console.log("Error: Unable to validate user\n", err);
        });
});

// Validate function
function validateUser(userInfo) {
    // Define schema
    const schema = {
        email: Joi.string().email({ minDomainAtoms: 2 }).required(), // String Array
        password: Joi.string().min(4).max(60).required()
    };

    // Validate
    const result = Joi.validate(userInfo, schema);

    return result;
}


module.exports = route;
