import React, { useState } from "react";
import "./register.css";
import axios, {AxiosError} from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // Used for navigating to other places 
  const navigate = useNavigate();

  //Storing the values in the fields on the register page
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  //Errors if any in the field inputs will be stored here
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    reEnterPassword: "",
  });

  //Whenever something is typed in the login form, this method updates the fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
    setErrors({});
  };

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  //Validates the form inputs before submitting it to the backend
  const validateForm = () => {
    let valid = true;
    //Stores all the errors
    let errorsCopy = { ...errors };
    if (user.name.trim() === "") {
      errorsCopy.name = "Name is required";
      valid = false;
    }
    if (user.email.trim() === "") {
      errorsCopy.email = "Email is required";
      valid = false;
    } else if (!validateEmail(user.email.trim())) {
      errorsCopy.email = "Email is invalid";
      valid = false;
    }
    if (user.password.trim() === "") {
      errorsCopy.password = "Password is required";
      valid = false;
    } else if (user.password.trim().length < 6) {
      errorsCopy.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (user.reEnterPassword.trim() === "") {
      errorsCopy.reEnterPassword = "Please re-enter your password";
      valid = false;
    } else if (user.password !== user.reEnterPassword) {
      errorsCopy.reEnterPassword = "Passwords do not match";
      valid = false;
    }
    setErrors(errorsCopy);
    return valid;
  };

  //Register method is called when user hits the register button. Passes the values to the backend
  const register = () => {
    if (validateForm()) {
      axios
        .post("http://localhost:9002/register", user)
        .then((res) => {
          alert(res.data.message);
          navigate("/login", { replace: true });
        })
        .catch((error) => {
            if(error.name===AxiosError)
            alert("Server Down! Try again Later")
            else    
                alert(error.message)
        });
    }
  };

  return (
    <div className="card">
        <h1>Register</h1>
        <div className="register">
            <input
                type="text"
                name="name"
                value={user.name}
                placeholder="Your Name"
                onChange={handleChange}
            />
            {errors.name && <span className="error">{errors.name}</span>}
            <input
                type="text"
                name="email"
                value={user.email}
                placeholder="Your Email"
                onChange={handleChange}
            />
            {errors.email && <span className="error">{errors.email}</span>}
            <input
                type="password"
                name="password"
                value={user.password}
                placeholder="Your Password"
                onChange={handleChange}
            />
            {errors.password && <span className="error">{errors.password}</span>}
            <input
                type="password"
                name="reEnterPassword"
                value={user.reEnterPassword}
                placeholder="Re-enter Password"
                onChange={handleChange}
            />
            {errors.reEnterPassword && (
                <span className="error">{errors.reEnterPassword}</span>
            )}
            <div className="button" onClick={register}>
                Register
            </div>
            <a onClick={() => navigate("/login", {replace: true})}>Old User? Login Here</a>
        </div>
    </div>
);
}

export default Register;
