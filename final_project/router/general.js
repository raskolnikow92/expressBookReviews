const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const user = req.params.username;
  const password = req.params.password;
  if(user && password){
    if(isValid(user)){

    }
  }
  return res.status(401).json({message: "No user or password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  return res.send(books[isbn]);
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  for(const[key, value] of Object.entries(books)){
    if(value.author.toLowerCase() === author.toLowerCase()){
        return res.send(value);
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  for(const[key, value] of Object.entries(books)){
    if(value.title.toLowerCase() === title.toLowerCase()){
        return res.send(value);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.send(books[req.params.isbn]["reviews"]);
});

module.exports.general = public_users;
