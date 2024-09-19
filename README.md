# The Book Vault

## Feature Demo
https://youtu.be/dqM0VFrJVtM

## Setup
1. Install Node.js.
2. Run this to import project dependencies.
```
npm ci
```
3. Create a .env file and place your mySQL server credentials into it with the variables:
    DB_HOST
    DB_USER
    DB_PASSWORD
    DB_PORT
3. Run this to start the server. Running the server will create the necessary database and tables.
```
npm start
```
4. visit localhost:3000 and the site should run!

## Documentation
### Adding a book
Type book details into each field in the add books category and press "Add Book" to add the book to the database.
### Filtering
Enter a string into the Query field, and select what to filter by. This will determine what the query is compared to for each entry. Then, press "Submit Filter" to get the filtered results.
### Download the csv data
Click the "Download CSV File" button which is located beneath the book table.

## Challenges
I had some issues with Figma and exporting the HTML and CSS file, so I had to scrap that design and create my own. The result is the current version.
The hardest design decision was whether to put the project in 1 column as it now, or two columns which would allow users to view more at once. Ultimately I decided for the column so it would look better on mobile devices.
