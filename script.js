//select element 
let count = document.querySelector(".count span")
let bullets = document.querySelector(".bullets .spans");
let containerBullet = document.querySelector(".bullets");
let quizArea=document.querySelector(".quiz-area");
let answersArea=document.querySelector(".answers-area");
let submit=document.querySelector(".submit-button");
let result=document.querySelector(".results");
let countdown=document.querySelector(".countdown");
let current=0;
let rightAnswers=0;
let countdownInterval;
function getQuestions() {
    let myRequest=new XMLHttpRequest();
    myRequest.onreadystatechange=function () {
        if (this.readyState===4 && this.status===200) {
            let questionsObject=JSON.parse(this.responseText)
            addBullets(questionsObject.length)
            addQuestions(questionsObject[current],questionsObject.length);
            time(60,questionsObject.length);
            submit.onclick=()=>{
                // time(3,questionsObject.length);
                let theRightAnswer = questionsObject[current].right_answer;
                current++;
                check(theRightAnswer,questionsObject.length)
                
                quizArea.innerHTML="";
                answersArea.innerHTML="";
                addQuestions(questionsObject[current],questionsObject.length);
                handleBullets();
                clearInterval(countdownInterval);
                time(3,questionsObject.length);
                showResult(questionsObject.length);
            }
        }
    }
    myRequest.open("GET","questions.json",true);
    myRequest.send();
}
getQuestions()
function addBullets(num) {
    count.innerHTML=num
    for (let i = 0; i < num; i++) {
        let bullet=document.createElement("span");
        bullets.appendChild(bullet);
        if (i===0) {
            bullet.className="on";
        }
    }
}
function addQuestions (obj,count){
 if(current<count){
    let h2= document.createElement("h2");
    h2.appendChild(document.createTextNode(obj.title))
    quizArea.appendChild(h2)

    for (let i = 1; i <= 4; i++) {
        let main=document.createElement("div")
        main.className="answer";
        let radio =document.createElement('input');
        radio.name="answer";
        radio.type="radio";
        radio.id=`answer_${i}`;
        radio.dataset.answer=obj[`answer_${i}`];
        if (i===1) {
            radio.checked=true;
        }
        let label=document.createElement("label");
        label.appendChild(document.createTextNode(obj[`answer_${i}`]));
        label.htmlFor=`answer_${i}`;
        main.appendChild(radio);
        main.appendChild(label);
        answersArea.appendChild(main)
 
    }}
}
function check(rAnswer,qCount) {
    let answers=document.getElementsByName("answer");
    let choosen
    for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {   
        choosen=answers[i].dataset.answer;
    }   
    }
    if (choosen===rAnswer) {
        rightAnswers++;
    }
}
function handleBullets() {
    let bullets= document.querySelectorAll(".bullets .spans span");
    arrOfBullets =Array.from(bullets);
    arrOfBullets.forEach((span,i)=>{
        if (i ===current) {
            span.className='on'
        }
    })
}
function showResult(count) {
    let resultOfTest;
    if (count===current) {
        quizArea.remove();
        answersArea.remove();
        submit.remove();
        containerBullet.remove()
        if(rightAnswers>(count/2)&&rightAnswers<count){
            resultOfTest=`<span class="good">good</span>, ${rightAnswers} from ${count}`
        }else if(rightAnswers===count){
            resultOfTest=`<span class="perfect">perfect</span>, ${rightAnswers} from ${count}`
        }else{
            resultOfTest=`<span class="bad">bad</span>, ${rightAnswers} from ${count}`
        }
        result.innerHTML=resultOfTest;
        result.style.padding='10px'
        result.style.backgroundColor='white';
        result.style.marginTop='10px';
    }
}
function time(duration,count) {
    if(current<count){
        let minutes,seconds
        countdownInterval=setInterval(() => {
            minutes=parseInt(duration/60);
            seconds=parseInt(duration%60);
            minutes=minutes<10?`0${minutes}`:minutes;
            seconds=seconds<10?`0${seconds}`:seconds;
            countdown.innerHTML=`${minutes}:${seconds}`
        if (--duration<0) {
            clearInterval(countdownInterval);
            submit.click();
        }
        }, 1000);
    }
}