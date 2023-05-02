import './App.css'
import Homepage from "./components/home/home"
import Login from "./components/login/login"
import Register from "./components/register/register"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

function App() {
  const [user, setUser] = useState({});

  useEffect(() => {
    // Retrieve user from cookie on page refresh
    const userJson = Cookies.get('user');
    if (userJson) {
      const userObject = JSON.parse(userJson);
      setUser(userObject);
    }
  }, []);

  const handleLogin = (user) => {
    Cookies.set('user', JSON.stringify(user));
    setUser(user);
  };

  const handleLogout = () => {
    Cookies.remove('user');
    setUser({});
  };

  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={
            user && user._id ? (
              <Homepage userId={user._id} handleLogout={handleLogout} />
            ) : (
              <Login handleLogin={handleLogin} />
            )
          } />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
