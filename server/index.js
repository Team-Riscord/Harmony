import express from "express";
import mysql from "mysql";
import cors from "cors";
//import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.static('../client/src/images/'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your_password"
});

function generateServerID() {
    // Generate a random string for the server ID
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 10;
    let serverID = '';
    for (let i = 0; i < length; i++) {
        serverID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return serverID;
}

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
        image text,
        createdAt datetime not null,
        updatedAt datetime not null
    )`;

    db.query(createUserTableQuery, (err, result) => {
        if (err) throw err;
        console.log("Users table created or already exists");
    });

    // Friends table
const createFriendsTableQuery = `
CREATE TABLE IF NOT EXISTS Friends (
    friendshipID VARCHAR(255) NOT NULL PRIMARY KEY,
    friend_1_ID INT NOT NULL,
    friend_2_ID INT NOT NULL,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (friend_1_ID) REFERENCES Users(id),
    FOREIGN KEY (friend_2_ID) REFERENCES Users(id)
)`;

db.query(createFriendsTableQuery, (err, result) => {
if (err) throw err;
console.log("Friends table created or already exists");
});

// Servers table
const createServersTableQuery = `
CREATE TABLE IF NOT EXISTS Servers (
    serverID VARCHAR(255) NOT NULL PRIMARY KEY,
    serverName VARCHAR(255) NOT NULL,
    serverIcon VARCHAR(255),
    userID INT NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(id)
);`;

db.query(createServersTableQuery, (err, result) => {
if (err) throw err;
console.log("Servers table created or already exists");
});

// FriendRequests table
const createFriendRequestsTableQuery = `
CREATE TABLE IF NOT EXISTS FriendRequests (
    friendRequestID VARCHAR(255) NOT NULL PRIMARY KEY,
    senderID INT NOT NULL,
    serverID VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    FOREIGN KEY (senderID) REFERENCES Users(id),
    FOREIGN KEY (serverID) REFERENCES Servers(serverID)
);
`;

db.query(createFriendRequestsTableQuery, (err, result) => {
if (err) throw err;
console.log("FriendRequests table created or already exists");
});

// Members table
const createMembersTableQuery = `
CREATE TABLE IF NOT EXISTS Members (
    membershipID VARCHAR(255) NOT NULL PRIMARY KEY,
    role ENUM('ADMIN', 'MODERATOR', 'GUEST'),
    userID INT NOT NULL,
    serverID VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (serverID) REFERENCES Servers(serverID)
);
`;

db.query(createMembersTableQuery, (err, result) => {
if (err) throw err;
console.log("Members table created or already exists");
});

// Channels table
const createChannelsTableQuery = `
CREATE TABLE IF NOT EXISTS Channels (
    channelID VARCHAR(255) NOT NULL PRIMARY KEY,
    channelName VARCHAR(255) NOT NULL,
    type ENUM('TEXT', 'AUDIO', 'VIDEO'),
    userID INT NOT NULL,
    serverID VARCHAR(255) NOT NULL,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (userID) REFERENCES Users(id),
    FOREIGN KEY (serverID) REFERENCES Servers(serverID)
);

`;

db.query(createChannelsTableQuery, (err, result) => {
if (err) throw err;
console.log("Channels table created or already exists");
});

// ServerMessages table
const createServerMessagesTableQuery = `
CREATE TABLE IF NOT EXISTS ServerMessages (
    serverMessageID VARCHAR(255) NOT NULL PRIMARY KEY,
    senderID INT NOT NULL,
    serverID VARCHAR(255) NOT NULL,
    message TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (senderID) REFERENCES Users(id),
    FOREIGN KEY (serverID) REFERENCES Servers(serverID)
);
`;

db.query(createServerMessagesTableQuery, (err, result) => {
if (err) throw err;
console.log("ServerMessages table created or already exists");
});

// DirectMessages table
const createDirectMessagesTableQuery = `
CREATE TABLE IF NOT EXISTS DirectMessages (
    directMessageID VARCHAR(255) NOT NULL PRIMARY KEY,
    senderID INT NOT NULL,
    receiverID INT NOT NULL,
    message TEXT,
    createdAt DATETIME NOT NULL,
    updatedAt DATETIME NOT NULL,
    FOREIGN KEY (senderID) REFERENCES Users(id),
    FOREIGN KEY (receiverID) REFERENCES Users(id)
)
`;

db.query(createDirectMessagesTableQuery, (err, result) => {
if (err) throw err;
console.log("DirectMessages table created or already exists");
});


    const testUsers = [
        { name: 'Test User 1', email: 'test1@example.com', password: 'testpassword1', username: 'testuser1', image: '/default-profile-image.png' },
        { name: 'Test User 2', email: 'test2@example.com', password: 'testpassword2', username: 'testuser2', image: '/default-profile-image.png' },
        { name: 'Test User 3', email: 'test3@example.com', password: 'testpassword3', username: 'testuser3', image: '/default-profile-image.png' },
        { name: 'Test User 4', email: 'test4@example.com', password: 'testpassword4', username: 'testuser4', image: '/default-profile-image.png' },
        { name: 'Test User 5', email: 'test5@example.com', password: 'testpassword5', username: 'testuser5', image: '/default-profile-image.png' }
    ];
    
    const createTestUsersQuery = `insert ignore into Users (name, email, password, username, image, createdAt, updatedAt) values ?`;

    const values = testUsers.map(user => [
        user.name,
        user.email,
        user.password,
        user.username,
        user.image,
        new Date().toISOString().slice(0, 19).replace('T', ' '),
        new Date().toISOString().slice(0, 19).replace('T', ' ')
    ]);
    
    db.query(createTestUsersQuery, [values], (err, result) => {
        if (err) throw err;
        console.log("Test users created or already exists");
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
    const query = "insert into Users(`name`, `email`, `password`, `username`, `image`, `createdAt`, `updatedAt`) values (?, ?, ?, ?, ?, ?, ?)";

    const image = req.body.image ? req.body.image : null;
  
    const values = [
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.username,
      image,
      new Date().toISOString().slice(0, 19).replace('T', ' '),
      new Date().toISOString().slice(0, 19).replace('T', ' ')
    ];
  
    db.query(query, values, (err, data) => {
      if (err) return res.send(err);
      return res.json(data);
    });
});

app.post('/login', (req, res) => {
    const { emailOrUsername, password } = req.body;
    const query = "SELECT * FROM Users WHERE email = ? OR username = ?";
    
    db.query(query, [emailOrUsername, emailOrUsername], (err, results) => {
        if (err) {
            console.error("Error while querying database:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "User not found or incorrect credentials" });
        }

        const user = results[0];
        const isMatch = password === user.password;
        
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect email/username or password" });
        }
        return res.status(200).json({ success: true, message: "Login successful", user });
    });
});


app.listen(8800, () => {
  console.log("Server is running on port 8800");
});

app.get('/servers', (req, res) => {
    const userId = req.query.userId;
    const query = "SELECT serverID as id, serverName as name, serverIcon as icon FROM Servers WHERE userID = ? ORDER BY createdAt DESC"; // Order by creation date
    db.query(query, [userId], (err, results) => {
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
            return res.status(500).send('Error creating user');
        }
        res.status(201).send({ message: 'User created successfully', userId: results.insertId });
    });
});

// Route for a user to join a server
app.post('/join-server', (req, res) => {
    const { userId, inviteLink } = req.body;
    if (!inviteLink || inviteLink === '') {
        return res.status(400).json({ error: 'Please enter an invite link' });
    }

    const inviteLinkPattern = /^(https?:\/\/)?(www\.)?riscord\.gg\/[a-zA-Z0-9]+$/;

    if (!inviteLinkPattern.test(inviteLink)) {
        return res.status(400).json({ error: 'Invalid invitation link format' });
    }

    const serverID = inviteLink.split('/').pop();
    const serverExistsQuery = "SELECT * FROM Servers WHERE serverID = ?";
    db.query(serverExistsQuery, [serverID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Server not found' });
        }

        const userAlreadyMemberQuery = "SELECT * FROM Members WHERE userID = ? AND serverID = ?";
        db.query(userAlreadyMemberQuery, [userId, serverID], (err, results) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ error: 'You are already a member of this server' });
            }

            
            const addMemberQuery = "INSERT INTO Members (membershipID, role, userID, serverID, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)";
            const membershipID = generateMembershipID();
            const role = 'GUEST'; 
            const createdAt = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const updatedAt = createdAt;
            db.query(addMemberQuery, [membershipID, role, userId, serverID, createdAt, updatedAt], (err, results) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                return res.status(200).json({ message: 'Successfully joined the server' });
            });
        });
    });
});


// Route for a user to join a server
app.get('/join-server', (req, res) => {
    const jsx = React.createElement(JoinServer, { userId: 'yourUserId', onClose: () => {}, onBack: () => {} });
    const reactDom = ReactDOMServer.renderToString(jsx);
    
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(reactDom);
});

// Route to handle adding a server
app.post('/add-server', (req, res) => {
    let body = '';

    req.on('data', chunk => {
        body += chunk.toString(); // Accumulate chunks of the request body
    });

    req.on('end', () => {
        try {
            const { serverName, serverImage } = parseFormData(body);

            if (!serverName || !serverImage) {
                res.status(400).json({ error: 'Server name and image are required' });
                return;
            }

            const serverID = generateServerID();
            const imagePath = `/server-images/${serverID}.${getFileType(serverImage)}`;
            const newPath = path.join(__dirname, 'server-images', `${serverID}.${getFileType(serverImage)}`);

            fs.writeFile(newPath, serverImage, err => {
                if (err) {
                    console.error('Error saving file:', err);
                    res.status(500).json({ error: 'Error saving file' });
                    return;
                }

                // Insert server data into the database
                const insertServerQuery = `INSERT INTO Servers (serverID, serverName, serverIcon, userID, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)`;
                const values = [serverID, serverName, imagePath, /* userID */, new Date(), new Date()];

                db.query(insertServerQuery, values, (err, result) => {
                    if (err) {
                        console.error('Error inserting server data:', err);
                        res.status(500).json({ error: 'Error inserting server data' });
                        return;
                    }

                    res.status(201).json({ message: 'Server added successfully', serverID });
                });
            });
        } catch (error) {
            console.error('Error parsing form data:', error);
            res.status(400).json({ error: 'Error parsing form data' });
        }
    });
});

// Helper function to parse form data
function parseFormData(formData) {
    const data = {};
    const items = formData.split('&');
    for (const item of items) {
        const [key, value] = item.split('=');
        data[key] = decodeURIComponent(value.replace(/\+/g, ''));
    }
    return data;
}

// Helper function to get file type (extension)
function getFileType(fileData) {
    const match = fileData.match(/^data:image\/(\w+);base64,/);
    if (match) {
        return match[1];
    } else {
        throw new Error('Invalid file data');
    }
}
