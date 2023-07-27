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
function setStorageData(key, name, miObjeto={}) {
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