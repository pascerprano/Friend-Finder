var client = require('../config/connection.js');

client.delete({ index: 'users' },function(err,resp,status) {
    if(err){
        console.log(err)
    }
    console.log(resp);
});