import express from "express";
import mysql from "mysql";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "default",
});

db.connect((err) => {
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
        image longblob
    )`;

  db.query(createUserTableQuery, (err, result) => {
    if (err) throw err;
    console.log("Users table created or already exists");
  });

  const createFriendRequestsTableQuery = `create table if not exists FriendRequests (
       id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    senderId INT NOT NULL,
    receiverId INT NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (senderId) REFERENCES Users(id),
    FOREIGN KEY (receiverId) REFERENCES Users(id)
    )`;

  db.query(createFriendRequestsTableQuery, (err, result) => {
    if (err) throw err;
    console.log("FriendRequests table created or already exists");
  });

  const createFriendsTableQuery = `CREATE TABLE IF NOT EXISTS Friends (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId1 INT NOT NULL,
    userId2 INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId1) REFERENCES Users(id),
    FOREIGN KEY (userId2) REFERENCES Users(id)
    )`;

  db.query(createFriendsTableQuery, (err, result) => {
    if (err) throw err;
    console.log("Friends table created or already exists");
  });
});

app.get("/userdata", (req, res) => {
  const query = "SELECT * FROM Users";
  db.query(query, (err, data) => {
    if (err) return res.status(500).send("Internal Server Error");

    if (data.length === 0) {
      return res.send("No Data Available");
    }

    let tableHTML =
      "<style>" +
      "body {" +
      "   background-color: black;" +
      "}" +
      "table {" +
      "    width: 100%;" +
      "    border-collapse: collapse;" +
      "}" +
      "th, td {" +
      "    border: 1px solid #dddddd;" +
      "    padding: 8px;" +
      "    text-align: center;" +
      "   color: black" +
      "}" +
      "td {" +
      "   color: white;" +
      "}" +
      "th {" +
      "    background-color: #f2f2f2;" +
      "   border: 1px solid black;" +
      "}" +
      "</style>";

    tableHTML += "<table>";
    tableHTML += "<tr>";
    Object.keys(data[0]).forEach((key) => {
      tableHTML += "<th>" + key + "</th>";
    });
    tableHTML += "</tr>";

    data.forEach((row) => {
      tableHTML += "<tr>";
      Object.values(row).forEach((value) => {
        tableHTML += "<td>" + value + "</td>";
      });
      tableHTML += "</tr>";
    });

    tableHTML += "</table>";

    res.send(tableHTML);
  });
});

app.post("/userdata", (req, res) => {
  const query =
    "INSERT INTO Users(`name`, `email`, `password`, `username`, `image`) VALUES (?, ?, ?, ?, ?)";

  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.username,
    req.body.image,
  ];

  db.query(query, values, (err, data) => {
    if (err) return res.send(err);
    return res.json(data);
  });
});

app.get("/FriendRequestsData", (req, res) => {
  const query = "SELECT * FROM FriendRequests";
  db.query(query, (err, data) => {
    if (err) return res.status(500).send("Internal Server Error");

    if (data.length === 0) {
      return res.send("No Data Available");
    }

    let tableHTML =
      "<style>" +
      "body {" +
      "   background-color: black;" +
      "}" +
      "table {" +
      "    width: 100%;" +
      "    border-collapse: collapse;" +
      "}" +
      "th, td {" +
      "    border: 1px solid #dddddd;" +
      "    padding: 8px;" +
      "    text-align: center;" +
      "   color: black" +
      "}" +
      "td {" +
      "   color: white;" +
      "}" +
      "th {" +
      "    background-color: #f2f2f2;" +
      "   border: 1px solid black;" +
      "}" +
      "</style>";

    tableHTML += "<table>";
    tableHTML += "<tr>";
    Object.keys(data[0]).forEach((key) => {
      tableHTML += "<th>" + key + "</th>";
    });
    tableHTML += "</tr>";

    data.forEach((row) => {
      tableHTML += "<tr>";
      Object.values(row).forEach((value) => {
        tableHTML += "<td>" + value + "</td>";
      });
      tableHTML += "</tr>";
    });

    tableHTML += "</table>";

    res.send(tableHTML);
  });
});

app.post("/addFriend", async (req, res) => {
  const { userKey, friendUsername } = req.body;

  //checks if friend username exists
  const friendQuery = "SELECT id FROM Users WHERE username = ?";
  db.query(friendQuery, [friendUsername], (err, friendResult) => {
    if (err) {
      res.status(500).send("Internal Server Error");
      return;
    }
    if (friendResult.length === 0) {
      res.status(404).send("Friend username not found");
      return;
    }

    const friendId = friendResult[0].id;

    // Check if a friend request already exists
    const existingRequestQuery =
      "SELECT id FROM FriendRequests WHERE (senderId = ? AND receiverId = ?) OR (senderId = ? AND receiverId = ?)";
    db.query(
      existingRequestQuery,
      [userKey, friendId, friendId, userKey],
      (err, requestResult) => {
        if (err) {
          res.status(500).send("Internal Server Error");
          return;
        }
        if (requestResult.length > 0) {
          res.status(409).send("Friend request already exists");
          return;
        }

        // Insert new friend request
        const insertQuery =
          "INSERT INTO FriendRequests (senderId, receiverId, status) VALUES (?, ?, 'PENDING')";
        db.query(insertQuery, [userKey, friendId], (err, insertResult) => {
          if (err) {
            res.status(500).send("Internal Server Error");
            return;
          }
          res
            .status(200)
            .send({ success: true, message: "Friend request sent" });
        });
      }
    );
  });
});

//endpoint to fetch all pending friend requests for a user
app.get("/friend-requests/:userId", (req, res) => {
  const userId = req.params.userId;
  const query = `
        SELECT fr.id, fr.senderId, fr.receiverId, fr.status, u.username as senderUsername
        FROM FriendRequests fr
        JOIN Users u ON fr.senderId = u.id
        WHERE fr.receiverId = ? AND fr.status = 'PENDING'
    `;

  db.query(query, [userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.json(results);
  });
});

//accepting friend requests and updating Friends table for the same
app.post("/accept-friend-request/:requestId", (req, res) => {
  const requestId = req.params.requestId;

  const getRequestQuery = `SELECT senderId, receiverId FROM FriendRequests WHERE id = ? AND status = 'PENDING'`;
  db.query(getRequestQuery, [requestId], (err, result) => {
    if (err || result.length === 0) {
      console.error(err);
      return res.status(500).send("Internal Server Error or request not found");
    }

    const { senderId, receiverId } = result[0];

    // Update the friend request's status to 'ACCEPTED'
    const acceptQuery = `UPDATE FriendRequests SET status = 'ACCEPTED' WHERE id = ?`;
    db.query(acceptQuery, [requestId], (err, updateResult) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating friend request status");
      }

      // Insert into Friends table
      const insertFriendsQuery = `INSERT INTO Friends (userId1, userId2) VALUES (?, ?), (?, ?)`;
      db.query(
        insertFriendsQuery,
        [senderId, receiverId, receiverId, senderId],
        (err, insertResult) => {
          if (err) {
            console.error(err);
            return res.status(500).send("Error adding to friends list");
          }
          res.send({
            success: true,
            message: "Friend request accepted and friends added",
          });
        }
      );
    });
  });
});

//decline friend requests
app.post("/decline-friend-request/:requestId", (req, res) => {
  const requestId = req.params.requestId;
  const declineQuery = `
        UPDATE FriendRequests SET status = 'DECLINED' WHERE id = ?
    `;

  db.query(declineQuery, [requestId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    res.send({ success: true, message: "Friend request declined" });
  });
});

app.get("/friends-list/:userId", (req, res) => {
  const userId = req.params.userId;
  // Query to fetch friends from the Friends table
  const query = `
        SELECT u.id, u.username FROM Friends f
        JOIN Users u ON u.id = f.userId1 OR u.id = f.userId2
        WHERE (f.userId1 = ? OR f.userId2 = ?) AND u.id != ?
    `;

  db.query(query, [userId, userId, userId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Internal Server Error");
    }
    // Filter duplicates if any, as the query may return the user itself or duplicate friends
    const uniqueFriends = results.filter(
      (result, index, self) =>
        index === self.findIndex((t) => t.id === result.id)
    );
    res.json(uniqueFriends);
  });
});

app.listen(8800, () => {
  console.log("Connected to Server 👾");
});
