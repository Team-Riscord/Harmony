# <p style="text-align: center; margin-bottom: 0;">Discord-Clone Project</p>

---

This project follows the Test-Driven Development approach. The listed features/functionalities of the app components are tested.

## Components Of The App

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