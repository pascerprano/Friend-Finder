var elaseticClient = require('../config/connection');

elaseticClient.count({index: 'users'},function(err,resp,status) { 
    console.log("users",resp);
});