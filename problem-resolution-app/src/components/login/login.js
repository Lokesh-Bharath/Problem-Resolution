import React, { useState } from "react";
import "./login.css";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import {Spin as Spinner} from 'antd'

const Login = ({ handleLogin }) => {
  // Used for navigating to other places 
  const navigate = useNavigate();

  //Storing the values in the fields on the login page
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  //Errors if any in the field inputs will be stored here
  const [errors, setErrors] = useState({});

  const [isLoading, setIsLoading] = useState(false); 

  //Whenever something is typed in the login form, this method updates the fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });

    //Errors are set to none, once user starts typing something
    setErrors({})
  };

  //Validates the form inputs before submitting it to the backend
  const validateForm = () => {
    let errors = {};

    // Check if email is valid
    if (!user.email.trim() || !/\S+@\S+\.\S+/.test(user.email.trim())) {
      errors.email = "Please enter a valid email address";
    }

    // Check if password is at least 6 characters long
    if (!user.password.trim() || user.password.trim().length < 6) {
      errors.password = "Please enter a password with at least 6 characters";
    }

    //Errors areset in our global variable
    setErrors(errors);

    //validation passes if there are no errors
    return Object.keys(errors).length === 0;
  };

  //Login method is called when user hits the login button.
  const login = () => {
    if (validateForm()) {
        setIsLoading(true);
      axios
        .post("http://localhost:9002/login", user)
        .then((res) => {
            setIsLoading(false);
          alert(res.data.message);
          handleLogin(res.data.user);
          navigate("/", { replace: true });
        })
        .catch((error) => {
            setIsLoading(false);
            if(error.name===AxiosError)
                alert("Server Down! Try again Later")
            else    
                alert(error.message)
        });
    }
  };

  //The layout itself
  return (
    <div className="card">
      <h1>Login</h1>
      <div className="login">
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Enter your Email"
        />
        {errors.email && <div className="error">{errors.email}</div>}
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Enter your Password"
        />
        {errors.password && <div className="error">{errors.password}</div>}
        <div className="button" onClick={login}>
          {isLoading ? <Spinner size="small" /> : "Login"} {/* Use the loading state to conditionally render the spinner */}
        </div>
        <a onClick={() => navigate("/register", { replace: true })}> New User? Register Here </a>
      </div>
    </div>
  );
};

export default Login;
