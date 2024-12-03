const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (isbn){
    if (books[isbn]){
      return res.send(books[isbn]);
    }
    else {
      return res.send(`No book with isbn ${isbn} available in shop`);
    }
  }
  else {
    return res.send("No isbn provided");
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  if (author){
    let isbns = Object.keys(books);
    if (isbns.length > 0){
      let authorBooks = [];
      isbns.forEach((isbn) => {
        if (books[isbn].author.toLowerCase() === author){
          authorBooks.push(books[isbn]);
        };
      });
      if (authorBooks.length > 0){
        return res.send(authorBooks);
      }
      else {
        return res.send(`No books by ${author} in the shop`);
      }
    }
    else {
      return res.send("No books in shop");
    }
  }
  else {
    return res.send("No author name provided");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  if (title){
    let isbns = Object.keys(books);
    if (isbns.length > 0){
      let matchingBooks = [];
      isbns.forEach((isbn) => {
        if (books[isbn].title.toLowerCase() === title){
          matchingBooks.push(books[isbn]);
        };
      });
      if (matchingBooks.length > 0){
        return res.send(matchingBooks);
      }
      else {
        return res.send(`No books titled ${title} in the shop`);
      }
    }
    else {
      return res.send("No books in shop");
    }
  }
  else {
    return res.send("No author name provided");
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
