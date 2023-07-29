// start socketIO
const socket=io();

//check if exist
function checkStorageData(item) {
    return localStorage.getItem(item) !== null;
}

//get
function getStorageData(item) {
    return localStorage.getItem(item);
}
//delete 
function deleteStorageData(item){
    localStorage.removeItem(item);
}
//set
function setStorageData(name, miObjeto={}, key='json') {
    switch (key) {
        case 'json':
            let miObjetoJSON = JSON.stringify(miObjeto);
            localStorage.setItem(name, miObjetoJSON);
            break;
        default:
            localStorage.setItem(name, miObjeto);
            break;
    }
}

//check if exist and return
function checkAndReturn(name){
    if(!checkStorageData(name)) return false;
    return getStorageData(name);
} 

//check if exist and delete
function checkAndDelete(name){
    if(checkStorageData(name)) deleteStorageData(name)
}
//set class [{ e: element, c: class }]
function setClass(d = [{ e: null, c: '' }]) {
    let elements = d;
    for (let i = 0; i < elements.length; i++) {
        elements[i]['e'].classList.add(elements[i]['c']);
    }
}

//remove class
function removeClass(d = [{ e: null, c: '' }]) {
    let elements = d;
    for (let i = 0; i < elements.length; i++) {
        elements[i]['e'].classList.remove(elements[i]['c']);
    }
}

//get element
function $(selector, all='') {
    if(all == 'all') return document.querySelectorAll(selector);
    return document.querySelector(selector);
}

// navigate betweend pages
function sentTo(url){
    let pages = $('.pages','all')

    pages.forEach(element => {
        // remove 
        if(element.classList.contains('closePage') && element.classList.contains(url)){
            removeClass([{e:element,c:'closePage'}]);
        }else{
            setClass([{e:element,c:'closePage'}]);
        }
    });

    // update url
    const user = JSON.parse(checkAndReturn('user'))
    user.url = url;
    setStorageData('user',user)

}
function checkSession(){
    const user =JSON.parse(checkAndReturn('user'))
    if(user !== false){
        //console.log(atob(user.session));
        socket.emit('validate-session',user,(resp)=>{
            // status of session
            if(!resp.status){
                // delete session expire
                deleteStorageData('user')
                return
            }
            sentTo(user.url)
        });
    }else{
    }
}
// ckeck answers from each fecth
function checkAnswers(value){
    if(!value){
        // that means the session it is not valid
        location.reload();
    }
}

function paintSelected(element, className){
    element.forEach((e)=>{
        removeClass([{e:e,c:className}])
    });
    setClass([{e:element,c:className}])
}



$('#checkbox').onclick=()=>{
    socket.emit('test','0')
}