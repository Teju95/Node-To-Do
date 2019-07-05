var config = {
    token: false
};

function submitRequest(url, method, payload, headers, callback) { //this is fun called to link this file with the HTML files
    var xhttp = new XMLHttpRequest();
 // debugger;

    xhttp.onreadystatechange = function() {
        if (this.readyState == 4) {
            if (this.status == 200) {
                try {
                    var result = JSON.parse(this.responseText);
                    callback(false, result); // response for the handleSignIn function
                } catch (e) {
                    callback(false, null); //  no error but the data is not available
                }
            } else {
                callback(this.statusText);
            }
        }
    };

    xhttp.open(method, url, true);

    // Set content type
    xhttp.setRequestHeader("Content-type", "application/json");
    for (var headerKey in headers) {
        if (headers.hasOwnProperty(headerKey)) {
            xhttp.setRequestHeader(headerKey, headers[headerKey]);
        }
    }

    if (payload) {
        // console.log(payload);

        xhttp.send( JSON.stringify(payload)); // Send the request
    } else {
        xhttp.send(); // For get/delete
    }
}

function saveToken(tokenObj) {
    // config.token = tokenObj; // the var is at the beginning of the file
     localStorage.setItem("token", tokenObj.token); // server sends the token as an object
}
// saveToken(true);

function getToken() {
    var tokenVal = localStorage.getItem("token");
    var tokenObj = null;
    if (tokenVal) {
        tokenObj = {
            "token": tokenVal
        };
    }

    return tokenObj;
}

function setAuthTokenHeader(headers, tokenObj) {
    var tokenVal = "Bearer " + tokenObj.token;
    headers.authorization = tokenVal; // in postman we saw the example against the authorization tab with Bearer as the key
}

function displayError(id, message) {
    var divElement = document.getElementById(id);
    var textNode = document.createTextNode(message);
    divElement.appendChild(textNode);
}
