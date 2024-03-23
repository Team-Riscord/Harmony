import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use(express.static('../client/src/images/'));

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "default",
  database: "Harmony"g
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
        image text,
        createdAt datetime not null,
        updatedAt datetime not null
    )`;

    db.query(createUserTableQuery, (err, result) => {
        if (err) throw err;
        console.log("Users table created or already exists");
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
  const query = "SELECT * FROM Users WHERE email = ? OR username = ? LIMIT 1";
  db.query(query, [emailOrUsername, emailOrUsername], (err, results) => {
      if (err) {
          return res.status(500).json({ message: "Server error" });
      }
      if (results.length === 0) {
          return res.status(401).json({ message: "Incorrect email/username or password" });
      }
      const user = results[0];
      const isMatch = password === user.password;
      if (!isMatch) {
          return res.status(401).json({ message: "Incorrect email/username or password" });
      }
      res.json({ message: "Login successful", user });
  });
});

app.post("/login", (req, res) => {
    const { emailOrUsername, password } = req.body;

    const query = "select * from Users where (email = ? or username = ?) AND password = ?";
    db.query(query, [emailOrUsername, emailOrUsername, password], (err, result) => {
        if (err) {
            console.error("Error while querying database:", err);
            return res.status(500).send("Internal Server Error");
        }

        if (result.length === 0) {
            return res.status(404).send("User not found or incorrect credentials");
        }

        return res.status(200).json({ success: true, message: "Login successful", user: result[0] });
    });
});


app.listen(8800, () => {
  console.log("Server is running on port 8800");
});
