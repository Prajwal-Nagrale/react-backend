const express = require('express');//express module using npm install express
const bodyParser = require('body-parser'); //it is a body-parsing middleware in node js for parsing the resquest body
const mongoose = require('mongoose');
const config = require('./config');//where our mongo url is stored
const PORT = 8081;
const routes = require('./routes');//it associates an http menthod
const cors=require('cors');//cross origin

const app = express();//initialise express
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);
mongoose.connect(config.mongoUrl, {useNewUrlParser: true});

app.listen(PORT, () => {
  console.log('Server listening on port: ' + PORT);
});