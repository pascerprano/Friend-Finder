var client = require('../config/connection.js');

class populateElastic{
    async populate(myBody){
        console.log(myBody)
        myBody.map(items=>{
            client.index({  
                index: 'users',
                id: items.id,
                body: items
              },function(err,resp,status) {
                  console.log(resp);
              });
        })
        
    }
}

module.exports = ()=>{
    return new populateElastic()
}