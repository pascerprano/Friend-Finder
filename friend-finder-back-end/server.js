
const express = require('express');
const cors = require('cors')

var app = express();
app.use(cors());
const bodyParser = require('body-parser'); 
app.use(bodyParser.json());
app.set('port', process.env.PORT || 4000);
const io = require('socket.io')();
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

const models = require('./models')
const Sequelize = require('sequelize');
const sequelize = new Sequelize('friendFinder', 'anush', 'anush', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 9,
    min: 0,
    idle: 10000
  }
});
const populate = require('./elasticSearch/populate')();
const mongoose = require('./config/Database')

//global variables
const saltRounds = 10;
const privateKey = "friendfinder";
const Thread = require('./models/MongoDB/Thread')
const Message = require('./models/MongoDB/Message')

//init sequelize
sequelize.authenticate().then(() => {
  console.log("Success!");
}).catch((err) => {
  console.log(err);
});
var elaseticClient = require('./config/connection');

elaseticClient.cluster.health({},function(err,resp,status) {  
  console.log("-- Client Health --",resp.status);
});

const limit = 200;
app.get('/',async function(req,res,next){
    let result = await models.users.findAll({
        raw:true,
        limit:200
    })
    // populate.populate(result)
    res.status(200).send(result)
})

app.use('/log-in',require('./Routes/login'));
app.use('/sign-up',require('./Routes/SignUp'));
app.use('/log-in/check-login',require('./Routes/login'));
app.use('/send-friend-request',require('./Routes/Friends'));
app.use('/search-friends',require('./Routes/search'));  

//start the io.js file to enable chat
// io.listen(5000);
app.listen(4000, async function () {
    console.log('Server is running.. on Port 4000');
});
