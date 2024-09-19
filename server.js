const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

const mysql = require('mysql2');
const parser = require('json2csv');

require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting: ', err.stack);
        return;
    }
    console.log("Successfully connected to MySQL DB");

    //Initial DB Setup
    connection.query('CREATE DATABASE IF NOT EXISTS ' + process.env.DB_NAME, (err, results) => {
        if (err) {
            console.error('Error creating database: ', err.stack);
            return;
        }
        console.log('Database created successfully');
    });
    connection.query('USE ' + process.env.DB_NAME, (err, results) => {
        if (err) {
            console.error('Error using database: ', err.stack);
            return;
        }
    });
    connection.query("CREATE TABLE IF NOT EXISTS books" +
        "(id INT AUTO_INCREMENT PRIMARY KEY, " +
        "title VARCHAR(255), " + 
        "author VARCHAR(255), " + 
        "genre VARCHAR(255), " + 
        "datepublished VARCHAR(255), " +
        "isbn VARCHAR(255))", (err, results) => {
        if (err) {
            console.error('Error creating table');
            return;
        }
        console.log('Table created successfully');
    });

    //Copy data from DB to books array
    connection.query("SELECT * FROM books", (err, results) => {
        if (err) {
            console.error('Error selecting books: ', err.stack);
            return;
        }
        results.forEach((book) => {
            books.push({
                ID: book.id,
                title: book.title,
                author: book.author,
                genre: book.genre,
                datePublished: book.datepublished,
                ISBN: book.isbn
            });
        });
    });
});

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/page.html');
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

books = [];

io.on('connection', (socket) => {
    socket.emit('sendBooks', books);

    socket.on('getCSV', () => {
        connection.query("SELECT * FROM books", (err, results) => {
            if(err) {
                console.log('Error selecting books');
                return;
            }
            const csv = parser.parse(results);
            socket.emit('sendCSV', csv);
        });
    });

    socket.on('addBook', (book) => {
        connection.query("INSERT INTO books (title, author, genre, datepublished, isbn) VALUES (?, ?, ?, ?, ?)", [book.title, book.author, book.genre, book.datePublished, book.ISBN], (err, results) => {
            if (err) {
                console.log('Error inserting book');
            }
        });
        book.ID = books.length + 1;
        books.push(book);
    });

    socket.on('queryBooks', (filters) => {
        filteredBooks = [];
        switch (filters.filterType) {
            case 'title':
            filteredBooks = books.filter(book => book.title.toLowerCase().includes(filters.query.toLowerCase()));
            break;
            case 'genre':
            filteredBooks = books.filter(book => book.genre.toLowerCase().includes(filters.query.toLowerCase()));
            break;
            case 'ISBN':
            filteredBooks = books.filter(book => book.isbn.toLowerCase().includes(filters.query.toLowerCase()));
            break;
            case 'author':
            filteredBooks = books.filter(book => book.author.toLowerCase().includes(filters.query.toLowerCase()));
            break;
            case 'ID':
            filteredBooks = books.filter(book => String(book.ID).includes(filters.query));
            break;
            default:
            filteredBooks = books;
        }
        socket.emit('sendBooks', filteredBooks);
    })

    socket.on('getBooks', (book) => {
        socket.emit('sendBooks', books);
    });
});