import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import Homepage from "./components/Homepage/Homepage";
import MessagingComponent from "./components/MessagingComponent/MessagingComponent"; 
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} index />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/messages" element={<MessagingComponent />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
