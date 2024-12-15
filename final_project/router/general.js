const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to simulate asynchronous operations
const simulateAsync = (fn) => {
    return new Promise((resolve, reject) => {
        try {
            resolve(fn());
        } catch (error) {
            reject(error);
        }
    });
};

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
public_users.get('/', (req, res) => {
    simulateAsync(() => books)
        .then((bookList) => res.send(bookList))
        .catch(() => res.status(500).json({ message: "Error retrieving books" }));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
    const isbn_item = req.params.isbn;

    simulateAsync(() => {
        if (!isbn_item) {
            throw { status: 400, message: "ISBN is required" };
        }

        let filtered_book = books[isbn_item];
        if (!filtered_book) {
            throw { status: 404, message: "Book not found" };
        }

        return filtered_book;
    })
        .then((book) => res.send(book))
        .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});


// Get book details based on author
public_users.get('/author/:author', (req, res) => {
    const author_item = req.params.author;

    simulateAsync(() => {
        if (!author_item) {
            throw { status: 400, message: "Author parameter is required" };
        }

        const filtered_books = Object.values(books).filter((book) =>
            book.author.toLowerCase().includes(author_item.toLowerCase())
        );

        if (filtered_books.length === 0) {
            throw { status: 404, message: "No books found for the given author" };
        }

        return filtered_books;
    })
        .then((books) => res.send(books))
        .catch((error) => res.status(error.status || 500).json({ message: error.message }));
});

// Get book details based on title
public_users.get('/title/:title', (req, res) => {
    const title_item = req.params.title;

    simulateAsync(() => {
        if (!title_item) {
            throw { status: 400, message: "Title parameter is required" };
        }

        const filtered_books = Object.values(books).filter((book) =>
            book.title.toLowerCase().includes(title_item.toLowerCase())
        );

        if (filtered_books.length === 0) {
            throw { status: 404, message: "No books found for the given title" };
        }

        return filtered_books;
    })
        .then((books) => res.send(books))
        .catch((error) => res.status(error.status || 500).json({ message: error.message }));
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
