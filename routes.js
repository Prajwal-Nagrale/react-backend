const express = require('express');
const userController = require('./controllers/user.controller');
const userRouter = express.Router();
userRouter.post('/', userController.create);
userRouter.get('/:email', userController.getByCustID);
userRouter.get('/login/auth', userController.auth ,(req, res) => { res.status(200).send('welcome ' + req.userName)});
userRouter.post('/login', userController.loginFunction);


const profileController=require('./controllers/profile.controller');
const profileRouter=express.Router();
profileRouter.get('/:email', profileController.getByCustID);
profileRouter.put('/:email', profileController.updateById);
profileRouter.get('/', profileController.getAllUser);
profileRouter.put('/friend/:email', profileController.updateFriends);
profileRouter.put('/photo/:email', profileController.uploadPhoto);


const routes = (app) => {

  app.use('/user', userRouter);
  app.use('/profile',profileRouter);

  app.get('/', (req, res) => {
    return res.send({ message: "User Service Up!"});
  }) 
}

module.exports = routes;