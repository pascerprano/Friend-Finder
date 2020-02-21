const Thread = require('./Thread')
const Message = require('./Message')

// Thread.create({
//     members:[1,2],
//     created_at:new Date().getTime().toString()
// }).then(res=>{
//     console.log(res)
// })
let sendUser;
async function create(){
    await Thread.findOne({
        members:[1,2]
    }).select('_id').populate('messages').then(res=>{
        sendUser = res['_id'];
        console.log(res)
    })
    console.log(sendUser)

    Message.create({
        thread: sendUser,
        send: '2',
        message: "i ll be comming home next week, lets catch up !!",
        date:  new Date().getTime(),
        created_by: '2',
        is_deleted: []
    }).then(res=>{
        console.log(res)
    })
    
    // await Thre.findOne({
    //     'send':sendUser
    // }).populate('user','name').then(res=>{
    //     console.log(res)
    // })
    // Thread.aggregate([
    //     {
    //         "$match":{
    //             members:["1","2"]
    //         }
    //     },
    //     {
    //         "$lookup":{ 
    //             from: 'messages',
    //             localField: '_id',
    //             foreignField: 'thread',
    //             as: 'threadMessages' 
    //         }
    //     }
    // ]).then(res=>{
    //     console.log(res)
    // })
}
create()
