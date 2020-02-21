const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');


const saltRounds = 10;
const models = require('../models')
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

router.post('/',async function(req,res){
    const details = req.body.loginApp[0];
    console.log()
    const hash = bcrypt.hashSync(details.password, saltRounds);
    const userCreated = await models.users.create({ name: details.name, userName: details.userName,email: details.email,password: hash,birthday: details.birthday,gender: details.gender });
    console.log("user created now",userCreated);
    res.status(200).send("user created");
})

module.exports = router