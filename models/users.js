/*
 * Title: The user model implementation
 * Description: Implements APIs for performing CRUD operations
 * on MongoDB.
 * APIs can be invoked by route handlers.
 */

// Import mongoose module
const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

// Connect to MongoDB database 'courses=db'
mongoose.connect('mongodb://localhost:27017/courses-db', { useNewUrlParser: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Error: Unable to connect to MongoDB", err));

// Create Course Schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 60
    },
    email :{
        type : String,
        required : true,
    },
    address :{
        type:String,
        required:true
    },
    phone_no :{
        type:Number,
        required:true
    }
});

userSchema.methods.generateAuthToken = function (callback) {
    const privateKey = 'secret';
    const payload = { username: this.username,id: this.id };
    jwt.sign(payload, privateKey, callback);
}

// function generateToken(payload, callback) {
//     jwt.sign(payload, password, callback);
// }

// Create User model from the userSchema
const User = mongoose.model('User', userSchema);

/* Get All users
 * IN: None. TODO: Add filter params
 * OUT: Courses collection in JSON format
 */
async function getAllUsers() {
    try {
        const users = await User.find().select('-password');
        return users;
    }
    catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}

/* Get user by name
 * IN: user (username is unique)
 * OUT: Single user object
 */
async function getUserByUsername(username) {
    try {
        const user = await User.findOne({ username: username });
        //console.log("Got user ", user);
        return user;
    }
    catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}


async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email });
        //console.log("Got user ", user);
        return user;
    }
    catch (err) {
        console.log("Error: Unable to query database");
        throw err;
    }
}

async function createUser(userInfo) {
    try {
        // Check if user already exists
        const user = await getUserByUsername(userInfo.username);
        if (user) {
            // User exits, throw an error
            console.log(`Error: User ${user} already exists`);
            var err = new Error("User already exists");
            throw err;
        }
        else {
            // Create a new user as it does not exist in db
            // TODO: password should be hashed before storing
            const user = new User(userInfo);

            // Validate and save the document
            try {
                // Use validate method to validate a document
                var result = await user.validate();
                result = await user.save();
                // console.log(result);
                return result;
            }
            catch (err) {
                console.log("Error: Could not save document");
                throw err;
            }
        }
    }
    catch (err) {
        throw err;
    }
}

async function updateUser(courseInfo) {
    const email = courseInfo.email;
    // find the document - findById()
    try {
        let user = await User.findOne({email:email});
        if (!user) {
            console.log("Error: Cannot find user: ", user);
            throw new Error("user not found");
        }
        // Modify its properties
        user.set(courseInfo);
        // save the document - save()
        const result = await user.save();
        return result;
    }
    catch(err) {
        console.log("Error: Cannot save course with ID: ", email);
        throw err;
    }
}
// Verify user credentials
async function isValidUser(userInfo) {
    const email = userInfo.email;
    try {
        // Check if user already exists
        let user = await User.findOne({email:email});
        if (user) {
            // User exits, check for password
            if (userInfo.password === user.password) {
                return user; // return user document object
            }
            else {
                return false;
            }
        }
        else {
            console.log(`Error: Invalid user ${user}`);
            return false;
        }
    }
    catch (err) {
        throw err;
    }
}

// Get role for user


// Export the functions
module.exports.getAllUsers = getAllUsers;
module.exports.getUserByUsername = getUserByUsername;
module.exports.getUserByEmail = getUserByEmail;
module.exports.isValidUser = isValidUser;
module.exports.createUser = createUser;
module.exports.updateUser = updateUser;
