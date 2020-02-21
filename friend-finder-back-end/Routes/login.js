const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const models = require('../models')
const Sequelize = require('sequelize');
const { Op } = require("sequelize");
const { QueryTypes } = require('sequelize');
const sequelize = new Sequelize('friendFinder', 'anush', 'anush', {
  host: 'localhost',
  dialect: 'postgres',
  pool: {
    max: 9,
    min: 0,
    idle: 10000
  }
});

//global variable
const privateKey = "friendfinder";

router.post('/',async function(req,res){
    const details = req.body[0];
    console.log(details)
    var token = "";
    var status = ""
    var resArr = {}
    const currentUserDetails = await models.users.findAll({
        where: {
            email:details.email
        }
    })
    // console.log(details.email , currentUserDetails[0].dataValues.email , hash , currentUserDetails[0].dataValues.password)
    try{
        const hash = await bcrypt.compare(details.password,currentUserDetails[0].dataValues.password)
        if(hash && details.email === currentUserDetails[0].dataValues.email){
            console.log("login sucess")
            status+=""
            status+="login sucess" 
            token = jwt.sign({exp: Math.floor(Date.now() / 1000) + (60*60), userData: currentUserDetails[0].dataValues.name }, privateKey)
        }
        else{
            if(!hash){
                console.log(hash)
                status+=""
                status+="Email or password doesn't match"
            }  
        }
        if(status === "login sucess"){
            resArr={
                status,
                token,
                name: currentUserDetails[0].dataValues.name        
            }
        }
        else{
            resArr={
                status       
            }
        }
        res.status(200).send(resArr); 
    }
    catch(err){
        console.log(err)
        res.status(400).send(err.message)
    }
})

router.post('/check-login',async function(req,res){
    var decoded = ""
    var token = req.body;
    var message = {}
    try {
        decoded = await jwt.verify(token[0].toString(), privateKey);
        console.log("exec current user query\n")
        //retrive current user
        const currentUser = await models.users.findAll({
            attributes: ['id', 'name', 'userName','profileImageUrl' ],
            where:{
                name:decoded.userData.toString()
            },
            raw:true
        });
        //retrive all users except current.
        const allUsers = await models.users.findAll({
            attributes: ['id', 'name', 'userName' ],
            raw:true
        });

        //problem here
        console.log("exec friend request query\n")

        //get recomended friends to request no:1 problem
        const userDetails = await models.users.findAll({
            attributes: ['id', 'name', 'userName' ],
            distinct:true,
            limit:6,
            subQuery:false,
            include:[
                {
                    model:models.friendRequests
                },
                {
                    model:models.friendRequests,
                    as:'inverseFriends'
                }
            ],
            where:{
                id:{
                    [Op.ne]:currentUser[0].id
                },
                '$friendRequests.status$':null,
                '$inverseFriends.status$':null
            },
            raw:true,
        })
        // console.log(userDetails)
        console.log("\nlooping\n")
        const recomendFriendsArr = []
        let recomendFriends = {}
        userDetails.map(items=>{
            if(items['friendRequests.requestId']!==currentUser[0].id && items['friendRequests.requestToId']!==currentUser[0].id && items['inverseFriends.requestId']!==currentUser[0].id && items['inverseFriends.requestToId']!==currentUser[0].id ){
                // console.log(items)
                recomendFriends = {
                    id: items.id,
                    name: items.name,
                    userName: items.userName,
                    'friendRequests.id': null,
                    'friendRequests.requestId': null,
                    'friendRequests.requestToId': null,
                    'friendRequests.status': null,
                    'friendRequests.createdAt': null,
                    'friendRequests.updatedAt': null
                }
                recomendFriendsArr.push(recomendFriends)
            }
        })
        // console.log(userDetails)

        //get all friends
        const friends = await sequelize.query(`SELECT users.id , name , "userName","profileImageUrl" FROM users LEFT JOIN "friendRequests" ON users.id = "friendRequests"."requestToId" WHERE "friendRequests"."requestId" = :id and "friendRequests"."status" = 'accepted' UNION SELECT users.id , name , "userName","profileImageUrl" FROM users LEFT JOIN "friendRequests" ON users.id = "friendRequests"."requestId" WHERE "friendRequests"."requestToId" = :id and "friendRequests"."status" = 'accepted'`,{
            replacements:{id:currentUser[0].id},
            type: QueryTypes.SELECT,
            raw:true
        });
        // console.log(friends)
        
        for(let i in friends){
            let mutualFriends = await sequelize.query(`select "requestId" from "friendRequests" where "requestToId" =:id and status = 'accepted' and "requestId" != :other_id 
                UNION
                select  "requestToId" from "friendRequests" where "requestId" =:id  and status = 'accepted'   and "requestToId" != :other_id 
                INTERSECT
                select "requestId" from "friendRequests" where "requestToId" = :other_id and status = 'accepted' and    "requestId" !=:id 
                UNION
                select  "requestToId" from "friendRequests" where "requestId" = :other_id  and status = 'accepted' and "requestToId" !=:id;`,{
                replacements:{id:currentUser[0].id, other_id:friends[i].id},
                type: QueryTypes.SELECT,
                raw:true
            }); 
            let friendsForOthers = await sequelize.query(`SELECT users.id , name , "userName","profileImageUrl" FROM users LEFT JOIN "friendRequests" ON users.id = "friendRequests"."requestToId" WHERE "friendRequests"."requestId" = :id UNION SELECT users.id , name , "userName","profileImageUrl" FROM users LEFT JOIN "friendRequests" ON users.id = "friendRequests"."requestId" WHERE "friendRequests"."requestToId" = :id`,{
                replacements:{id:friends[i].id},
                type: QueryTypes.SELECT,
                raw:true
            });
            friends[i].friends=friendsForOthers.length
            friends[i].mutualFriends=mutualFriends.length
        }
        console.log("\n")


        const friendsCount = await sequelize.query(`SELECT users.id , name , "userName" FROM users LEFT JOIN "friendRequests" ON users.id = "friendRequests"."requestToId" WHERE "friendRequests"."status" = 'accepted' UNION SELECT users.id , name , "userName" FROM users LEFT JOIN "friendRequests" ON users.id = "friendRequests"."requestId" WHERE "friendRequests"."status" = 'accepted'`,{
            type: QueryTypes.SELECT,
            raw:true
        });
        // console.log(friendsCount)
        
        //see the friend requests
        const friendRequests = await models.friendRequests.findAll({
            where:{
                [Op.and]:{
                    requestToId:currentUser[0].id,
                    status:"waiting"
                }
            },
            raw:true
        })
        const friendRequestsArr = []
        friendRequests.map(items=>{
            for(let i in allUsers){
                if(items.requestId === allUsers[i].id){
                    console.log(allUsers[i].name)
                    console.log(items)
                    friendRequestsArr.push({id:items.id,name:allUsers[i].userName})
                }
            }
        })
        //send total response
        message = {
            message:"success",
            user:{name:decoded.userData,image:currentUser[0].profileImageUrl},
            userData:recomendFriendsArr,
            friendRequests:friendRequestsArr,
            friends
        }
        res.status(200).send(message)
    } 
    catch(err) {
        // err
        console.log(err.message)
        message = {
            message:err.message,
            user:{},
            userData:[],
            friendRequests:[],
            friends:[]
        }
        res.status(200).send(message) 
    }
})

module.exports = router;