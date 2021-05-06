const { User } = require('../models');
const {Profile}=require('../models');
const jwt = require('jsonwebtoken');
const {mongoUrl, privateKey} = require('../config');
const NodeRSA=require('node-rsa');
const Forge= require('node-forge');
const {Member} =require('../models/member.model');

//const key=new NodeRSA({b:1024});

public_key=`-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDIhPFxQlQvxjkBS0WYSbt48kxX
+9vzEEDdYtsmU3dZXaJVGL71HyI1GgQhFZuK5QxAg6V5A87IEHChLWli+UqeVFFG
9zEEe+phWbe3oZoIWWPM3r9atRkJ4mnRIwuL2gDKJqfJlFtyfXbCuaVPhX7XE3c2
kLjuV3/XVzjRPzaslQIDAQAB
-----END PUBLIC KEY-----`;

private_key=`-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDIhPFxQlQvxjkBS0WYSbt48kxX+9vzEEDdYtsmU3dZXaJVGL71
HyI1GgQhFZuK5QxAg6V5A87IEHChLWli+UqeVFFG9zEEe+phWbe3oZoIWWPM3r9a
tRkJ4mnRIwuL2gDKJqfJlFtyfXbCuaVPhX7XE3c2kLjuV3/XVzjRPzaslQIDAQAB
AoGALixGuJDQd+vKJp0hmm6oB7Krl7r8K907Qn9H/WxM2DwybCv1lNYld1rVRpUG
KxaRGq31xYb176WxebvOP6ct4h0o+Y825zKP/a2dT3w4ynpsghg0vapxUawF7E1m
gAdzdlshj8/sQDJF1ubxKp0UmjGscuk0uJCkpIO17gUJDEUCQQDk4Ynqyg8ckIDm
SzQya4qconH8xVSb7h6vo4TNkr1YDOAD4IU48VFdAtldH5mAHC2HRsvQM/ZN6Cxq
TjL23/nLAkEA4Echyv/C0AVo/7KFaPfbItfoczkdO9eBitLHKbVx3pEJQRgQ+40j
/BlOITuamnnl4gx6VKLc6AAtvnH6BeynHwJBAI39gUMAIUnWN7EmvHX/E1nCyTZH
8QpfOfg6WDv0KbTDIAInul4uDwzFpLVJ0j+Qu4ntmKlMYyPHwi4c3y8amesCQGn7
81I0zuDyzY2X1UenaRzsHuLkaJYw3vy1YnypS+g7bb4fG1dkeU7Wvn8h5Yt+c04B
S4XXeMEB5JwMzHQkQ00CQQCXeuXCIqJs25yDPrucNFnhc7zvlpdzAdy83ZnW7p8R
W2Tf5vCGBFxoLvVfoDUawwnjOcln5KoMhrSxLj10f4D/
-----END RSA PRIVATE KEY-----`;


let key_private=new NodeRSA(private_key);
let key_public=new NodeRSA(public_key);



const create = async (req, res) => {  
    const { userName,email,password } = req.body;
    console.log('Account of '+userName+' created Successfully')
    let status;
    let message;
    try {
      const user = new User({ 
          userName:userName,
          email:email,
          password:key_public.encrypt(password,'base64')

      });
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
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Email Id Already Exists please use Different one';
    }
  
    res.status(status).send({ message});
  }

  const getByCustID = async (req, res) => {
    console.log(req.params);
    const { email } = req.params;
  
    let status;
    let message;
  
    try {
      const user = await User.find({ email:email });
      status = 200;
      message =user[0].userName;
  
    } catch(err) {
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
  const rsa = Forge.pki.privateKeyFromPem(private_key);
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
    create,
    auth,
    loginFunction,
    getByCustID
  }