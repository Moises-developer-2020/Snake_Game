// sharedState.js
const serverData = {
  connectedUsers:[],
  
  rooms:[{
    id:'LM4545121',
    nameRoom:'',
    amounSats:1,
    maxUsers:0,
    limitTime:1,
    private:false,
    users:[{
        name:'',
        socketInfo:'',
        }]
  }]
};
module.exports = serverData;