import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import AddFriend from "./components/AddFriend/AddFriend";
import FriendRequests from "./components/FriendRequests/FriendRequests";
import FriendsList from "./components/FriendsList/FriendsList";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addFriend" element={<AddFriend />} />
          <Route path="/friendRequests" element={<FriendRequests />} />
          <Route path="/friendsList" element={<FriendsList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
