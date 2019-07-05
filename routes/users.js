
const { createUser, getAllUsers, getUserByEmail, updateUser,getUserByUsername } = require('../models/users');
const express = require('express');
const Joi = require('joi'); // JSON validation
const authToken = require('../middlewares/auth');
const route = express.Router();

" /api/users - URL"
// Route handler for get all courses
route.get('/', (req, res) => {
    // Get all courses
    getAllUsers()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500);
            res.send("Error: Unable to get user\n" + err.message);
            console.log("Error: Unable to get user\n", err);
        })
});

//API with param id
route.get('/:username', (req, res) => {
    const username = req.params.username;
    // Get the course object using id
    getUserByUsername(username)
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(404);
            res.send("Error: Unable to get user\n" + err.message);
            console.log("Error: Unable to get user\n", err);
        })
});

/****************** END: get requests *************/

/****************** BEGIN: post requests *************/

// http://localhost/api/course - POST - {JSON course}
// POST API to create a new course
//authToken is a middleware
// post requires a form for submission of the data
route.post('/', (req, res) => {
    // Validate the course info
    const { error } = validateCourse(req.body); //Joi

    if (error) {
        res.status(400);
        res.send(error.details[0].message); // Sending 1st error message
        console.log(error);
        return;
    }

    // Add course to db
    createUser(req.body) // JSON course object
        .then((result) => {
            res.send(result); //  Send the result (new course object) back to user
            console.log(result._id);
            console.log("Profile Created: ", result.name);
        })
        .catch((err) => {
            res.status(500);
            res.send("Error: Unable to create profile\n" + err.message);
            console.log("Error: Unable to create profile\n", err);
        });
});

/****************** END: post requests *************/

/****************** BEGIN: PUT requests *************/
// Handler to update a course using put method
route.put('/:email',authToken, (req, res) => {
    // Look up the course. If not found return 404
    const email = req.params.email;
    // Get the course object using id
    getUserByEmail(email)
        .then((result) => {
            var user = req.body;
            user.email = email;
            // Validate the course info
            const { error } = validateCourse(user); //Joi
            if (error) {
                res.status(400);
                res.send(error.details[0].message); // Sending 1st error message
                console.log(error);
                return;
            }
            // Update course to db
            updateUser(user) // JSON course object
                .then((result) => {
                    res.send(result); //  Send the result (updated course object) back to user
                    console.log("Updated user: ", result.name);
                })
                .catch((err) => {
                    res.status(500);
                    res.send("Error: Unable to update user\n" + err.message);
                    console.log("Error: Unable to create user\n", err);
                });

        })
        .catch((err) => {
            res.status(404);
            res.send("Error: Unable to get user\n" + err.message);
            console.log("Error: Unable to get user\n", err);
        })

});

// Handler to delete a course using delete method
// route.delete('/:id', (req, res) => {
//     // Look up the course. If not found return 404
//     const id = req.params.id;
//     deleteCourse(id)
//         .then((result) => {
//             console.log("course deleted");
//         })
//         .catch((err) => {
//             res.status(404);
//             res.send("Error: Unable to get course\n" + err.message);
//             console.log("Error: Unable to get course\n", err);
//         })
//
// });

// Validate function
function validateCourse(course) {
    // Define schema
    const schema = {
        _id: Joi.string(),
        username: Joi.string().min(4).max(60).required(),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required(),
        email: Joi.string().email({ minDomainAtoms: 2 }).required(), // String Array
        address: Joi.string().required(),
        phone_no: Joi.number(),
        // isPublished: Joi.boolean()
    };

    // Validate
    const result = Joi.validate(course, schema);

    return result;
}

module.exports = route;
