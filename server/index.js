import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_password"
});

db.connect(err => {
    if (err) throw err;

    db.query("create database if not exists Harmony", (err, result) => {
        if (err) throw err;
        console.log("Database 'Harmony' created or already exists");
    });

    db.query("USE Harmony", (err, result) => {
        if (err) throw err;
        console.log("Using Harmony database");
    });

    const createUserTableQuery = `create table if not exists Users (
        id int not null unique auto_increment primary key,
        name varchar(100) not null,
        email varchar(100) not null unique,
        password varchar(100) not null,
        username varchar(10) not null unique,
        image text
    )`;

// creating Servers Table query after Users as per schema    
const createServersTableQuery = `
CREATE TABLE IF NOT EXISTS Servers (
    id VARCHAR(255) NOT NULL, 
    name VARCHAR(100) NOT NULL, 
    serverIcon TEXT,  
    serverAdmin INT NOT NULL,  
    createdAt DATETIME NOT NULL, 
    updatedAt DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY (serverAdmin) REFERENCES Users(id)  
)`;

// creating Members Table query after Servers as it references Servers
const createMemberTableQuery = `CREATE TABLE IF NOT EXISTS Members (
    id VARCHAR(255) NOT NULL, 
    role ENUM('ADMIN', 'MODERATOR', 'GUEST') NOT NULL, 
    userID INT NOT NULL,  
    serverId VARCHAR(255) NOT NULL, 
    createdAt DATETIME NOT NULL, 
    updatedAt DATETIME NOT NULL, 
    PRIMARY KEY (id), 
    FOREIGN KEY (userID) REFERENCES Users(id),  
    FOREIGN KEY (serverId) REFERENCES Servers(id)  
)`;

    // create Servers table query
    db.query(createServersTableQuery, (err, result) => {
    if (err) throw err;
    console.log("Servers table created or already exists");

    // create Members table query
    db.query(createMemberTableQuery, (err, result) => {
        if (err) throw err;
        console.log("Members table created or already exists");
    });
});

    // create table for Channels
    const createChannelsTableQuery = `
CREATE TABLE IF NOT EXISTS Channels (
    id VARCHAR(255) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('TEXT', 'AUDIO', 'VIDEO') NOT NULL,
    profileId int not null unique auto_increment,
    serverId VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (profileId) REFERENCES Users(id),
    FOREIGN KEY (serverId) REFERENCES Servers(id)
)`;

    // create table for ServerMessages 
    const createServerMessagesTableQuery = `
CREATE TABLE IF NOT EXISTS ServerMessages (
    id VARCHAR(255) NOT NULL,
    senderId int not null unique auto_increment,
    serverId VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (senderId) REFERENCES Users(id),
    FOREIGN KEY (serverId) REFERENCES Servers(id)
)`;


    // create table for DirectMessages
    const createDirectMessagesTableQuery = `
CREATE TABLE IF NOT EXISTS DirectMessages (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    senderId INT NOT NULL,
    receiverId INT NOT NULL,
    message TEXT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (senderId) REFERENCES Users(id),
    FOREIGN KEY (receiverId) REFERENCES Users(id)
)`;



    db.query(createUserTableQuery, (err, result) => {
        if (err) throw err;
        console.log("Users table created or already exists");
    });

    db.query(createMemberTableQuery, (err, result) => {
        if (err) throw err;
        console.log("Members table created or already exists");
    });

    // Create Channels table
db.query(createChannelsTableQuery, (err, result) => {
    if (err) throw err;
    console.log("Channels table created or already exists");

    // Create ServerMessages table
    db.query(createServerMessagesTableQuery, (err, result) => {
        if (err) throw err;
        console.log("ServerMessages table created or already exists");

        // Create DirectMessages table
        db.query(createDirectMessagesTableQuery, (err, result) => {
            if (err) throw err;
            console.log("DirectMessages table created or already exists");
        });
    });
});

});

app.get('/userdata', (req, res) => {
    const query = "select * from Users";
    db.query(query, (err, data) => {
        if(err) return res.status(500).send('Internal Server Error');
        
        if(data.length === 0) {
            return res.send('No Data Available');
        }
        
        let tableHTML = '<style>' +
                        'body {' +
                        '   background-color: black;' +
                        '}' +
                        'table {' +
                        '    width: 100%;' +
                        '    border-collapse: collapse;' +
                        '}' +
                        'th, td {' +
                        '    border: 1px solid #dddddd;' +
                        '    padding: 8px;' +
                        '    text-align: center;' +
                        '   color: black' +
                        '}' +
                        'td {' +
                        '   color: white;' +
                        '}' +
                        'th {' +
                        '    background-color: #f2f2f2;' +
                        '   border: 1px solid black;' +
                        '}' +
                        '</style>';
        
        tableHTML += '<table>';
        tableHTML += '<tr>';
        Object.keys(data[0]).forEach(key => {
            tableHTML += '<th>' + key + '</th>';
        });
        tableHTML += '</tr>';

        data.forEach(row => {
            tableHTML += '<tr>';
            Object.keys(row).forEach(key => {
                if (key === 'image') {
                    tableHTML += `<td><img src="${Buffer.from(row[key])}" style="width:50px;height:50px;" alt="User Image"/></td>`;
                } else {
                    tableHTML += '<td>' + row[key] + '</td>';
                }
            });
            tableHTML += '</tr>';
        });

        tableHTML += '</table>';
        
        res.send(tableHTML);
    });
});

app.post("/userdata", (req, res) => {
    const query = "insert into Users(`name`, `email`, `password`, `username`, `image`) values (?, ?, ?, ?, ?)";

    const image = req.body.image ? req.body.image : null;
  
    const values = [
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.username,
      image
    ];
  
    db.query(query, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
  });

app.listen(8800, () => {
    console.log("Connected to Server 👾");
});

app.get('/servers', (req, res) => {
    const query = "SELECT id, name, serverIcon FROM Servers";
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching servers');
        }
        res.json(results);
    });
});

// Route for user signup
app.post('/signup', (req, res) => {
    const { name, email, password, username, image } = req.body;
    const insertQuery = "INSERT INTO Users (name, email, password, username, image) VALUES (?, ?, ?, ?, ?)";
    db.query(insertQuery, [name, email, password, username, image], (err, results) => {
        if (err) {
            console.error(err);
            // Handle specific errors (e.g., duplicate entries) as needed
            return res.status(500).send('Error creating user');
        }
        res.status(201).send({ message: 'User created successfully', userId: results.insertId });
    });
});

// Route for a user to join a server
app.post('/join-server', (req, res) => {
    const { userId, serverId } = req.body;

    const insertQuery = "INSERT INTO ServerMembers (userId, serverId) V3LUES (?, ?)";
    db.query(insertQuery, [userId, serverId], (err, results) => {
        if (err) {
            console.error(err);
            // Handles errors, such as duplicate membership, etc.
            return res.status(500).send('Error joining server');
        }
        res.status(201).send({ message: 'Successfully joined the server' });
    });
});
