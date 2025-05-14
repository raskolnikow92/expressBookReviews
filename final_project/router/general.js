const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  if(username && password){
    if(isValid(username)){
        users.push({username, password});
        return res.status(200).json({ message: "User successfully registered." });
    }else{
        return res.status(403).json({message: "User already exists"});
    }
  }
  return res.status(403).json({message: "No user or password"});
});

// Get the book list available in the shop
public_users.get('/', async(req, res) {
  //Write your code here
  try{
    const getBooks = async() => books;
    const bookList = await getBooks();
    return res.send(JSON.stringify(bookList, null, 4));
  }catch(err){
    res.status(500).json({ message: "Error fetching books", error: err });
  }
  //return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  try{
    const searchedBook = async()=> books[isbn];

    return res.send(await searchedBook());
  }catch(err){
    res.status(403).json({ message: "Error fetching books", error: err });
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  try{
    const bookByAuthor = async(a)=> {
        for(const[key, value] of Object.entries(books)){
            if(value.author.toLowerCase() === a.toLowerCase()){
                return value;
            }   
        }
    }
    const book = await bookByAuthor();
    return res.send(book);
  }catch(err){
    return res.status(403).json({message: "Book not found", error: err});
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
  try{}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.send(books[req.params.isbn]["reviews"]);
});

module.exports.general = public_users;
