const sc = $(".sec"), start = $(".btn"), card = $(".content"), cType = $(".c-type"), tm = $(".timer > h2"),
    result = $(".result"), catalog = $(".catalog"), welcome = $(".welcome"), backImg = $(".back img"),
    theme = $(".theme-card"), frontImg = $(".front img"), resultTxt = $(".result-text"), catalogH2 = $(".catalog > h2"),
    movesCounter = $(".moves span"), pairsCounter = $(".pairs span"), flipAudio = new Audio("sounds/card-flip.mp3"),
    matchedAudio = new Audio("sounds/matched.mp3"), victoryAudio = new Audio("sounds/victory.mp3"),
    defeatAudio = new Audio("sounds/defeat.mp3"),
    LalAudio = new Audio("sounds/LalHai.mp3"),
    images = ["A", "A", "B", "B", "C", "C", "D", "D", "E", "E", "F", "F", "G", "G", "H", "H", "I", "I"];
let flippedCards = [], matchedPairs = [], intervalID = 0, canSelect = !0, canFlip = !1, imgFolder = "Animal/",
    moves = 0, pairs = 9, time = 60, bgc = "A", a = [];

function initializeWindow() {
    a = [], flippedCards = [], matchedPairs = [], time = 60, moves = 0, pairs = 9, movesCounter.text("0" + moves), pairsCounter.text("0" + pairs), result.addClass("hide");
    for (let e = 0; e < 18; e++) a.push(e), flippedCards.push(!1);
    $("img").attr("draggable", "false")
}

function hasFlipped() {
    let e = [];
    for (let t = 0; t < flippedCards.length; t++) flippedCards[t] && !matchedPairs.includes(t) && e.push(t);
    return e
}

function initCards() {
    a = a.sort((() => Math.random() - .5));
    for (let e = 0; e < images.length; e++) frontImg.eq(e).attr("src", "images/" + imgFolder + images[a[e]] + ".jpg")
}

function initTheme(e) {
    switch (bgc = e, bgc) {
        case"A":
            e = "goldenrod";
            break;
        case"B":
            e = "#0d59a6";
            break;
        case"C":
            e = "crimson";
            break;
        case"D":
            e = "#AA0000";
            LalAudio.play();
            break;
        default:
            e = "white"
    }
    $("*").css("--bg-color", e);
    for (let e = 0; e < backImg.length; e++) backImg.eq(e).attr("src", "images/Rear" + bgc + ".jpg")
}

initializeWindow();
for (let e = 0; e < theme.length; e++) theme.eq(e).on("click", (function () {
    initTheme(theme.eq(e).attr("id").slice(4, 5))
}));
for (let e = 0; e < card.length; e++) card.eq(e).click((function () {
    if (!canFlip) return 0;
    !1 === flippedCards[e] && (card.eq(e).toggleClass("content-flip"), flippedCards[e] = !0, flipAudio.play(), movesCounter.text(++moves < 10 ? "0" + moves : moves));
    let t = hasFlipped();
    2 === t.length && (frontImg.eq(t[0]).attr("src") !== frontImg.eq(t[1]).attr("src") ? (setTimeout((function () {
        card.eq(t[0]).toggleClass("content-flip"), card.eq(t[1]).toggleClass("content-flip")
    }), 1e3), flippedCards[t[0]] = !1, flippedCards[t[1]] = !1) : (matchedPairs.push(t[0]), matchedPairs.push(t[1]), pairsCounter.text("0" + --pairs), setTimeout((function () {
        matchedAudio.play()
    }), 600))), 18 === matchedPairs.length && (victoryAudio.play(), resultTxt.text("VICTORY!"), gameOver())
}));
for (let e = 0; e < catalog.length; e++) catalog.eq(e).on("click", (function () {
    canSelect && initCardsType(catalogH2.eq(e).text())
}));

function initCardsType(e) {
    imgFolder = e + "/", cType.text(e)
}

function gameOver() {
    canFlip = !1, canSelect = !0, clearInterval(intervalID), result.removeClass("hide"), result.addClass("res"), setTimeout((function () {
        card.removeClass("content-flip"), sc.removeClass("sec-moving")
    }), 2e3), setTimeout((function () {
        welcome.removeClass("hide"), welcome.removeClass("welcome-fade"), start.prop("disabled", !1), result.removeClass("res")
    }), 3e3)
}

start.on("click", (function () {
    start.prop("disabled", !0), initializeWindow(), canFlip = !0, canSelect = !1, welcome.addClass("welcome-fade"), setTimeout((function () {
        welcome.addClass("hide")
    }), 700), initCards(), setTimeout((function () {
        intervalID = setInterval((function () {
            let e = "00:" + (--time < 10 ? "0" + time : time);
            tm.text(e), 0 === time && (defeatAudio.play(), resultTxt.text("DEFEAT!"), gameOver())
        }), 1e3)
    }), 700), setTimeout((function () {
        sc.addClass("sec-moving")
    }), 1e3)
}));