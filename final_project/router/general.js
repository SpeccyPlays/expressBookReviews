const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  //check username and password provided. Return error if not
  if (userName && password){
    //exit early if user already exists
    if (!isValid(userName)){
      return res.status(404).json({message : "User already exists !"});
    }
    else {
      users.push({"username" : userName, "password" : password });
      return res.status(200).json({message : "User registered successfully"});
    }
  }
  else {
    return res.status(404).json({message : "Error trying to register user"});
  }
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    if (books[isbn]) {
      return res.send(books[isbn]);
    } else {
      return res.send(`No book with isbn ${isbn} available in shop`);
    }
  } else {
    return res.send("No isbn provided");
  }
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author.toLowerCase();
  if (author) {
    let isbns = Object.keys(books);
    if (isbns.length > 0) {
      let authorBooks = [];
      isbns.forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author) {
          authorBooks.push(books[isbn]);
        }
      });
      if (authorBooks.length > 0) {
        return res.send(authorBooks);
      } else {
        return res.send(`No books by ${author} in the shop`);
      }
    } else {
      return res.send("No books in shop");
    }
  } else {
    return res.send("No author name provided");
  }
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();
  if (title) {
    let isbns = Object.keys(books);
    if (isbns.length > 0) {
      let matchingBooks = [];
      isbns.forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title) {
          matchingBooks.push(books[isbn]);
        }
      });
      if (matchingBooks.length > 0) {
        return res.send(matchingBooks);
      } else {
        return res.send(`No books titled ${title} in the shop`);
      }
    } else {
      return res.send("No books in shop");
    }
  } else {
    return res.send("No author name provided");
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (isbn) {
    if (books[isbn]) {
      const reviews = JSON.stringify(books[isbn].reviews, null, 4);
      return res.send(`Reviews for ${books[isbn].title} are: ${reviews}`);
    } else {
      return res.send(`No book with isbn ${isbn} available in shop`);
    }
  } else {
    return res.send("No isbn provided");
  }
});

module.exports.general = public_users;
