/*
 * Title: The course model implementation
 * Description: Implements APIs for performing CRUD operations
 * on MongoDB.
 * APIs can be invoked by route handlers.
 */

// Import mongoose module
const mongoose = require('mongoose');

// Connect to MongoDB database 'courses=db'
mongoose.connect('mongodb://localhost:27017/courses-db', {
        useNewUrlParser: true
    }) //conects server to database
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error: Unable to connect to MongoDB", err));

// Create Course Schema
const taskSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    priority: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        // default : Date.now()
    },
    status: {
        type: String,
        required: true
    }
});

// Create a model from the Schema (Course is a model (Class))
const Task = mongoose.model('Task', taskSchema);

/* Get All courses
 * IN: None. TODO: Add filter params
 * OUT: Courses collection in JSON format
 */
async function getAllTasks() {
    try {
        const tasks = await Task.find();
        return tasks;
    } catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}

/* Get course by ID
 * IN: id (course object ID)
 * OUT: Single course object
 */
async function getTaskById(id) {
    try {
        // console.log("models id ="+id);
        const tasks = await Task.find({
            user_id: id
        });
        // console.log("task : ",tasks);
        return tasks;
    } catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}

/* Create a course
 * IN: Course object
 * Output: Course Object, including object id
 */
async function createTask(taskInfo) {
    // Instantiate the Course. Here course represents a document object
    const tasks = new Task(taskInfo);

    // Validate and save the document
    try {
        // Use validate method to validate a document
        var result = await tasks.validate();
        result = await tasks.save();
        return result;
    } catch (err) {
        console.log("Error: Could not save document");
        throw err;
    }
}

/* Update a course by ID
 * IN: Course object, including object id
 * OUT: Updated course object
 */
async function updateTask(taskInfo) {
    const id = taskInfo.user_id;
    // console.log("id = ",taskInfo);
    // find the document - findById()
    try {
        let tasks = await Task.find({
            name: taskInfo.name
        });
        // console.log("tasks = ",tasks);
        if (!tasks) {
            console.log("Error: Cannot find tasks with ID: ", id);
            throw new Error("Task not found");
        }
        // Modify its properties
        tasks[0].set(taskInfo);
        // save the document - save()
        const result = await tasks[0].save();
        return result;
    } catch (err) {
        console.log("Error: Cannot save tasks with ID: ", id);
        throw err;
    }
}
async function deleteTask(id, name) {
    try {
		// console.log("id = ",name);
        let tasks = await Task.findOne({name: name});
		console.log("result = ", tasks);
        var result = tasks.deleteOne({
            name: name
        });
        if (!tasks) {
            console.log("Error: Cannot find tasks with name: ", name);
            throw new Error("Task not found");
        }
        return result;
    } catch (e) {
        console.log("Error: Cannot delete tasks with ID: ", id);
        throw err;
    }
}

module.exports.createTask = createTask;
module.exports.getAllTasks = getAllTasks;
module.exports.getTaskById = getTaskById;
module.exports.updateTask = updateTask;
module.exports.deleteTask = deleteTask;
