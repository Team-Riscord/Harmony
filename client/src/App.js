import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AddFriend from "./components/AddFriend/AddFriend";
import Signup from './components/Signup/Signup';
import Login from './components/Login/Login';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} /> 
          <Route path="/addfriend" element={<AddFriend />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
