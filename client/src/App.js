import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import AddFriend from "./components/AddFriend/AddFriend";
import Homepage from './components/Homepage/Homepage'; 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} /> 
          <Route path="/signup" element={<Signup />} />
          <Route path="/addfriend" element={<AddFriend />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
