import express from "express"
import cors from "cors"
import mongoose from "mongoose"

import {transporter, customerMailOptionsTemplate, companyMailOptionsTemplate} from './mailOptions.js'
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

const db = "mongodb+srv://problem_resolution:problem_resolution@cluster0.gprpgk6.mongodb.net/problem_resolution?retryWrites=true&w=majority"

mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Connected Successfully'))
.catch((err) => { console.error(err); });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
})

const imageSchema = new mongoose.Schema({
    name: String,
    data: Buffer,
    contentType: String
  });
  
const Image = mongoose.model('Image', imageSchema);
  

const User = new mongoose.model("User", userSchema,"users")

//Login Route
app.post("/login", (req, res)=> {
    // Email and password are fetched from the request
    const { email, password} = req.body

    //User is searched from the database based on email
    User.findOne({ email: email})
    .then( user => {
        if(user){
            if(password === user.password ) {
                res.send({message: "Login Successful", user: user})
            } else {
                res.send({ message: "Incorrect Password"})
            }
        } else {
            res.send({message: "User not registered"})
        }
    })   
    .catch(err => {
        res.send(err)
    })
})

function prepareCutomerMail(customerMailOptions,name,model,serial,image,customer_email)
{
    var message_body = customerMailOptions['html'];
    message_body = message_body.replace(/\${customerName}/g, name);
    message_body = message_body.replace(/\${modelNumber}/g,  model);
    message_body = message_body.replace(/\${serialNumber}/g, serial);
    customerMailOptions['html'] = message_body;
    customerMailOptions['attachments'] = [{filename: 'image.png', path: "data:image/png;base64," + image, cid: "image1"}];
    customerMailOptions['to'] = customer_email;
}

function prepareCompanyMail(companyMailOptions,name,model,serial,address,pincode,image)
{
    var message_body = companyMailOptions['html'];
    message_body = companyMailOptions['html'];
    message_body = message_body.replace(/\${customerName}/g, name);
    message_body = message_body.replace(/\${modelNumber}/g,  model);
    message_body = message_body.replace(/\${serialNumber}/g, serial);
    message_body = message_body.replace(/\${address}/g, address);
    message_body = message_body.replace(/\${pinCode}/g,  pincode);
    companyMailOptions['html'] = message_body;
    companyMailOptions['attachments'] = [{filename: 'image.png', path: "data:image/png;base64," + image, cid: "image1"}];
}

function sendTheMail(mailOptions) {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(false);
        } else {
          console.log('Email sent: ' + info.response);
          resolve(true);
        }
      });
    });
  }

//Mail Route
app.post("/mail", (req, res)=> {
    // Details are fetched from the request
    console.log(req);
    const {name, model, serial,address,pincode}= req.body.customer;
    const userId = req.body.userId;
    const image  = req.body.selectedImage;
    
    let customerMailOptions = {...customerMailOptionsTemplate};
    let companyMailOptions = {...companyMailOptionsTemplate};
    User.findOne({ _id: userId})
    .then( user => {
        prepareCutomerMail(customerMailOptions,name,model,serial,image,user.email);
        sendTheMail(customerMailOptions);
    })   
    .catch(err => {
        res.send(err)
    })
    
    prepareCompanyMail(companyMailOptions,name,model,serial,address,pincode,image)

    sendTheMail(companyMailOptions).then(status => {
        if(status)
        {
            res.send({message: "Request Submitted Successfully"})
        }
        else{
            res.send({message: "Request could not be submitted"});
        }

    })

    
});
    

//Register route
app.post("/register", (req, res)=> {
    // Details are fetched from the request
    const {name, email, password} = req.body
    //User is searched from the database based on email
    User.findOne({email: email})
    .then(user => {
        if(user){
            //If user is found
            res.send({message: "User already registered"})
        } else {
            //If user isn't found, new user is created and gets stored in the db
            const newUser = new User({
                name,
                email,
                password
            })
            newUser.save()
                .then(() => {
                    res.status(200).send( { message: "Successfully Registered, Please login now." })
                })
                .catch(err => {
                    res.send(err)
                })
        }
    })
    .catch(err => {
        res.send(err)
    })
})

// Fetches all images from the db for dropdown
app.get('/images', async (req, res) => {
    try {
      const images = await Image.find(); // retrieve all images from database
      const imageList = [];
  
      // convert each image buffer to base64 string
      images.forEach((image) => {
        const base64Image = Buffer.from(image.data).toString('base64');
        imageList.push({ name: image.name, image: base64Image });
      });
  
      res.status(200).json(imageList); // send the image list to frontend
    } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
    }
  });

app.listen(9002,() => {
    console.log("BE started at port 9002")
})