var client = require('../config/connection.js');

client.indices.create({  
  index: 'users'
},function(err,resp,status) {
  if(err) {
    console.log(err);
  }
  else {
    console.log("create",resp);
  }
});