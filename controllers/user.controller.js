const { User } = require('../models');
const {Profile}=require('../models');
const jwt = require('jsonwebtoken');
const { privateKey} = require('../config');
const NodeRSA=require('node-rsa');
const {public_key,private_key}=require('./rsaKeys')

//const key=new NodeRSA({b:1024});

let key_private=new NodeRSA(private_key);
let key_public=new NodeRSA(public_key);

//Create a new User in User table
const createNewUser = async (req, res) => {  
    const { userName,email,password } = req.body;
    let status;
    let message;
    try {
      //Creating and checking whether the user is present in database or not
      const user = new User({ 
          userName:userName,
          email:email,
          password:key_public.encrypt(password,'base64')

      });
      //Saving user data
      await user.save();
      const profile = new Profile({
        userName:userName,
          email:email,
          createdAt: new Date().getTime(),
      });
      await profile.save();
      status = 200;
      message = 'Account of '+userName+' created Successfully';
    } catch (err) {
      //If some err caught the showing error in console
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Email Id Already Exists please use Different one';
    }
  
    res.status(status).send({ message});//send message to front-end
  }

  const getUserDetails = async (req, res) => {
    console.log(req.params);//checking parameter in in console
    const { email } = req.params;
    let status;
    let message;
    try {
      //fetching user details from database using email Id
      const user = await User.find({ email:email });
      status = 200;
      message =user[0].userName;//message[0]
  
    } catch(err) {
      //If some err caught the showing error in console
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message,status });
  }
 

const loginFunction= async (req, res) => {
  
  const { email, password } = req.body;
  const usersInfo = await User.find({email:email});
  console.log("Login done by "+usersInfo[0].userName);
  //console.log(key_private.decrypt(check,'utf8'));
  
if (usersInfo !== null) {
  if (key_private.decrypt(usersInfo[0].password ,'utf8')===(password)) {
    // login should be successful
    token = jwt.sign({ userName: usersInfo[0].userName }, privateKey);
    res.status(200).send({ message: "Login Success", token ,email})
  } else {
    // login pwd / email mismatch
    res.status(401).send({ message: "Invalid Email/Password Entered"})
  }
} else {
  // user does not exit;
  res.status(404).send({ message: "User Not found"});
}
}


  const auth = (req, res, next) => {
    if (req.headers) {
      //console.log(req.headers);
      if (req.headers.authorization) {
        const [bearer, token] = req.headers.authorization.split(" "); // Bearer <token>
        const decode = jwt.verify(token, privateKey);
        //console.log(decode);
        if (decode['userName']) {
          req.userName = decode['userName'];
          next()
        }
      }
    }
    res.status(401).send('Unauthorised from middleware');

    
  }
  
  module.exports = {
    createNewUser,
    auth,
    loginFunction,
    getUserDetails
  }