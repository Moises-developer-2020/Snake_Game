// sharedState.js
const serverData = {
  connectedUsers:[],
  
  rooms:[{
    id:'',
    key:'',
    nameRoom:'',
    amounSats:'',
    maxUsers:'',
    limitTime:'',
    private:'',
    createdBy:'',
    usersIn:[]
  }]
};
module.exports = serverData;