const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  let userExist = users.filter((user) => {
    return user.username === username;
  })
  //if user exist contains value(s) then username is not valid
  if (userExist.length > 0){
    return false;
  }
  else {
    return true;
  }
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validUsers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });
  //if the filter results contains a valid, return true
  if (validUsers.length > 0) {
    return true;
  } else {
    return false;
  }
};

regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message : "User logged in successfully", token: accessToken});
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const userName = req.session.authorization.username;
  const review = req.query.review;
  if (isbn && userName && review){
    if (books[isbn]){
      books[isbn].reviews[userName] = review;
      return res.status(200).json({message : "Review added", Book : books[isbn]});
    }
    else {
      return res.status(404).json({message : "Book not found", isbn : isbn});
    }
    
  }
  else {
    return res.status(403).json({message : "Error when adding review"});
  }
});

//delete a review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const userName = req.session.authorization.username;
  if (isbn && userName){
    if (books[isbn]){
      delete books[isbn].reviews[userName];
      return res.status(200).json({message : "Review deleted", Book : books[isbn]});
    }
    else {
      return res.status(404).json({message : "Book not found", isbn : isbn});
    }
    
  }
  else {
    return res.status(403).json({message : "Error when adding review"});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
