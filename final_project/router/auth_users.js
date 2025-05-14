const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
    return !(users.filter(u => u.username === username).length > 0)
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    const user = users.filter(u => u.username === username && u.password === password);
    return !!user;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(403).json({ message: "Username and password are required." });
  }
  if(authenticatedUser(username, password)){
    const accessToken = jwt.sign(
        {username}, "access",{"expiresIn": 60*60}
    )
    req.session.authorization = {accessToken};
    req.session.username = {username};
    return res.status(200).json({ message: "Login successful", token: accessToken });
  }
  return res.status(403).json({message: "Wrong username or password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.username;
  const currentBook = books[isbn];
  currentBook["reviews"] = {
    ...currentBook["reviews"], [username]:review
  }
  return res.status(200).json({ message: "Review added/updated successfully" });
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.username;
    const currentBook = books[isbn];
    const filtered = Object.fromEntries(Object.entries(currentBook["reviews"]).filter(name=> name !== username));
    currentBook["reviews"] = filtered;
    return res.status(200).json({message: "Review deleted"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
