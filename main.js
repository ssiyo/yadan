// short dom function
function byid(id) {
    return document.getElementById(id);
}
function bycss(css) {
    return document.querySelector(css);
}
function cssall(css) {
    return document.querySelectorAll(css);
}

// Configuration Constants
const CONFIG = {
    KEYBOARD: {
        ALPHABET: "QWERTYUIOPASDFGHJKLZXCVBNM",
        SHIFT_MAPPINGS: {
            "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%",
            "6": "^", "7": "&", "8": "*", "9": "(", "0": ")", "-": "_",
            "=": "+", "[": "{", "]": "}", ";": ":", "'": '"', ",": "<",
            ".": ">", "/": "?"
        },
        LAYOUT: [
            ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
            ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "Enter1"],
            ["CapsLock", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "\\1", "Enter2"],
            ["LShift", "\\2", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "RShift"],
            ["LCtrl", "LWin", "Alt", "Space-bar", "Alt Gr", "RWin", "Menu", "RCtrl"]
        ]
    }
};

// Reverse mapping for shift keys
const shiftKeyReverseMapping = {};
for (let key in CONFIG.KEYBOARD.SHIFT_MAPPINGS) {
    shiftKeyReverseMapping[CONFIG.KEYBOARD.SHIFT_MAPPINGS[key]] = key;
}

// Keyboard layout
const keyboardLayout = CONFIG.KEYBOARD.LAYOUT;

// Initialize visualsIncluded based on session storage
const visualsIncluded = sessionStorage.getItem("include-vfx") === "true";
if (visualsIncluded){
    byid("keyboard").classList.remove("hidden")
}

// Initialize keyboard
let isCapsLocked = true;
const keyboardContainer = byid("keyboard");
keyboardLayout.forEach(keyRow => {
    const rowElement = document.createElement("div");
    rowElement.classList.add("keys-line");
    keyRow.forEach(key => createKeyElement(key, rowElement));
    keyboardContainer.appendChild(rowElement);
});
updateKeyVisuals()

// Function to create a key element
function createKeyElement(key, rowElement) {
    const keyElement = document.createElement("span");
    keyElement.textContent = key;
    keyElement.setAttribute("id", CONFIG.KEYBOARD.ALPHABET.toLowerCase().includes(key) ? key.toUpperCase() : key);
    assignFingerClass(keyElement, key);
    rowElement.appendChild(keyElement);
}

// Function to assign finger class to keys
function assignFingerClass(keyElement, key) {
    const fingerMappings = {
        pinky: "qazp[;'/",
        ring: "wsxol.",
        middle: "edcik,",
        lpointer: "rtfgvb",
        rpointer: "yuhjnm"
    };
    if (key === "\\1" || key === "\\2" || fingerMappings.pinky.includes(key)) {
        keyElement.classList.add("pinky");
    } else if (fingerMappings.ring.includes(key)) {
        keyElement.classList.add("ring");
    } else if (fingerMappings.middle.includes(key)) {
        keyElement.classList.add("middle");
    } else if (fingerMappings.lpointer.includes(key)) {
        keyElement.classList.add("lpointer");
    } else if (fingerMappings.rpointer.includes(key)) {
        keyElement.classList.add("rpointer");
    }
}

// Function to update key visuals
function updateKeyVisuals() {
    byid("Backspace").innerHTML = `<img src="svg/backspace.svg">`;
    byid("Space-bar").innerHTML = `<img src="svg/space_bar.svg">`;
    byid("Menu").innerHTML = `<img src="svg/menu.svg">`;
    byid("Enter1").innerHTML = `<img src="svg/keyboard_return.svg">`;
    byid("Enter2").innerHTML = `<img src="svg/keyboard_return.svg">`;
    byid("Tab").innerHTML = `<img src="svg/keyboard_tab.svg">`;
    byid("CapsLock").innerHTML = `<img src="svg/keyboard_capslock.svg">`;
    byid("LWin").innerHTML = `<img src="svg/grid_view.svg">`;
    byid("RWin").innerHTML = `<img src="svg/grid_view.svg">`;
    ["Alt Gr", "Alt"].forEach(key => byid(key).textContent = "");
    ["LShift", "RShift"].forEach(key => byid(key).textContent = "Shift");
    ["LCtrl", "RCtrl"].forEach(key => byid(key).textContent = "Ctrl");
    ["\\1", "\\2"].forEach(key => byid(key).textContent = "\\");
}

// Initialize caps lock state
isCapsLocked = false;
capsLock();

// Function to toggle caps lock
function capsLock() {
    CONFIG.KEYBOARD.ALPHABET.split('').forEach(letter => {
        const element = byid(letter);
        element.textContent = isCapsLocked ? letter : letter.toLowerCase();
    });
}

// Event listeners for keydown and keyup
const validKeys = "`1234567890-=qwertyuiop[]asdfghjkl;'\\zxcvbnm,./";
const validShiftKeys = '~!@#$%^&*()_+{}:"|<>?';

// Initialize performance tracking
let currentLineIndex = 0;
let lineTimer, linesToType, lineInput = "";
let bestOverallScore = (sessionStorage.getItem("best-lines-count") || 0) *
                       (sessionStorage.getItem("best-speed") || 0) *
                       (sessionStorage.getItem("best-accuracy") || 0);
let accuracy = 0, speed = 0, accuracySum = 0, speedSum = 0;

// Initialize visual effects
let bgColorChangeTimer;
let confirmedReturn = 0;

// Update best scores display
byid("best-lines-count").textContent = sessionStorage.getItem("best-lines-count") || 0;
byid("best-speed").textContent = Math.floor(sessionStorage.getItem("best-speed") || 0);
byid("best-accuracy").textContent = Math.floor((sessionStorage.getItem("best-accuracy") || 0) * 100);

// Function to handle keydown events
document.addEventListener("keydown", (e) => {
    if (validKeys.includes(e.key.toLowerCase()) || validShiftKeys.includes(e.key.toLowerCase())) {
        handleKeyPress(e);
    } else {
        handleSpecialKeyPress(e);
    }
});

// Function to handle keyup events
document.addEventListener("keyup", (e) => {
    if (validKeys.includes(e.key.toLowerCase()) || validShiftKeys.includes(e.key.toLowerCase())) {
        handleKeyRelease(e);
    } else {
        handleSpecialKeyRelease(e);
    }
});

// Function to handle key press
function handleKeyPress(e) {
    if (e.shiftKey && !CONFIG.KEYBOARD.ALPHABET.includes(e.key)) {
        byid(shiftKeyReverseMapping[e.key]).classList.add("pressed");
    } else {
        if (e.key == "\\") {
            byid("\\1").classList.add("pressed");
            byid("\\2").classList.add("pressed");
        } else {
            byid(e.key.toUpperCase()).classList.add("pressed");
        }
    }

    lineInput += isCapsLocked ? e.key : e.key.toLowerCase();
    processKeyPress();
}

// Function to handle special key press
function handleSpecialKeyPress(e) {
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
                byid("Backspace").classList.add("pressed");
                processKeyPress();
            }
            break;
        case "Enter":
            byid("Enter1").classList.add("pressed");
            byid("Enter2").classList.add("pressed");
            handleEnterKey();
            break;
        case "Tab":
            e.preventDefault();
                byid("Tab").classList.add("pressed");
            lineInput += "    ";
            processKeyPress();
            break;
        case " ":
            e.preventDefault();
                byid("Space-bar").classList.add("pressed");
            lineInput += " ";
            processKeyPress();
            break;
    }
}

// Function to handle key release
function handleKeyRelease(e) {
    if (e.shiftKey && !CONFIG.KEYBOARD.ALPHABET.includes(e.key)) {
        byid(shiftKeyReverseMapping[e.key]).classList.remove("pressed");
    } else {
        if (e.key == "\\") {
                byid("\\1").classList.remove("pressed");
                byid("\\2").classList.remove("pressed");
        } else {
            byid(e.key.toUpperCase()).classList.remove("pressed");
        }
    }
}

// Function to handle special key release
function handleSpecialKeyRelease(e) {
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
            byid("Backspace").classList.remove("pressed");
            break;
        case "Enter":
                byid("Enter1").classList.remove("pressed");
                byid("Enter2").classList.remove("pressed");
            break;
        case "Tab":
                byid("Tab").classList.remove("pressed");
            break;
        case " ":
            byid("Space-bar").classList.remove("pressed");
            break;
    }
}

// Function to handle Enter key
function handleEnterKey() {
    if (lineInput.length == 0) {
        confirmedReturn++;
        if (confirmedReturn >= 3) {
            location.href = "index.html";
            return;
        }
    } else {
        confirmedReturn = 0;
    }
    lineCompleted();
}

// Function to process key press
function processKeyPress() {
    // Visual feedback and background color change
    if (lineInput.length) {
        const feedback = lineInput[lineInput.length - 1] == linesToType[lineInput.length - 1] ? "yah" : "nah";
        bgEffect(feedback);
    }

    // Change character color
    updateCharacterColors();

    // Check if line is complete
    if (lineInput.length >= linesToType.split("\n")[0].length) {
        lineCompleted();
        return;
    }

    // Update hand position visuals
    if (visualsIncluded) {
        updateHandPosition();
    }
}

// Function to update character colors
function updateCharacterColors() {
    for (let i in bycss("#to-type pre").children) {
        let spanChild = bycss("#to-type pre").children[i];
        if (i >= lineInput.length) {
            spanChild.className = "";
        } else if (spanChild.textContent == lineInput[i]) {
            spanChild.className = "correct";
        } else {
            spanChild.className = "incorrect";
        }
        bycss("#to-type pre").children[i] = spanChild;
    }
    bycss("#to-type pre").children[lineInput.length].className = "current";
}

// Function to update hand position visuals
function updateHandPosition() {
    const nextChar = linesToType.split("\n")[0][lineInput.length];
    if (nextChar != " ") {
        const leftChars = "qwertasdfgzxcvb";
        const keysSide = {
            qaz: "a",
            wsx: "s",
            edc: "d",
            rfvtgb: "f",
            yhnujm: "j",
            ik: "k",
            ol: "l",
            "p;": "_",
        };
        const handSrcLast = keysSide[Object.keys(keysSide).find((k) => k.includes(nextChar))];
        const handSrcFirst = leftChars.includes(nextChar) ? "l" : "r";
        const notHandSrcFirst = handSrcFirst == "r" ? "l" : "r";
        byid(handSrcFirst + "hand").classList.remove("hidden");
        byid(handSrcFirst + "hand").src = "hand/" + handSrcFirst + "hand " + handSrcLast + ".png";
        byid(notHandSrcFirst + "hand").classList.add("hidden");
    } else {
        if (byid("lhand").classList.contains("hidden")) {
            byid("rhand").src = "hand/rhand.png";
        } else {
            byid("lhand").src = "hand/lhand.png";
        }
    }
}

// Function to calculate performance
function calculatePerformance() {
    const passedMinutes = (Date.now() - lineTimer) / 1000 / 60;
    lineTimer = Date.now();

    accuracySum += cssall("span.correct").length / linesToType.split("\n")[0].length;
    accuracy = accuracySum / currentLineIndex;
    speedSum += lineInput.length / passedMinutes;
    speed = speedSum / currentLineIndex;

    byid("lines-count").textContent = currentLineIndex;
    byid("speed").textContent = Math.floor(speed);
    byid("accuracy").textContent = Math.floor(accuracy * 100);

    const overallScore = currentLineIndex * speed * accuracy;
    if (overallScore > bestOverallScore) {
        bestOverallScore = overallScore;
        updateBestScores();
    }

    if (currentLineIndex >= 60) {
        resetPerformanceTracking();
    }
}

// Function to update best scores
function updateBestScores() {
    byid("best-lines-count").textContent = currentLineIndex;
    byid("best-speed").textContent = Math.floor(speed);
    byid("best-accuracy").textContent = Math.floor(accuracy * 100);
    sessionStorage.setItem("best-lines-count", currentLineIndex);
    sessionStorage.setItem("best-speed", speed);
    sessionStorage.setItem("best-accuracy", accuracy);
    bgEffect("hah");
}

// Function to reset performance tracking
function resetPerformanceTracking() {
    currentLineIndex = 0;
    accuracySum = 0;
    speedSum = 0;
    byid("lines-count").textContent = 0;
    byid("speed").textContent = 0;
    byid("accuracy").textContent = 0;
}

// Function to generate a sentence
function generateSentence() {
    let sentence = "";
    const basicKeys = "asdfjkl;";
    const sentenceLength = 29;
    for (let i = 0; i < sentenceLength; i++) {
        if (Math.random() > 0.5) {
            sentence += CONFIG.KEYBOARD.ALPHABET[parseInt(Math.random() * CONFIG.KEYBOARD.ALPHABET.length)].toLowerCase();
        } else if (Math.random() < 0.4 && !["", " "].includes(sentence[sentence.length - 1]) && sentence != "" && i + 1 < sentenceLength) {
            sentence += " ";
        } else {
            sentence += basicKeys[parseInt(Math.random() * basicKeys.length)];
        }
    }
    return sentence + "\n";
}

// Function to display target lines
function displayTargetLines() {
    let newHTML = "";
    for (let char of linesToType) {
        newHTML += char == "\n" ? "<br>" : `<span>${char}</span>`;
    }
    bycss("#to-type pre").innerHTML = newHTML;
    processKeyPress();
}

// Initialize new lines
document.addEventListener('DOMContentLoaded', () => {
    lineTimer = Date.now();
    linesToType = [0, 0, 0].map(() => generateSentence()).join("");
    displayTargetLines();
});

// Function to apply background effect
function bgEffect(effectClass) {
    if (!visualsIncluded) return;
    const toTypeElement = byid("to-type");
    toTypeElement.className = effectClass;

    clearTimeout(bgColorChangeTimer);
    bgColorChangeTimer = setTimeout(() => {
        toTypeElement.className = "";
    }, 200);
}

// Function to line completed
function lineCompleted() {
    currentLineIndex++;
    calculatePerformance();
    linesToType += generateSentence();
    lineInput = "";

    linesToType = linesToType.slice(linesToType.split("\n")[0].length + 1, linesToType.length);
    displayTargetLines();
}

// Function to shift pressed
function shiftPressed(shiftDown = true) {
    if (shiftDown) {
        for (let k of Object.keys(CONFIG.KEYBOARD.SHIFT_MAPPINGS)) {
            byid(k).textContent = CONFIG.KEYBOARD.SHIFT_MAPPINGS[k];
        }

        byid("\\1").textContent = "|";
        byid("\\2").textContent = "|";
    } else {
        for (let k of Object.keys(CONFIG.KEYBOARD.SHIFT_MAPPINGS)) {
            byid(k).textContent = k;
        }

        byid("\\1").textContent = "\\";
        byid("\\2").textContent = "\\";
    }
}

// Function to clean HTML
function cleanHTML(htmlcode) {
    let d = document.createElement("div");
    d.textContent = htmlcode;
    return d.innerHTML;
}
