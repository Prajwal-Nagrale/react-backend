const {Profile}=require('../models');
const { User } = require('../models');


  //Fetching user Profile by Email Id
  const getUserProfile = async (req, res) => {
    const { email } = req.params;
    let status;
    let message;
    try {
      //fetching user profile if present in database
      const user = await Profile.find({ email:email });
      status = 200;
      message =user;
  
    } catch(err) {
      //If user profile not present then show error
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'User Not Found!!!'
    }
  
    res.status(status).send({ message });
  }

  //Updating Friends List in profile table
  const updateFriendsList=async(req,res)=>{
    const { email} = req.params;
    //console.log("updating "+req.params)
    let status;
    let message;
    const friendEmail=req.body.friendEmail;
    //console.log(req.body);
    try {
      //fetching and updating profile from database
      await Profile.findOneAndUpdate({ email:email},{
        $addToSet:{
          //Add unique data to database
          members:{
            friendEmail
          }
        }
      });
      status = 200;
      message = "Added Friend in  "+email;
    } catch(err) {
      //If some error show in console
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message });
  }

  //upload Photos in array in profile Table
  const uploadPhoto=async(req,res)=>{
    const { email} = req.params;
    let status;
    let message;
    const photos=req.body.photo;
    try {
      //fetching and updating profile from database
      await Profile.findOneAndUpdate({ email:email},{
        $addToSet:{
          photos:photos
        }
      });
      
      status = 200;
      message = "Added photo in  "+email;
  
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message });
  }

  //Deleting photo from profile table usinf findOneAndUpdate
  const deletePhoto=async(req,res)=>{
    const { email} = req.params;
    let status;
    let message;
    const photos=req.body.photo;
    try {
      //fetching and updating profile from database
      await Profile.findOneAndUpdate({ email:email},{
        $pull:{
          photos:photos
        }
      });
      
      status = 200;
      message = "Added photo in  "+email;
  
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message });
  }

  //update User's Profile by Email Id in profile table
  const updateUserProfile=async(req,res)=>{
    const { email} = req.params;
    //console.log("updating "+req.params)
    let status;
    let message;
    const userName=req.body.userName;
    //console.log(userName);//If we are fetching value of userName
    const city=req.body.city;
    //console.log(city);//If we are fetching value of city
    const state=req.body.state;
    //console.log(state);//If we are fetching value of state
    const gender=req.body.gender;
    //console.log(gender);//If we are fetching value of gender
    const profession=req.body.profession;
    //console.log(profession);//If we are fetching value of profession
    const profileImage=req.body.profileImage;
    //console.log(profileImage);//If we are fetching value of profileImage
    try {
      const profile = await Profile.findOne({ email:email});
      const user=await User.findOne({ email:email});
      if(userName){
        profile.userName=userName;
        user.userName=userName;
      }
      if(city)
      profile.city=city;
      if(state)
      profile.state=state;
      if(profileImage)
      profile.profileImage=profileImage;
      if(gender)
      profile.gender=gender;
      if(profession)
      profile.profession=profession;
      await profile.save();
      await user.save();
      status = 200;
      message = "Updated profile data of Id "+email;
  
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request!!!'
    }
  
    res.status(status).send({ message });
  }


//Fetching data of all user's from Profile table
const getAllUser = async (req, res) => {
    let status;
    let message;
    try {
      //Get all users from profile
      message = await Profile.find();
      status = 200;
    } catch(err) {
      console.log('Some error occured', err);
      console.log(err.stack);
      status = 400;
      message = 'Bad request'
    }
    res.status(status).send({ message: message.map((user) => ({
      //mapping the data
      userName: user.userName,
      email: user.email,
      city:user.city,
      state:user.state,
      gender:user.gender,
      profession:user.profession,
      profileImage:user.profileImage,
    })) });
  }


  module.exports ={
      getUserProfile,
      updateUserProfile,
      getAllUser,
      updateFriendsList,
      uploadPhoto,
      deletePhoto
  }