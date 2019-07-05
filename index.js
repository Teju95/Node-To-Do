const express = require('express');
const app = express();
// getting the express package running and the package returns a object with the app
app.use(express.json());//for parsing the json object
app.use(express.urlencoded({extended:true}));

const home = require('./routes/home');
const users = require('./routes/users');
const todo = require('./routes/todo');
const session = require('./routes/session');
app.use('/',home);
app.use('/api/users',users);
app.use('/api/session',session);
app.use('/api/todo',todo);
app.use(express.static('public'));


const port = process.env.HTTP_PORT || 5000;
//listen on port
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
