jQueryDownload(); // Запускаем загрузку jQuery

// Функция для загрузки jQuery:

async function jQueryDownload() {

    // Загружаем библиотеку jQuery как текст с оф. сайта и записываем в переменную code:
    var code = await (await fetch('https://code.jquery.com/jquery-3.6.0.min.js')).text();

    // Выполняем код:
    window.eval(code);

}
/*let html = document.getElementsByTagName("head")[0];
html.innerHTML += '<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">';*/
let messages = [];
let network_answers = [];
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
            if (textTmp.textContent.length >2) {
                let mes = new SpamMessage(parseInt(id), textTmp.textContent);
                messages.push(mes);
            }
        }
    }
    var xhr = new XMLHttpRequest();
    var url = "https://artelove.ddnt.net:22111";
    var params = 'orem=ipsum&name=binny';
    xhr.open('POST', url, true);

    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            network_answers = JSON.parse(xhr.responseText);
        }
    };
    var data = JSON.stringify({messages});
    xhr.send(data);
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
        let endPersent = percentOfSpam/words.length*1000;
        if(network_answers[mes]===1)
            endPersent+=100;
        //console.log("Message: " + mes.text.toString() + " spam:" + endPersent)
        if(endPersent > 15)
            spamIds.push(mes.id)
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
