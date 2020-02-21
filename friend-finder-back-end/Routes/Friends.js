const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");

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


//global variable
const privateKey = "friendfinder";
const Thread = require('../models/MongoDB/Thread')
const Message = require('../models/MongoDB/Message')

router.post('/',async function(req,res){
    var decoded = ""
    const details = req.body;
    console.log(details)
    try {
        decoded = await jwt.verify(details.requestFrom.toString(), privateKey);
        const currentUserDetails = await models.users.findAll({
            attributes: ['id'],
            where: {
                name: {
                    [Op.eq]: decoded.userData.toString()
                }
            },
            include:{
                model:models.friendRequests,
            },
            raw:true
        })
        // console.log(currentUserDetails[0].id)
        const friendRequest = await models.friendRequests.create({ requestId:currentUserDetails[0].id, requestToId:parseInt(details.requestTo), status:"waiting" });
        // console.log(friendRequest)
        res.status(200).send("user created");
    }
    catch(err){
        console.log(err)
    }  
})

router.post('/accept',async function(req,res){
    console.log(req.body)
    models.friendRequests.update({
        status: 'accepted',
        }, {
        where: {
            [Op.and]:{
                id:{
                    [Op.eq]:req.body.id
                },
                status:{
                    [Op.eq]:'waiting'
                }
            }
        }
    });
})

router.post('/chat-heads',async function(req,res){
    var decoded = ""
    const details = req.body;
    // console.log("chat head",details)
    try {
        decoded = await jwt.verify(details[0].toString(), privateKey);
        const currentUserDetails = await models.users.findAll({
            attributes: ['id'],
            where: {
                name: {
                    [Op.eq]: decoded.userData.toString()
                }
            },
            raw:true
        })
        const allUserDetails = await models.users.findAll({
            attributes: ['id','name','userName','profileImageUrl'],
            where: {
                name: {
                    [Op.ne]: decoded.userData.toString()
                }
            },
            raw:true
        })
        // console.log(currentUserDetails[0].id)
        let threads;
        Thread.aggregate([
            {
                "$match":{
                    members:{"$all":[currentUserDetails[0].id.toString()]}
                }
            },
            {
                "$lookup":{ 
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'thread', 
                    as: 'threadMessages' 
                }
            }
        ]).then(resp=>{
            console.log(resp[0].threadMessages)
            threads = resp;

            let threadAss = {}
            let ThreadArr = [] 
            threads.map(items=>{
                console.log("in frineds",items)
                for(let i in allUserDetails){
                    if(parseInt(items.members[0]) === allUserDetails[i].id){
                        threadAss = { 
                            id:items['_id'],
                            threadDetails: allUserDetails[i],
                            created_at: items['created_at'],
                            messages: items['threadMessages']
                        }
                        // console.log("frist",threadAss)
                        ThreadArr.push(threadAss)
                    }
                    if(parseInt(items.members[1]) === allUserDetails[i].id){
                        threadAss = {
                            id:items['_id'],
                            threadDetails: allUserDetails[i],
                            created_at: items['created_at'],
                            messages: items['threadMessages']
                        }
                        // console.log("sexond",threadAss)
                        ThreadArr.push(threadAss)
                    }
                }
            })
            res.status(200).send(ThreadArr);
        })       
    }
    catch(err){
        console.log(err)  
    }
})

router.post('/send-message',async function(req,res){
    var decoded = ""
    let sendUser;
    const {key,member,message} = req.body
    console.log("chat head\n\n\n")
    try {
        decoded = await jwt.verify(key.toString(), privateKey);
        const currentUserDetails = await models.users.findAll({
            attributes: ['id'],
            where: {
                name: {
                    [Op.eq]: decoded.userData.toString()
                }
            },
            raw:true
        })
        // console.log([currentUserDetails[0].id.toString(),member.toString()]);
        await Thread.aggregate([
            {
                "$match":{
                    members:{"$all":[currentUserDetails[0].id.toString(),member.toString()]}
                }
            },
            {
                "$lookup":{ 
                    from: 'messages',
                    localField: '_id',
                    foreignField: 'thread', 
                    as: 'threadMessages' 
                }
            }
        ]).then(res=>{
            // console.log(res)
            sendUser = res[0]['_id'];
        })
        // console.log(new Date() === new Date().getTime())
    
        Message.create({
            thread: sendUser,
            send: currentUserDetails[0].id.toString(),
            message,
            date:  new Date().getTime(),
            created_by: currentUserDetails[0].id.toString(),
            is_deleted: []
        }).then(res=>{
            // console.log(res)
        }) 
        res.status(200).send("message sent")
    }
    catch(err){
        console.log(err)  
    }
})

module.exports = router