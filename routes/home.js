// Include the express module
const express = require('express');
const route = express.Router();

route.get('/', (req, res) => {
    res.sendFile('C:/Users/Admin/Desktop/project_1/node_project/public/login.html');
});

module.exports = route;
