const express = require('express');//express module
const userController = require('./controllers/user.controller');
const userRouter = express.Router();
userRouter.post('/', userController.createNewUser);
userRouter.get('/:email', userController.getUserDetails);
userRouter.get('/login/auth', userController.auth ,(req, res) => { res.status(200).send('welcome ' + req.userName)});
userRouter.post('/login', userController.loginFunction);


const profileController=require('./controllers/profile.controller');
const profileRouter=express.Router();
profileRouter.get('/:email', profileController.getUserProfile);
profileRouter.put('/:email', profileController.updateUserProfile);
profileRouter.get('/', profileController.getAllUser);
profileRouter.put('/friend/:email', profileController.updateFriendsList);
profileRouter.put('/photo/:email', profileController.uploadPhoto);
profileRouter.put('/removephoto/:email', profileController.deletePhoto);


const routes = (app) => {

  app.use('/user', userRouter);
  app.use('/profile',profileRouter);

  app.get('/', (req, res) => {
    return res.send({ message: "User Service Up!"});
  }) 
}

module.exports = routes;