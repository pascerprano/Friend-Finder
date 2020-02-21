const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
var client = require('../config/connection.js');

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
  console.log("search result: ",req.body[0]);
  const result = await client.search({
    index: 'users',
    size: 10,
    body: {
      "query":{
        "query_string" : {"default_field" : "userName", "query" : "*"+req.body[0]+"*"}
      }
    },
    pretty:true
  }, {
    ignore: [404],
    maxRetries: 3
  })
  let resultArr = []
  result.hits.hits.map(items=>{
    // console.log(items['_source'])
    resultArr.push({id:items['_source'].id,name:items['_source'].name,userName:items['_source'].userName})
  })
  // console.log(result)
  res.status(200).send(resultArr)
})

module.exports = router