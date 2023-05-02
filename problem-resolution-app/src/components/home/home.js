import React, { useState, useEffect } from "react"
import "./home.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Menu, Dropdown, Button, Spin as Spinner} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import 'rsuite/dist/rsuite.min.css';


const Home = ({ userId, handleLogout }) => {

  // Used in navigating between pages
  const navigate = useNavigate()

  // Used to keep track of what all is filled in the form
  const [customer, setCustomer] = useState({
    name: "",
    model: "",
    serial: "",
    address: "",
    pincode: ""
  })

  // Keeps track of images fetched from backend to be shown in the dropdown
  const [images, setImages] = useState([]);

  // Keeps track of the image that is selected
  const [selectedImage, setSelectedImage] = useState(null);

  
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState({});

  // Helps in updating selected image whenever an image is clicked from the dropdown
  const handleMenuClick = (e) => {
    setSelectedImage(e.key);
  };

  // Creates the menu shown when the image dropdown is clicked
  const menu = (
    <Menu onClick={handleMenuClick}>
      {images.map((image) => (
        <Menu.Item key={image.image}>
          <img src={`data:image/png;base64,${image.image}`} height={50} width={50} alt={image.name} />
        </Menu.Item>
      ))}
    </Menu>
  );

  //Whenever any value is added or removed from the form, this method updates the fields accordingly
  const handleChange = e => {
    const { name, value } = e.target
    setCustomer({
      ...customer,
      [name]: value
    })
    setErrors({})
  }

  // Validates the customer information and returns error message if any field is empty
  const validateForm = () => {
    let valid = true;
    let errorsCopy = { ...errors };
    
    if (customer.name.trim() === "") {
      errorsCopy.name = "Please enter customer name";
      valid = false;
    }
    if (customer.model.trim() === "") {
      errorsCopy.model = "Please enter model number";
      valid = false;
    }
    if (customer.serial.trim() === "") {
      errorsCopy.serial = "Please enter serial number";
      valid = false;
    }
    if (customer.address.trim() === "") {
      errorsCopy.address = "Please enter address";
      valid = false;
    }
    if (customer.pincode.trim() === "") {
      errorsCopy.pincode = "Please enter pincode";
      valid = false;
    } else if (!/^\d{6}$/.test(customer.pincode.trim())) {
      errorsCopy.pincode = "Pincode should be 6 digits long";
      valid = false;
    }
    
    setErrors(errorsCopy);
    return valid;
  };
  

  //T his hook fetches images from the backend once home page is loaded
  useEffect(() => {
    axios.get("http://localhost:9002/images")
      .then((response) => setImages(response.data))
      .catch(error => {
        console.log(error.message);
      });
  }, []);

  // On submiting the form, all the customer fields along with userId are sent to backend
  const submit = () => {
    const formIsValid = validateForm();
    if(formIsValid && selectedImage)
    {
        setIsLoading(true);
        axios.post("http://localhost:9002/mail", { customer, userId, selectedImage })
        .then(res => {
            setIsLoading(false);
            console.log(res)
            alert(res.data.message);
            //empties all input fields in home page
            const emptyCustomer = Object.keys(customer).reduce((accumulator, value) => {
            return { ...accumulator, [value]: '' };
            }, {});
        //setCustomer(emptyCustomer);
        setSelectedImage(null);
      })
      .catch(error => {
            console.log(error)
            setIsLoading(false);
            alert(error)
      })
    }
    else if(formIsValid && !selectedImage)
    {
        alert("Please select an error image")
    }
  }

  // Implements the logout functionality
  const logout = () => {
    alert("Logged out successfully")
    handleLogout({})
    navigate("/")
  }


  return (
    <div className="container">
      <div className="header">
        <h1>Customer Request</h1>
        <button className="logout" onClick={logout}>
          Logout
        </button>
      </div>
      <div className="home">
        {isLoading ? (
          <div className="spinner-container">
            <Spinner size="large" />
          </div>
        ) : (
          <div className="customer_info">
            <input
              type="text"
              name="name"
              value={customer.name}
              onChange={handleChange}
              placeholder="Enter name of Customer"
            />
            {errors.name && <span className="error">{errors.name}</span>}
            <input
              type="text"
              name="model"
              value={customer.model}
              onChange={handleChange}
              placeholder="Enter model number"
            />
            {errors.model && <span className="error">{errors.model}</span>}
            <input
              type="text"
              name="serial"
              value={customer.serial}
              onChange={handleChange}
              placeholder="Enter serial number"
            />
            {errors.serial && <span className="error">{errors.serial}</span>}
            <textarea
              type="text"
              name="address"
              rows="4"
              value={customer.address}
              onChange={handleChange}
              placeholder="Enter your address"
            />
            {errors.address && <span className="error">{errors.address}</span>}
            <input
              type="text"
              pattern="[0-9]*"
              name="pincode"
              value={customer.pincode}
              onChange={handleChange}
              placeholder="Enter pincode"
            />
            {errors.pincode && <span className="error">{errors.pincode}</span>}
            <br height="30px"></br>
            <Dropdown back overlay={menu} trigger={['click']} >
              <Button className="my-button">
                Select an image<DownOutlined />
              </Button>
            </Dropdown>
            <br></br>
            {selectedImage && (
              <div>
                <h4>Selected Image:</h4>
                <img
                  src={`data:image/png;base64,${images.find(
                    (image) => image.image === selectedImage
                  ).image}`}
                  height={50}
                  width={50}
                  alt={selectedImage}
                />
              </div>
            )}
            <button className="submit" onClick={submit}>
              Submit
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Home;