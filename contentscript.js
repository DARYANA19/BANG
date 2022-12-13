let messages = [];
let spamIds = [];
function showSpam(event){
    let item = event.target.parentNode;
    let failParent = item.querySelectorAll(".im-mess--text")[0];
    if(failParent!==undefined)
        item = failParent;
    let id = item.getAttribute("data-msgid");
    item.setAttribute("isUnhidedSpam", true);
    let text = item.querySelectorAll(".BANG_spam")[0];
    item.innerHTML = text.innerHTML;
}
class SpamMessage{
    constructor(id,text) {
        this.id = id;
        this.text = text;
        this.spamProcent = 0;
    }
}
function unHideSpam(ids){
    let html = document.getElementsByClassName("im-mess");
    let id;
    for(let item of html) {
        id = item.getAttribute("data-msgid");
        let messageText = item.querySelectorAll(".im-mess--text");
        for (let text of messageText) {
            for (_id of ids) {
                if (_id === parseInt(id)) {
                    let spamId = "#BANG_spam" + _id;
                    let BANG_spamItem = text.querySelectorAll(spamId)[0];
                    if(BANG_spamItem !== undefined) {
                        text.innerHTML = BANG_spamItem.innerHTML;
                        text.removeEventListener('click', showSpam)
                    }
                }
            }
        }
    }
}
function hideSpam(ids){
    let html = document.getElementsByClassName("im-mess");
    let id;
    for(let item of html) {
        id = item.getAttribute("data-msgid");
        let messageText = item.querySelectorAll(".im-mess--text");
        for (let text of messageText) {
            if(text.hasAttribute("isunhidedspam"))
                continue;
            for (_id of ids){
                if (_id === parseInt(id)) {
                    let hideBlock = "<div id='BANG_spam" + _id + "' class='BANG_spam' style='display:none'>";
                    let textInner = text.innerHTML;
                    textInner = hideBlock + textInner + "</div>";
                    let hrefA = "<a>Показать спам</a>";
                    textInner = hrefA + textInner;
                    text.innerHTML = textInner;
                    text.addEventListener("click", showSpam, {
                        once: true
                    });
                }
            }
        }
    }

}

function parseSiteOnMessages(){
    document.get
    let html = document.getElementsByClassName("im-mess");
    document.head.innerHTML+="<script type='text/javascript' src='https://code.jquery.com/jquery-3.6.1.min.js'></script>";
    let number = 0;
    for(let item of html){
        let messageText = item.getElementsByClassName("im-mess--text");
        for(let text of messageText){
            let id = item.getAttribute("data-msgid");
            let textTmp = document.createElement('div');
            textTmp.innerHTML = text.innerHTML;
            if (textTmp.childElementCount !== 0) {
                textTmp = document.createElement('div');
                textTmp.innerHTML = text.innerHTML;
                while(textTmp.childElementCount !== 0) {
                    textTmp.removeChild(textTmp.children[0])
                }
            }

            let mes = new SpamMessage(parseInt(id), textTmp.textContent);
            messages.push(mes);
        }
    }

}

function markerSpamByPercentPool(){

    let allWords = [];
    for(let mes of messages){
        for(let word of mes.text.split(' ')){
            if(mes.text.length===0 || word === "")
                continue;
            allWords.push(word);
        }
    }
    let sortedAndInvolvedWords = [];
    for(let word of allWords){

        let added = false;
        for(let oneWord of sortedAndInvolvedWords){
            if(word === oneWord.word){
                oneWord.number+=1;
                added = true;
            }
        }
        if(added === false){
            sortedAndInvolvedWords.push({word: word, number: 1})
        }
    }
    for(let mes of sortedAndInvolvedWords){
        mes.number/=allWords.length;
    }
    let allEndPercents = [];
    let sumPercents = 0;
    for(let mes of messages){
        let percentOfSpam = 0;
        let words = [];
        for(let word of mes.text.split(' ')){
            if(mes.text.length===0 || word === "")
                continue;
            words.push(word);
        }
        for(let word of words){
            for(let wordSorted of sortedAndInvolvedWords) {
                if (word === wordSorted.word)
                    percentOfSpam+=wordSorted.number;
            }
        }
        let endPersent = percentOfSpam/words.length*1000
        if(!isNaN(endPersent)) {
            sumPercents += endPersent;
            allEndPercents.push({percent: endPersent, message: mes});
        }
        console.log("Message: " + mes.text.toString() + " spam:" + endPersent)
        /*if(sortedAndInvolvedWords.length < 30) {
            if (endPersent > 15)
                spamIds.push(mes.id)
        }
        else{
            if (endPersent > 15 - Math.log(allWords.length))
                spamIds.push(mes.id)
        }*/
    }
    let spamIdsAvarage = [];
    let avaragePercent = sumPercents/allEndPercents.length;
    for (let percent of allEndPercents){
        if(percent.percent > avaragePercent*1.25){
            spamIdsAvarage.push(percent.message.id);
        }
    }
    let avSqrtAcc = []
    let sumQuadro = 0;
    for (let percent of allEndPercents){
        if(percent.percent-avaragePercent > 0) {
            let quadro = 0;
            quadro = (percent.percent - avaragePercent) * (percent.percent * avaragePercent);
            avSqrtAcc.push(quadro)
            sumQuadro += quadro;
        }

    }
    let spawmIdsQUadro = [];
    let avarageQuadro = sumQuadro/avSqrtAcc.length;
    for (let mes of allEndPercents){
        if(mes.percent-avaragePercent > 0) {
            let quadro = (mes.percent - avaragePercent) * (mes.percent * avaragePercent);
            if (quadro > avarageQuadro*0.8) {
                spawmIdsQUadro.push(mes.message.id);
            }
        }
    }
    for (let _idA of spamIdsAvarage){
        for (let _idQ of spawmIdsQUadro){
            if(parseInt(_idA) === parseInt(_idQ))
                spamIds.push(_idA);
        }
    }


    hideSpam(spamIds);
}
setTimeout(BANG_spam, 1000);

function BANG_spam(){
    unHideSpam(spamIds);
    spamIds = [];
    messages = [];
    parseSiteOnMessages();
    markerSpamByPercentPool();

    setTimeout(BANG_spam, 2000);
}
/*
parseSiteOnMessages();
var xhr = new XMLHttpRequest();
var url = "https://artelove.ddnt.net:22111";
var params = 'orem=ipsum&name=binny';
xhr.open('POST', url, true);

xhr.setRequestHeader("Content-Type", "application/json");
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
        var json = JSON.parse(xhr.responseText);
        console.log(json.email + ", " + json.password);
    }
};
var data = JSON.stringify({"email": "hey@mail.com", "password": "101010"});
xhr.send(data);
*/

