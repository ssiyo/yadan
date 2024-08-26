// short dom function
function byid(id) {
    return document.getElementById(id);
}
function bycss(css) {
    return document.querySelector(css);
}

const alphabetCapsLock = "QWERTYUIOPASDFGHJKLZXCVBNM";
const keyShift = {
    "`": "~",
    1: "!",
    2: "@",
    3: "#",
    4: "$",
    5: "%",
    6: "^",
    7: "&",
    8: "*",
    9: "(",
    0: ")",
    "-": "_",
    "=": "+",
    "[": "{",
    "]": "}",
    ";": ":",
    "'": '"',
    ",": "<",
    ".": ">",
    "/": "?",
};
let keyShiftRe = {};
for (let k of Object.keys(keyShift)) {
    keyShiftRe[keyShift[k]] = k;
}

const keyboardKeys = [
    [
        "`",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "0",
        "-",
        "=",
        "Backspace",
    ],
    [
        "Tab",
        "q",
        "w",
        "e",
        "r",
        "t",
        "y",
        "u",
        "i",
        "o",
        "p",
        "[",
        "]",
        "Enter1",
    ],
    [
        "CapsLock",
        "a",
        "s",
        "d",
        "f",
        "g",
        "h",
        "j",
        "k",
        "l",
        ";",
        "'",
        "\\1",
        "Enter2",
    ],
    [
        "LShift",
        "\\2",
        "z",
        "x",
        "c",
        "v",
        "b",
        "n",
        "m",
        ",",
        ".",
        "/",
        "RShift",
    ],
    ["LCtrl", "LWin", "Alt", "Space-bar", "Alt Gr", "RWin", "Menu", "RCtrl"],
];
const pinky = "qazp[;'/";
const ring = "wsxol.";
const middle = "edcik,";
const lpointer = "rtfgvb";
const rpointer = "yuhjnm";

let isCapsLocked = true;
let keyboardDiv = byid("keyboard");
for (let keyline of keyboardKeys) {
    let line = document.createElement("div");
    line.classList.add("keys-line");
    for (let k of keyline) {
        let keySpan = document.createElement("span");
        keySpan.textContent = k;
        if (alphabetCapsLock.toLowerCase().includes(k)) {
            keySpan.setAttribute("id", k.toUpperCase());
        } else {
            keySpan.setAttribute("id", k);
        }
        if (k == "\\1" || k == "\\2") {
            keySpan.classList.add("pinky");
        } else if (pinky.includes(k)) {
            keySpan.classList.add("pinky");
        } else if (ring.includes(k)) {
            keySpan.classList.add("ring");
        } else if (middle.includes(k)) {
            keySpan.classList.add("middle");
        } else if (lpointer.includes(k)) {
            keySpan.classList.add("lpointer");
        } else if (rpointer.includes(k)) {
            keySpan.classList.add("rpointer");
        }
        line.appendChild(keySpan);
    }
    keyboardDiv.appendChild(line);
}
byid("Backspace").innerHTML = `<img src="svg/backspace.svg">`;
byid("Space-bar").innerHTML = `<img src="svg/space_bar.svg">`;
byid("Menu").innerHTML = `<img src="svg/menu.svg">`;
byid("Enter1").innerHTML = `<img src="svg/keyboard_return.svg">`;
byid("Enter2").innerHTML = `<img src="svg/keyboard_return.svg">`;
byid("Tab").innerHTML = `<img src="svg/keyboard_tab.svg">`;
byid("CapsLock").innerHTML = `<img src="svg/keyboard_capslock.svg">`;
byid("LWin").innerHTML = `<img src="svg/grid_view.svg">`;
byid("RWin").innerHTML = `<img src="svg/grid_view.svg">`;
byid("Alt Gr").textContent = "";
byid("Alt").textContent = "";
byid("LShift").textContent = "Shift";
byid("RShift").textContent = "Shift";
byid("LCtrl").textContent = "Ctrl";
byid("RCtrl").textContent = "Ctrl";
byid("\\1").textContent = "\\";
byid("\\2").textContent = "\\";

isCapsLocked = false;
capsLock();

const pressKeys = "`1234567890-=qwertyuiop[]asdfghjkl;'\\zxcvbnm,./";
const pressKeysShift = '~!@#$%^&*()_+{}:"|<>?';
let curLineIndex = 0;
let lineTimer,
    linesToWrite,
    lineInput = "";
let bestOverallScore = 0;
let accuracy = 0;
let speed = 0;
let accuracySum = 0;
let speedSum = 0;

let bgColorChangeTimer;

// events

document.addEventListener("keydown", (e) => {
    if (
        pressKeys.includes(e.key.toLowerCase()) ||
        pressKeysShift.includes(e.key.toLowerCase())
    ) {
        if (e.shiftKey && !alphabetCapsLock.includes(e.key)) {
            byid(keyShiftRe[e.key]).classList.add("pressed");
        } else {
            if (e.key == "\\") {
                byid("\\1").classList.add("pressed");
                byid("\\2").classList.add("pressed");
            } else {
                document
                    .getElementById(e.key.toUpperCase())
                    .classList.add("pressed");
            }
        }

        if (isCapsLocked) {
            lineInput += e.key;
        } else {
            lineInput += e.key.toLowerCase();
        }
        newKeyPressed();
    } else {
        switch (e.key) {
            case "CapsLock":
                byid("CapsLock").classList.add("pressed");
                break;
            case "Shift":
                byid("LShift").classList.add("pressed");
                byid("RShift").classList.add("pressed");
                isCapsLocked = true;
                shiftPressed();
                capsLock();
                break;
            case "Backspace":
                if (lineInput.length > 0) {
                    lineInput = lineInput.slice(0, lineInput.length - 1);
                    document
                        .getElementById("Backspace")
                        .classList.add("pressed");
                    newKeyPressed();
                }
                break;
            case "Enter":
                byid("Enter1").classList.add("pressed");
                byid("Enter2").classList.add("pressed");
                lineCompleted();
                break;
            case "Tab":
                e.preventDefault();
                byid("Tab").classList.add("pressed");
                lineInput += "    ";
                newKeyPressed();
                break;
            case " ":
                byid("Space-bar").classList.add("pressed");
                lineInput += " ";
                newKeyPressed();
                break;
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (
        pressKeys.includes(e.key.toLowerCase()) ||
        pressKeysShift.includes(e.key.toLowerCase())
    ) {
        if (e.shiftKey && !alphabetCapsLock.includes(e.key)) {
            document
                .getElementById(keyShiftRe[e.key])
                .classList.remove("pressed");
        } else {
            if (e.key == "\\") {
                byid("\\1").classList.remove("pressed");
                byid("\\2").classList.remove("pressed");
            } else {
                document
                    .getElementById(e.key.toUpperCase())
                    .classList.remove("pressed");
            }
        }
    } else {
        switch (e.key) {
            case "CapsLock":
                isCapsLocked = !isCapsLocked;
                capsLock();
                byid("CapsLock").classList.remove("pressed");
                break;

            case "Shift":
                shiftPressed(false);
                isCapsLocked = false;
                capsLock();
                byid("LShift").classList.remove("pressed");
                byid("RShift").classList.remove("pressed");
                break;
            case "Backspace":
                document
                    .getElementById("Backspace")
                    .classList.remove("pressed");
                break;
            case "Enter":
                byid("Enter1").classList.remove("pressed");
                byid("Enter2").classList.remove("pressed");
                break;
            case "Tab":
                byid("Tab").classList.remove("pressed");
                break;
            case " ":
                document
                    .getElementById("Space-bar")
                    .classList.remove("pressed");
                break;
        }
    }
});
const onSlowMode = sessionStorage.getItem("slowMode") == "true";
if (!onSlowMode) {
    byid("keyboard").style.display = "none";
    byid("lhand").style.display = "none";
    byid("rhand").style.display = "none";
}

// for generation of new lines
lineTimer = Date.now();
linesToWrite = [0, 0, 0].map((i) => generateSentence()).join("");
displayTargetLines();

function shiftPressed(shiftDown = true) {
    if (shiftDown) {
        for (let k of Object.keys(keyShift)) {
            byid(k).textContent = keyShift[k];
        }

        byid("\\1").textContent = "|";
        byid("\\2").textContent = "|";
    } else {
        for (let k of Object.keys(keyShift)) {
            byid(k).textContent = k;
        }

        byid("\\1").textContent = "\\";
        byid("\\2").textContent = "\\";
    }
}

function capsLock() {
    if (!isCapsLocked) {
        for (let k of alphabetCapsLock) {
            byid(k).textContent = k.toLowerCase();
        }
    } else {
        for (let k of alphabetCapsLock) {
            byid(k).textContent = k;
        }
    }
}
function bgEffect(newclass) {
    if (!onSlowMode) return;
    document.body.className = newclass;
    
    clearTimeout(bgColorChangeTimer);
    bgColorChangeTimer = setTimeout(() => {
        document.body.className = '';
    }, 200);
}
function newKeyPressed() {
    // console.log(linesToWrite, lineInput);
    // visual feedback
    // background color change

    if (lineInput.length) {
        const feedback =
            lineInput[lineInput.length-1] == linesToWrite[lineInput.length-1]
                ? "yah"
                : "nah";
        bgEffect(feedback);
    }

    // change character color
    for (let i in byid("to-type").children) {
        let spanChild = byid("to-type").children[i];
        if (i >= lineInput.length) {
            spanChild.className = "";
        } else if (spanChild.textContent == lineInput[i]) {
            spanChild.className = "correct";
        } else {
            spanChild.className = "incorrect";
        }
        byid("to-type").children[i] = spanChild;
    }
    byid("to-type").children[lineInput.length].className = "current";

    if (lineInput.length >= linesToWrite.split("\n")[0].length) {
        lineCompleted();
        return;
    }

    if (onSlowMode) {
        // changing finger assignments
        const nextChar = linesToWrite.split("\n")[0][lineInput.length];
        if (nextChar != " ") {
            const leftchars = "qwertasdfgzxcvb";
            const keysSide = {
                qaz: "a",
                wsx: "s",
                edc: "d",
                rtfgvb: "f",
                "p[;'\\/": "_",
                "ol.": "l",
                "ik,": "k",
                yuhjnm: "j",
            };

            const handSrcLast =
                keysSide[
                    Object.keys(keysSide).find((k) => k.includes(nextChar))
                ];
            const handSrcFirst = leftchars.includes(nextChar) ? "l" : "r";
            const notHandSrcFirst = handSrcFirst == "r" ? "l" : "r";
            byid(handSrcFirst + "hand").classList.remove("hidden");
            byid(handSrcFirst + "hand").src =
                "hand/" + handSrcFirst + "hand " + handSrcLast + ".png";
            byid(notHandSrcFirst + "hand").classList.add("hidden");
        } else {
            if (byid("lhand").classList.contains("hidden")) {
                byid("rhand").src = "hand/rhand.png";
            } else {
                byid("lhand").src = "hand/lhand.png";
            }
        }
    }
}

function lineCompleted() {
    curLineIndex++;
    calculatePerformance();
    linesToWrite += generateSentence();
    lineInput = "";

    linesToWrite = linesToWrite.slice(
        linesToWrite.split("\n")[0].length + 1,
        linesToWrite.length
    );
    displayTargetLines();
}
function displayTargetLines() {
    byid("to-type").innerHTML = "";
    let newHTML = "";
    for (let c of linesToWrite) {
        if (c == "\n") {
            newHTML += "<br>";
            continue;
        }
        newHTML += `<span>${cleanHTML(c)}</span>`;
    }
    byid("to-type").innerHTML = newHTML;
    // to show cursor
    newKeyPressed();
}
function cleanHTML(htmlcode) {
    let d = document.createElement("div");
    d.textContent = htmlcode;
    return d.innerHTML;
}

function generateSentence() {
    let gen = "";
    const basicKeys = "asdfjkl;";
    for (let i = 0; i < 30; i++) {
        if (Math.random() > 0.5) {
            gen +=
                alphabetCapsLock[
                    parseInt(Math.random() * alphabetCapsLock.length)
                ].toLowerCase();
        } else if (
            Math.random() < 0.4 &&
            !["", " "].includes(gen[gen.length - 1]) &&
            gen != "" &&
            i + 1 < 30
        ) {
            gen += " ";
        } else {
            gen += basicKeys[parseInt(Math.random() * basicKeys.length)];
        }
    }
    return gen + "\n";
}

function calculatePerformance() {
    const passedMinutes = (Date.now() - lineTimer) / 1000 / 60;
    lineTimer = Date.now();

    accuracySum +=
        document.querySelectorAll("span.correct").length /
        linesToWrite.split("\n")[0].length;
    accuracy = accuracySum / curLineIndex;
    speedSum += lineInput.length / passedMinutes;
    speed = speedSum / curLineIndex;

    byid("lines-count").textContent = curLineIndex;
    byid("speed").textContent = Math.floor(speed);
    byid("accuracy").textContent = Math.floor(accuracy * 100);
    /*
    quantity, speed, accuracy
    (q*s) % a
    */
    const overcallScore = curLineIndex * speed * accuracy;
    if (overcallScore > bestOverallScore) {
        bestOverallScore = overcallScore;
        // update high score
        byid("best-lines-count").textContent = curLineIndex;
        byid("best-speed").textContent = Math.floor(speed);
        byid("best-accuracy").textContent = Math.floor(accuracy * 100);
        bgEffect("hah");
    }

    // reset after line 60
    if (curLineIndex > 60) {
        curLineIndex = 0;
        accuracySum = 0;
        speedSum = 0;
        byid("lines-count").textContent = 0;
        byid("speed").textContent = 0;
        byid("accuracy").textContent = 0;
    }
}
