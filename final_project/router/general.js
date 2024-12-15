const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error username or password not provided" });
    }
    // Filter the users array for any user with the same username 
    let validusers = users.filter((user) => {
        return (user.username === username);
    });

    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        // Send a error message as the response, indicating the user has been already added
        res.send("The user " + username + " has been added!");
    } else {
        // Push a new user object into the users array based on query parameters from the request
        users.push({
            "username": username,
            "password": password
        });
        // Send a success message as the response, indicating the user has been added
        res.send("The user " + username + " has been added!");
    }

});

// Get the book list available in the shop
public_users.get('/', function (req, res) {

    return res.send(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn_item = req.params.isbn;
    if (isbn_item) {

        let filtered_book = books[isbn_item];

        return res.send(filtered_book);
    } else {
        res.status(400).json({ message: 'No books found' });
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author_item = req.params.author;
    if (author_item) {
        const filtered_book = Object.values(books).filter((book) => book.author.toLowerCase().includes(author_item.toLowerCase()));
        if (filtered_book.length > 0) {
            return res.send(filtered_book);
        } else {
            res.status(404).json({ message: 'No books found for the given author' });
        }
    } else {
        res.status(400).json({ message: 'Author query parameter is required' });
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title_item = req.params.title;
    if (title_item) {
        const filtered_book = Object.values(books).filter((book) => book.title.toLowerCase().includes(title_item.toLowerCase()));
        if (filtered_book.length > 0) {
            return res.send(filtered_book);
        } else {
            res.status(404).json({ message: 'No books found for the given title' });
        }
    } else {
        res.status(400).json({ message: 'Title query parameter is required' });
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn_item = req.params.isbn;
    if (isbn_item) {

        let filtered_book = books[isbn_item];
        if (filtered_book) {
            return res.send(filtered_book.reviews);

        } else {
            res.status(400).json({ message: 'No books found' });
        }
    } else {
        res.status(400).json({ message: 'No books found' });
    }
});

module.exports.general = public_users;
