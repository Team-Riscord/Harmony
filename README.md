# Discord Clone Project

This project follows the Test-Driven Development approach. The listed features/functionalities of the app components are tested.

<br />

# Components Of The App

### Login Page
- Two input fields: _email or username_ and _password_.
- Login button, which when clicked:
  - Checks if the input fields are empty.
    - If empty, it shows the error message: _please enter your email or username_ and _please enter your password_.
    - Validates the email format if an email is entered.
      - If the email format is incorrect, it displays an error message prompting the user to enter a valid email: _please enter a valid email_.
    - Validates the entered credentials against the database.
      - If the credentials are incorrect, it displays an error message indicating incorrect email/username or password: _incorrect email/username or password_.
      - If the credentials are correct, it logs the user in.
- 'Show Password' checkbox below the password input, which, when checked, shows the password in readable text.

### Sign-Up Page
- Four input fields: _fullname_, _email_, _username_, and _password_.
- Signup button, which when clicked:
  - Checks if any of the input fields are empty.
    - If any field is empty, it shows the corresponding error message: _please enter your name_, _please enter your email_, _please enter your username_, and _please enter a password_.
  - Validates the email format.
    - If the email format is incorrect, it displays an error message: _please enter a valid email_.
  - Checks if the entered email or username already exists in the database.
    - If the email exists, it displays an error message: _Email already exists_.
    - If the username exists, it displays an error message: _Username already exists_.
  - If all conditions are met, it adds the user to the database and clears the input fields.
- 'Show Password' checkbox below the password input, which, when checked, shows the password in readable text.

### Harmony
- **Features:**
  - Serves as the main component for the Riscord application.
  - Combines the sidebar and direct messaging server bar components into a single page layout.

- **Components:**
  - Sidebar
    - Displays the main functionalities of the Riscord application, such as joining servers and downloading apps.
  - DMServerBar
    - Facilitates direct messaging and friend management within the application.

### Sidebar
- **Features:**
  - Displays icons representing various functionalities such as adding a server and downloading apps.
  - Dynamically fetches and displays user servers from the database.
  - Supports hover effects and click events for each sidebar icon.
  - Provides visual indicators for active sidebar icons.

- **Components:**
  - Sidebar Icon Container
    - Wraps each sidebar icon with hover indicators.
  - Overlay Text
    - Displays tooltips on hover over the sidebar icons.
  - Sidebar Icon
    - Represents different functionalities such as adding a server, exploring servers, and downloading apps.
  - Pointer Events Handling
    - Disables pointer events on the body while add server or download apps components are visible.

### Add Server
- **Features:**
  - Allows users to customize their server by providing a name and an icon.
  - Validates user input for server name and server icon selection.
  - Generates a unique server ID and adds server details to the database upon creation.
  - Assigns the user as the server administrator upon creation.
  - Provides a link to join an existing server if the user already has an invite.

- **Components:**
  - Close Icon
    - Allows users to close the add server window.
  - Title
    - Displays the title of the add server section.
  - Subtitle
    - Provides guidance on customizing the server.
  - Server Image Input
    - Allows users to select an icon for their server, with error handling for missing image selection.
  - Server Name Input
    - Allows users to input the name of their server, with error handling for missing server name.
  - Create Button
    - Initiates the server creation process.
  - Join Invitation
    - Provides a link to join an existing server.
  - Join Server Window
    - Displays a window to join an existing server if the user chooses to do so.

### Join Server
- **Features:**
  - Enables users to join servers using invite links.
  - Validates the format of the invite link.
  - Checks if the user is already a member of the server.
  - Provides examples of valid invite links.
  - Offers the option to discover servers if the user lacks an invite link.

- **Components:**
  - Join Server Form
    - Contains input field for invite link and error message display.
  - Invite Example Section
    - Provides examples of valid invite links.
  - Discover Servers Button
    - Guides users to explore discoverable communities.

### Download Apps
- **Features:**
  - Provides options to download the Discord app for different platforms.
  - Includes direct download links for macOS, Windows, Linux, iOS, and Android.
  - Offers a link to the public test build of the app.

- **Components:**
  - Download Apps Title
    - Displays the title of the download apps section.
  - Download Cards
    - Represent each platform with an icon, title, and download button.
  - Latest Link Section
    - Provides a link to the public test build of the app.

### DM Server Bar
- **Features:**
  - Facilitates direct messaging and friend management.
  - Displays the user's profile image, username, and friend list.
  - Allows users to add friends, view friend requests, and initiate direct messages.
  - Provides options to close the add friend, friends list, and friend requests windows.

- **Components:**
  - Top Section
    - Displays the title of the direct messaging section.
  - Middle Section
    - Contains buttons for adding friends and viewing friend requests, as well as options to create direct messages.
  - Bottom Section
    - Displays the user's profile image, username, and settings icon.
  - Add Friend Window
    - Allows users to add friends by entering their usernames.
  - Friends List Window
    - Displays the user's list of friends and enables direct messaging.
  - Friend Requests Window
    - Lists incoming friend requests and allows users to accept or decline them.

### Add Friend
- **Features:**
  - Enables users to add friends by entering their usernames.
  - Checks if the entered username is valid and not the user's own username.
  - Sends friend requests to the specified users.
  - Displays error messages for invalid usernames, duplicate requests, and attempts to add oneself as a friend.

- **Components:**
  - Close Icon
    - Allows users to close the add friend window.
  - Title
    - Displays the title of the add friend section.
  - Subtitle
    - Provides instructions on adding friends.
  - Username Input
    - Allows users to input the username of the friend they want to add.
  - Send Request Button
    - Sends a friend request to the specified user.
  - Error Text
    - Displays error messages for various scenarios, such as invalid usernames or duplicate requests.

### Friend Requests
- **Features:**
  - Lists incoming friend requests for the user.
  - Allows users to accept or decline friend requests.
  - Removes friend requests from the database upon acceptance or rejection.

- **Components:**
  - Friend Requests Title
    - Displays the title of the friend requests section.
  - Friend Request Button
    - Represents each incoming friend request, including the requester's profile image and username.
  - Accept and Decline Buttons
    - Enables users to accept or decline friend requests.

### Friends List
- **Features:**
  - Displays the user's friends list retrieved from the database.
  - Supports chat functionality with friends.

- **Components:**
  - Friends List Title
    - Displays the title of the friends list section.
  - Friend Button
    - Represents each friend in the list, including their profile image and username.
  - Chat Button
    - Enables users to initiate chats with friends.

<br />

### Users
- **id**: string
- **name**: string
- **profileImage**: string
- **username**: string
- **email**: string
- **password**: string
- **createdAt**: datetime
- **updatedAt**: datetime
- **friends**: [string] (Array of user IDs)
- **friendRequests**: [string] (Array of user IDs)
- **isOnline**: boolean

### Servers
- **id**: string
- **name**: string
- **serverIcon**: string
- **serverAdmin**: string (Reference to User id)
- **createdAt**: datetime
- **updatedAt**: datetime

### Members
- **id**: string
- **role**: enum (ADMIN, MODERATOR, GUEST)
- **userID**: string (Reference to User id)
- **serverId**: string (Reference to Server id)
- **createdAt**: datetime
- **updatedAt**: datetime

### Channels
- **id**: string
- **name**: string
- **type**: enum (TEXT, AUDIO, VIDEO)
- **profileId**: string (Reference to User id)
- **serverId**: string (Reference to Server id)
- **createdAt**: datetime
- **updatedAt**: datetime

### ServerMessages
- **id**: string
- **senderId**: string (Reference to User id)
- **serverId**: string (Reference to Server id)
- **message**: string
- **createdAt**: datetime
- **updatedAt**: datetime

### DirectMessages
- **id**: string
- **senderId**: string (Reference to User id)
- **receiverId**: string (Reference to User id)
- **message**: string
- **createdAt**: datetime
- **updatedAt**: datetime

<br />

# Setup Instructions

The `MySQL_Database_Setup` branch has been updated. Therefore, when you pull the code, you won't need to set up a local database or a table manually, as it will be done for you. All that's required is ensuring you have `node`, `npm`, and `MySQL` installed.

Upon pulling the code, you'll find two folders, `client` and `server`. You should open two terminals. Navigate one terminal to the `client` folder and the other to the `server` folder. Then, in both terminals, simply type `npm start`, and everything should function smoothly.

Next, open your browser and launch two tabs. In one tab, navigate to `http://localhost:3000`, and in the other, to `http://localhost:8800/userdata`. The tab displaying the app running on port 3000 will initially show a blank screen, while the one displaying the server-side component on port 8800 should show `No Data Available`. This indicates that the database and the Users table have been successfully created, though no data has been inserted yet. If you encounter an `Internal Server Error`, please attempt to log the error into the browser console or your terminal and decode it. If troubleshooting is needed, share a screenshot with team members, and we'll address it together.

When running the server-side using `npm start`, you should see the following messages in terminal:
```
> nodemon index.js

nodemon starting exter index. j,mjs, cis, son

connected to server

Database 'Harmony' created or already exists

Using Harmony database

Users table created or already exists
```

To confirm that everything is operational, open your terminal and type `mysql -u root -p`. Enter your password if prompted, and the `MySQL monitor` will open. Then, type `show databases;` to list all local databases. You should see a database called `Harmony` listed. Select this database by typing `use Harmony;`. Finally, type `show tables;` to list all tables within the database. You should be able to see a table named `Users`, which means that the setup is complete. Please refer to the code block below for more clarity:
```
> MySQL -u root -p

Enter password:
Welcome to the MySQL monitor. Commands end with ';' or '\g'.
Your MySQL connection id is 122
Server version: 8.0.36 MySQL Community Server - GPL
Copyright (c) 2000, 2024, Oracle and/or its affiliates. Oracle is a registered trademark of Oracle Corporation and/or its affiliates. Other names may be trademarks of their respective owners.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

mysql> SHOW DATABASES;

+--------------------+
| Database           |
+--------------------+
| Harmony            |
| information_schema |
| mysql              |
| performance_schema |
+--------------------+

mysql> USE Harmony;

Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A
Database changed

mysql> SHOW TABLES;

+-------------------+
| Tables_in_harmony |
+-------------------+
| Users             |
+-------------------+

mysql> DESC Users;

+----------+--------------+------+-----+---------+----------------+
| Field    | Type         | Null | Key | Default | Extra          |
+----------+--------------+------+-----+---------+----------------+
| id       | int          | NO   | PRI | NULL    | auto_increment |
| name     | varchar(100) | NO   |     | NULL    |                |
| email    | varchar(100) | NO   | UNI | NULL    |                |
| password | varchar(100) | NO   |     | NULL    |                |
| username | varchar(10)  | NO   | UNI | NULL    |                |
| image    | longblob     | YES  |     | NULL    |                |
+----------+--------------+------+-----+---------+----------------+
```

Now, you're ready to start developing your components in the client folder. 👍