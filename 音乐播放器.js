const music = document.getElementById("audio"),toggleBtn = document.getElementById("toggleBtn");
const getFile = document.getElementById("files"),centreIco=document.querySelector('.centreIco'),lastbtn = document.getElementById("last");
const nextbtn = document.getElementById("next"),allMusic = document.querySelector(".allMusic"),returnbtn = document.querySelector('.returnRecent')
,playMethod = document.querySelector('.playMethod');
const buzhichiMSG = document.querySelector('.buzhichiMSG'), searchText = document.querySelector('.searchText');
const searchSuggest = document.querySelector('.searchSuggest'),autoClose = document.querySelector('.autoClose1');
const surplusMinute = document.querySelector('.surplusMinute'),surplusSecond = document.querySelector('.surplusSecond');
var List = [], url, li_s, i = 0, randomflag = 0, clickflag = 0, NOzhichitime;

getFile.onchange = function (e) {
    if(e.currentTarget.files.length==0)//若用户在上传过程中取消 或 用户上传的文件为空，就不做处理
        return;
    while (allMusic.firstElementChild.nextElementSibling.nextElementSibling) {//新上传的文件就需要把之前上传的文件覆盖
        allMusic.removeChild(allMusic.firstElementChild.nextElementSibling.nextElementSibling);
    }
    List = e.currentTarget.files;
    for (let ii = 0; ii < List.length; ii++) {
        let li = document.createElement('li');
        li.innerHTML = List[ii].name;
        li.setAttribute('index', ii);
        allMusic.appendChild(li);
        li.onclick = function (e) {
            clickflag = 1;//clearCss(li_s);// e.target.style.background = " rgb(35, 140, 225)";
            i = e.target.getAttribute('index') - 1;
            nextbtn.click();
        }
    }
    li_s = document.querySelectorAll('li');
    let firstRandom = getRandom(0, List.length)
    url = URL.createObjectURL(List[firstRandom]);
    music.src = url;
    title.innerHTML = "🎵 " + List[firstRandom].name.replace(/\.(mp3|ape)/, '');
    i = firstRandom;
    nextbtn.click();
    returnbtn.onclick();
    centreIco.style.animationPlayState = "running";//开启动画
    toggleBtn.innerHTML = "|&nbsp|";
    music.volume = .5;//设置初始音量适中
}

var timer = null;
function defendTremble() {
    timer = setTimeout(function () {
        for (let k = 0; k < List.length; k++) {
            if (List[k].name.slice(0,-4).search(new RegExp(searchText.value.trim(), 'i'))!=-1) {
                let li = document.createElement('li');
                li.setAttribute('index', k);
                li.innerHTML = List[k].name.replace(/\.(mp3|ape)/, "");
                searchSuggest.appendChild(li);
                li.onclick = function (e) {
                    clickflag = 1;
                    i = e.target.getAttribute('index') - 1;
                    nextbtn.click();
                    searchSuggest.style.display = 'none';
                    searchText.value = '';
                }
            }
        }
        if (searchSuggest.children.length == 0) searchSuggest.innerHTML = '未查询到相关内容';
    }, 400);
}
searchText.onblur=async function(){
    await new Promise(resolve => setTimeout(resolve,100));
    searchSuggest.style.display='none';
}
searchText.onfocus=function(){
    if(searchText.value!="")
        searchSuggest.style.display="block";
}
searchText.onkeyup = function () {
    let childs = searchSuggest.childNodes;
    for (var k1 = childs.length - 1; k1 >= 0; k1--) {//清除之前的查询记录
        searchSuggest.removeChild(childs[k1]);
    }
    clearTimeout(timer);
    if (searchText.value.length > 0){
        defendTremble();
        searchSuggest.style.display = 'block';
    }
    else{
        searchSuggest.style.display = 'none';
    }
}
allMusic.addEventListener('scroll', function () {
    if (allMusic.scrollTop < 460) {
        allMusic.firstElementChild.style.display = 'none';
        allMusic.firstElementChild.nextElementSibling.style.display = 'block';
    }
    else if (allMusic.scrollTop > 460 && allMusic.scrollTop < (allMusic.scrollHeight - 1000)) {
        allMusic.firstElementChild.style.display = 'block';
        allMusic.firstElementChild.nextElementSibling.style.display = 'block';
    } else if (allMusic.scrollTop > (allMusic.scrollHeight - 1000)) {
        allMusic.firstElementChild.style.display = 'block';
        allMusic.firstElementChild.nextElementSibling.style.display = 'none';
    }
});
allMusic.firstElementChild.onclick = function () {
    allMusic.scrollTop = 0;
}
allMusic.lastElementChild.onclick = function () {
    allMusic.scrollTop = allMusic.scrollHeight;
}
returnbtn.onclick = function () {
    allMusic.scrollTop = i * li_s[0].offsetHeight;
}
var countDown;
autoClose.onchange = function () {
    switch (autoClose.selectedIndex) {
        case 0: clearInterval(countDown);
            surplusMinute.innerText='';
            surplusSecond.innerText=''; 
            break;
        case 1:autoCloseDispose(5);
            break;
        case 2: autoCloseDispose(10);
            break;
        case 3: autoCloseDispose(20);
            break;
        case 4:autoCloseDispose(30);
            break;
        case 5: autoCloseDispose(60);
            break;
    }
}
function autoCloseDispose(m){
    clearInterval(countDown); 
    let minute = m, second = 0;
    surplusMinute.innerText=minute;
    surplusSecond.innerText='0'+second;
    countDown = setInterval(() => {
        second -= 1;
        if(second<0&&minute>0){
            minute--;
            second=59;
            surplusMinute.innerText=minute;
            surplusSecond.innerText =second;
        }else if(second>0&&minute>=0||second==0&&minute>0){
            surplusSecond.innerText = second<10?"0"+second:second;
            if(minute==0&&second<6)
                music.volume -= .1;
        }else if(minute==0&&second==0) {
            if(toggleBtn.innerHTML == "|&nbsp;|"){//若情况是''已暂停''就不再暂停
            toggleBtn.click();}
            music.volume = .5;
            surplusMinute.innerText='';
            surplusSecond.innerText='';
            clearInterval(countDown)
        }
    }, 1000);
}
playMethod.onchange = function () {
    music.removeAttribute('loop');
    if (playMethod.selectedIndex == 0) {
        randomflag = playMethod.selectedIndex; playMethod.style.color = 'blueviolet';
        playMethod.style.borderColor = 'blueviolet';

    } else if (playMethod.selectedIndex == 1) {
        randomflag = 1;
        playMethod.style.color = '#25D366';
        playMethod.style.borderColor = '#25D366';
    } else {
        playMethod.style.color = 'pink';
        playMethod.style.borderColor = 'pink';
        music.loop = 'loop';
    }
}
window.addEventListener('unhandledrejection', function () {
    buzhichiMSG.style.opacity = '1';
    NOzhichitime = setTimeout(function () {
        buzhichiMSG.style.opacity = '0';
        nextbtn.click();
    }, 2000);       //这里要好好学,这里再加一个回显提示消息就好
});
function toggleMusic() {
    let src=music.getAttribute('src');
    if(src==""){
        alert("没有可播放的音乐，请先上传音频文件");
        return;
    }
    if (music.paused) {
        toggleBtn.innerHTML = "|&nbsp;|";
        centreIco.style.animationPlayState = "running";//开启动画
        music.play();
    }
    else {
        toggleBtn.innerHTML = "已暂停";
        centreIco.style.animationPlayState = "paused";//暂停动画
        music.pause();
    }
}
function nextMusic() {
    clearTimeout(NOzhichitime);
    buzhichiMSG.style.opacity = '0';
    if (randomflag == 1) {
        if (i == List.length - 1)
            i = 0;
        else
            i++;
    }
    else if (clickflag != 1) {
        i = getRandom(0, List.length - 1);
    }
    if (clickflag == 1 && randomflag == 0) { i++; }
    clearCss(li_s);
    li_s[i].style.background = "hotpink";
    url = URL.createObjectURL(List[i]);
    music.src = url;
    music.play();
    title.innerHTML = "🎵 " + List[i].name.replace(/\.(mp3|ape)/, "");
    toggleBtn.innerHTML = "|&nbsp;|";
    centreIco.style.animationPlayState = "running";
    clickflag = 0;
}
function lastMusic() {
    if (i == 0)
        i = List.length - 1;
    else
        i--;
    clearCss(li_s);
    li_s[i].style.background = "hotpink;";
    url = URL.createObjectURL(List[i]);
    music.src = url;
    music.play();
    title.innerHTML = "🎵 " + List[i].name.replace(/\.(mp3|ape)/, "");
    toggleBtn.innerHTML = "|&nbsp;|";
    centreIco.style.animationPlayState = "running";
}
function clearCss(obj) {
    for (let i = 0; i < List.length; i++) {
        obj[i].style.backgroundColor = "";
    }
}
//以下是文档注释的用法可供往后参考
/**
 * 输出指定的区间内的随机数
 * @param {number} min 
 * @param {number} max 最大值
 * @returns 
 */
function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
music.onended = () => {
    if (playMethod.selectedIndex != 2) {//如果不是单曲循环，就可以进行下一首歌
        nextbtn.click();
    }
}
const s=document.querySelector.bind(document);
// (function(){console.log(document.querySelector.bind(document)('.gotoTop'))})();
document.querySelector.bind(document)('.gotoBottom').style.color='red';