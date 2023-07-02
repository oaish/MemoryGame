const sc = $(".sec");
const start = $(".btn");
const card = $(".content");
const cType = $(".c-type");
const tm = $(".timer > h2");
const catalog = $(".catalog");
const welcome = $(".welcome");
const backImg = $(".back img");
const theme = $(".theme-card");
const frontImg = $(".front img");
const catalogH2 = $(".catalog > h2");
const movesCounter = $(".moves span");
const pairsCounter = $(".pairs span");
const flipAudio = new Audio("sounds/card-flip.mp3");
const matchedAudio = new Audio("sounds/matched.mp3");
const images = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H", "I", "I"];
let flippedCards = [];
let matchedPairs = [];
let intervalID = 0;
let canFlip = false;
let imgFolder = "Animal/";
let moves = 0;
let pairs = 9;
let time = 60;
let bgc = "A";
let a = [];
function initializeWindow() {
    a = [];
    flippedCards = [];
    matchedPairs = [];
    time = 60;
    moves = 0;
    pairs = 9;
    movesCounter.text("0" + moves);
    pairsCounter.text("0" + pairs);
    for (let i = 0; i < 18; i++) {
        a.push(i);
        flippedCards.push(false);
    }
    $("img").attr("draggable", "false");
}

initializeWindow();
function hasFlipped() {
    let trueArr = [];
    for (let i = 0; i < flippedCards.length; i++) {
        if (flippedCards[i] && !matchedPairs.includes(i)) {
            trueArr.push(i);
        }
    }
    return trueArr;
}
function initCards() {
    a = a.sort(() => Math.random() - 0.5);
    for (let i = 0; i < images.length; i++) {
        frontImg.eq(i).attr("src", "images/" + imgFolder + images[a[i]] + ".jpg")
    }
}
function initTheme(str) {
    bgc = str;
    switch (bgc) {
        case "A":
            str = "goldenrod";
            break;
        case "B":
            str = "#0d59a6";
            break;
        case "C":
            str = "crimson";
            break;
        case "D":
            str = "#AA0000";
            break;
        default:
            str = "white";
            break;
    }
    $("*").css("--bg-color", str);
    for (let i = 0; i < backImg.length; i++) {
        backImg.eq(i).attr("src", "images/Rear" + bgc + ".jpg");
    }
}

for (let i = 0; i < theme.length; i++) {
    theme.eq(i).on('click',
        function () {
            initTheme(theme.eq(i).attr("id").slice(4, 5));
        }
    )
}

for (let i = 0; i < card.length; i++) {
    card.eq(i).click(function () {
        if (!canFlip) {
            return 0;
        }
        if (flippedCards[i] === false) {
            card.eq(i).toggleClass("content-flip");
            flippedCards[i] = true;
            flipAudio.play();
            movesCounter.text(++moves < 10? "0" + moves : moves);
        }

        let arr = hasFlipped();
        if (arr.length === 2) {
            if (frontImg.eq(arr[0]).attr("src") !== frontImg.eq(arr[1]).attr("src")) {
                setTimeout(function () {
                    card.eq(arr[0]).toggleClass("content-flip");
                    card.eq(arr[1]).toggleClass("content-flip");
                }, 1000);
                flippedCards[arr[0]] = false;
                flippedCards[arr[1]] = false;
            } else {
                matchedPairs.push(arr[0]);
                matchedPairs.push(arr[1]);
                pairsCounter.text("0" + --pairs);
                setTimeout(function () {
                    matchedAudio.play();
                }, 600);
            }
        }
        if (matchedPairs.length === 18) {
            gameOver();
        }
    })
}

for (let i = 0; i < catalog.length; i++) {
    catalog.eq(i).on('click',
        function () {
        console.log(catalogH2.eq(i).text());
            initCardsType(catalogH2.eq(i).text());
        }
    )
}
function initCardsType(str) {
    imgFolder = str + "/";
    console.log(imgFolder);
    cType.text(str);
}

start.on( 'click',
    function () {
        start.prop('disabled', true);
        initializeWindow();
        canFlip = true;
        welcome.addClass("welcome-fade");
        setTimeout(function () {
            welcome.addClass("hide");
        }, 1000);
        initCards();
        intervalID = setInterval(function () {
            let str = "00:" + (--time < 10? "0" + time : time);
            tm.text(str);
            if (time === 0) {
                gameOver();
            }
        }, 1000);
        setTimeout(function () {
            sc.addClass("sec-moving");
        }, 1000);
    }
)

function gameOver() {
    canFlip = false;
    clearInterval(intervalID);
    setTimeout(function () {
        card.removeClass("content-flip");
        sc.removeClass("sec-moving");
    }, 2000);
    setTimeout(function () {
        welcome.removeClass("hide");
        welcome.removeClass("welcome-fade");
        start.prop('disabled', false);
    }, 3000)

}