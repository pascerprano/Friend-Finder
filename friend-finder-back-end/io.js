//initialisations
var io = require('socket.io')(); 
const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
const models = require('./models')

//global variables
// let users = {}; 
const privateKey = "friendfinder";
const Thread = require('./models/MongoDB/Thread')
const Message = require('./models/MongoDB/Message')

//main sockets
io.on('connection', function(socket) {
  // socket.on('join', function (data) {
  //   console.log(data)
  //   socket.join(data.name); 
  // });    
  // io.sockets.in('anush').emit('new_msg', {msg: 'hello'});


  socket.on('join_to_chat',async function(data) {
    console.log(data)
    let userId;
      try {
      decoded = await jwt.verify(data.key.toString(), privateKey);
      const currentUserDetails = await models.users.findAll({
          attributes: ['id'],
          where: {
              name: {
                  [Op.eq]: decoded.userData.toString()
              }
          },
          raw:true
      })
      await Thread.aggregate([
          {
              "$match":{
                  members:{"$all":[currentUserDetails[0].id.toString(),data.id.toString()]}
              }
          }
        ]).then(res=>{
            userId = res[0]['_id'];
        })
           
    } 
    catch(err){  
        console.log(err)  
    }

    console.log(userId)
    socket.join(userId);

    if(data.isChat){
        //send message
        try {
            decoded = await jwt.verify(data.key.toString(), privateKey);
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
                        members:{"$all":[currentUserDetails[0].id.toString(),data.id.toString()]}
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
                message:data.message,
                date:  new Date().getTime(),
                created_by: currentUserDetails[0].id.toString(),
                is_deleted: []
            }).then(res=>{
                // console.log(res)
            }) 
        }
        catch(err){
            console.log(err)  
        }
        // send data
        try {
            decoded = await jwt.verify(data.key.toString(), privateKey);
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
            io.sockets.in(userId).emit('new_msg', ThreadArr);
            })       
        }
        catch(err){
            console.log(err)  
        }
    }
    else{
        console.log("just added into room")
    }
  })

//   socket.on('chat_with',async function(data){
//     console.log(data)
//     socket.join(data.thread);
//     if(data.flag)
//   })

  // io.sockets.in(userId).emit('new_msg', {msg: 'hello'});
});

 
 
 
io.listen(5000);   
  