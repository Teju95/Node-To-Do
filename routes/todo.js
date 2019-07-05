const { createTask, getAllTasks, getTaskById, updateTask ,deleteTask } = require('../models/todo');//Database functions
const express = require('express');
const Joi = require('joi');
const authToken = require('../middlewares/auth');

const route = express.Router();
debugger;
" /api/course - URL"
route.get('/', (req, res) => {
    // Get all courses
    getAllTasks()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            res.status(500);
            res.send("Error: Unable to get task\n" + err.message);
            console.log("Error: Unable to get task\n", err);
        })
});

route.get('/:id', (req, res) => {
    const id = req.params.id;
    // Get the course object using id
    getTaskById(id)
        .then((result) => {
            // console.log("result"+result);
            res.send(result);
        })
        .catch((err) => {
            res.status(404);
            res.send("Error: Unable to get course\n" + err.message);
            console.log("Error: Unable to get course\n", err);
        })
});

/****************** END: get requests *************/

/****************** BEGIN: post requests *************/

// http://localhost/api/course - POST - {JSON course}
// POST API to create a new course
//authToken is a middleware
// post requires a form for submission of the data
route.post('/', authToken, (req, res) => {
    // Validate the course info
    const { error } = validateTask(req.body); //Joi

    if (error) {
        res.status(400);
        res.send(error.details[0].message); // Sending 1st error message
        console.log(error);
        return;
    }

    // Add course to db
    createTask(req.body) // JSON course object
        .then((result) => {
            res.send(result); //  Send the result (new course object) back to user
            console.log("Created a new course: ", result.name);
        })
        .catch((err) => {
            res.status(500);
            res.send("Error: Unable to create course\n" + err.message);
            console.log("Error: Unable to create course\n", err);
        });
});

/****************** END: post requests *************/

/****************** BEGIN: PUT requests *************/
// Handler to update a course using put method
route.put('/:id', (req, res) => {
    const id = req.params.id;
    getTaskById(id)
        .then((result) => {
            var course = req.body;
            course.user_id = id;
			// console.log("course:",course);
            const { error } = validateTask(course); //Joi
            if (error) {
                res.status(400);
                res.send(error.details[0].message); // Sending 1st error message
                console.log(error);
                return;
            }
            updateTask(course) // JSON course object
                .then((result) => {
                    res.send(result); //  Send the result (updated course object) back to user
                    console.log("Updated course: ", result.name);
                })
                .catch((err) => {
                    res.status(500);
                    res.send("Error: Unable to update course\n" + err.message);
                    console.log("Error: Unable to create course\n", err);
                });

        })
        .catch((err) => {
            res.status(404);
            res.send("Error: Unable to get course\n" + err.message);
            console.log("Error: Unable to get course\n", err);
        })

});

// Handler to delete a course using delete method
route.delete('/:id/:name', (req, res) => {
    // Look up the course. If not found return 404
	// debugger;
    const id = req.params.id;
	const n = req.params.name;
	// console.log(n);
    deleteTask(id,n)
        .then((result) => {
            console.log("Task deleted!!");
        })
        .catch((err) => {
            res.status(404);
            res.send("Error: Unable to get task\n" + err.message);
            console.log("Error: Unable to get task\n", err);
        })

});

// Validate function
function validateTask(course) {
    // Define schema
    const schema = {
        user_id : Joi.string(),
        _id : Joi.string(),
        name : Joi.string().required(),
        category : Joi.string().required(),
        priority : Joi.string().required(), // String Array
		status : Joi.string().required(),
		date : Joi.date()
	    };

    // Validate
    const result = Joi.validate(course, schema);

    return result;
}

module.exports = route;
