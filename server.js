const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/page.html');
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

books = [];

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.emit('sendBooks', books);

    socket.on('addBook', (book) => {
        books.push(book);
    });

    socket.on('queryBooks', (filters) => {
        filteredBooks = [];
        switch (filters.filterType) {
            case 'title':
            filteredBooks = books.filter(book => book.title.includes(filters.query));
            break;
            case 'genre':
            filteredBooks = books.filter(book => book.genre.includes(filters.query));
            break;
            case 'ISBN':
            filteredBooks = books.filter(book => book.isbn.includes(filters.query));
            break;
            case 'author':
            filteredBooks = books.filter(book => book.author.includes(filters.query));
            break;
            default:
            filteredBooks = books;
        }
        socket.emit('sendBooks', filteredBooks);
    })

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('getBooks', (book) => {
        socket.emit('sendBooks', books);
    });
});