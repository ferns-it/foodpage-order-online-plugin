import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/order/Order";
import { Toaster } from "react-hot-toast";
import Main from "./pages/Main";
import Success from "./pages/Success";

function App() {
  return (
    <div className="App">
      <Toaster />
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/confirm" element={<Success />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
