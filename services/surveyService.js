import storageService from './storageService.js';

const DATA_KEY = 'astresso';
const AUTH_KEY = 'astresso-auth';
const TIMER_KEY = 'astresso-timer'
const AUTH_WORD = 'aavviivviitt'


var gUsersAnss = [];
var gTimer = null;

var gCurrUser = null;
var gPromo = null;
var gTask = null;

function initExp () {
    getAuth();
    initTimer();
    var dataFromStorage = storageService.loadFromStorage(DATA_KEY);
    if (dataFromStorage) {
        gUsersAnss = dataFromStorage;
    }
    // console.log('gUsersAnss:', gUsersAnss);
}

function initTimer() {
    var timerFromStorage = storageService.loadFromStorage(TIMER_KEY);
    if (timerFromStorage) {
        gTimer = timerFromStorage;
        return;
    }
    else {
        setTimer();
    }
}

function setTimer() {
    var timer = +prompt('אנא קבע/י טיימר בדקות');
    storageService.saveToStorage(TIMER_KEY, timer);
    gTimer = timer;
    return;
}

function getAuth() {
    var authFromStorage = storageService.loadFromStorage(AUTH_KEY);
    if (authFromStorage === AUTH_WORD) {
        return;
    } else {
        var authWord;
        while (authWord !== AUTH_WORD) {
            authWord = prompt('אנא הכנס/י מילת זיהוי');
        }
        if (authWord === AUTH_WORD) {
            storageService.saveToStorage(AUTH_KEY, authWord);
            return;
        }
    }
}

function saveSubject() {
    var subject = {...gCurrUser, ...gPromo, ...gTask}
    gUsersAnss.push(subject);
    // console.log('gUsersAnss:', gUsersAnss);
    storageService.saveToStorage(DATA_KEY, gUsersAnss);
}

function setUser(userInfo) {
    var user = {
        expTime: new Date().toLocaleString('en-GB'),
        id: _getId(),
        name: userInfo.name,
        yob: userInfo.yob,
        gender: userInfo.gender,
        shouldStress: _shouldStress(),
    }
    gCurrUser = user;
    // console.log('currUser:', gCurrUser)
}

function isCurrUserStress() {
    return gCurrUser.shouldStress;
}

function isCurrUser() {
    return !!gCurrUser
}

function setPromo(promoRes) {
    var promo = {
        promoErrorCount: promoRes.errorCount,
        promoStartTime: new Date(promoRes.startTime).toLocaleString('en-GB'),
        promoEndTime: new Date(promoRes.endTime).toLocaleString('en-GB')
    }
    gPromo = promo;
    // console.log('promo:', gPromo);
}

function setTask(taskRes) {
    var task = {
        taskTimeToSolution: _millisToMinutesAndSeconds(taskRes.timeToSolution),
        taskSolved: taskRes.solved,
        taskSelfReport: taskRes.selfReport,
        taskComment: taskRes.comment
    }
    gTask = task;
    // console.log('task:', gTask)
}

function getTimer() {
    return 1000 * 60 * gTimer
}

function _millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function _getId() {
    return gUsersAnss.length + 1;
}

function _shouldStress() {
    // this code is predictable odd numbers stress and evan numbers non-stress:
    // if (gUsersAnss.length % 2 === 0) return true;
    // else return false;
    
    // this code is mathematical randomm 50:50 chance:
    return Math.random() < 0.5;
}

function clearLocalStorage() {
    storageService.clearStorage(DATA_KEY);
    storageService.clearStorage(AUTH_KEY);
    storageService.clearStorage(TIMER_KEY);
}

function exportToCsv(filename) {
    if (!storageService.loadFromStorage(DATA_KEY)) {
        alert('אין מידע שמור בזיכרון');
        return;
    };
    var rows = _createData(storageService.loadFromStorage(DATA_KEY));
    var BOM = String.fromCharCode(0xFEFF);

    var processRow = function (row) {
        var finalVal = '';
        for (var j = 0; j < row.length; j++) {
            var innerValue = row[j] === null ? '' : row[j].toString();
            if (row[j] instanceof Date) {
                innerValue = row[j].toLocaleString();
            };
            var result = innerValue.replace(/"/g, '""');
            if (result.search(/("|,|\n)/g) >= 0)
                result = '"' + result + '"';
            if (j > 0)
                finalVal += ',';
            finalVal += result;
        }
        return finalVal + '\n';
    };

    var csvFile = BOM + '';
    for (var i = 0; i < rows.length; i++) {
        csvFile += processRow(rows[i]);
    }

    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, filename);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}

function _createData(dataArr) {
    var obj = dataArr[0];
    var title = [];
    var data = [];

    for (let key in obj) {
        title.push(key)
    }
    data.push(title);
    // console.log('title', title);
    
    dataArr.forEach(arr => {
        var line = [];
        for (let key in arr) {
            line.push(arr[key])
        }
        data.push(line);
    })
    return data;
}

export default {
    initExp,
    getAuth,
    saveSubject,
    setUser,
    isCurrUser,
    isCurrUserStress,
    setPromo,
    setTask,
    getTimer,
    clearLocalStorage,
    exportToCsv,
    setTimer
}