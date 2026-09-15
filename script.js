const levels = [
    {
        id: 1,
        instruction: "Let's warm up! To start forming tactics, activate the tactical grid by changing the display property.",
        players: 3,
        expected: { display: "flex" }
    },
    {
        id: 2,
        instruction: "Position the attacking trio right in the center of the pitch horizontally.",
        players: 3,
        expected: { display: "flex", "justify-content": "center" }
    },
    {
        id: 3,
        instruction: "Spread the 4 defenders evenly across the pitch and push them to the bottom line.",
        players: 4,
        expected: { display: "flex", "justify-content": "space-between", "align-items": "flex-end" }
    },
    {
        id: 4,
        instruction: "We have 15 midfielders! Allow them to wrap into multiple rows.",
        players: 15,
        expected: { display: "flex", "flex-wrap": "wrap" }
    },
    {
        id: 5,
        instruction: "Line up the players in a vertical column, and push them to the far right side of the pitch.",
        players: 4,
        expected: { display: "flex", "flex-direction": "column", "align-items": "flex-end" }
    },
    {
        id: 6,
        instruction: "Spread the defense evenly across the pitch horizontally, center them vertically, and reverse their order to trick the opponent.",
        players: 5,
        expected: { display: "flex", "flex-direction": "row-reverse", "justify-content": "space-evenly", "align-items": "center" }
    }
];

const STORAGE_KEY = "footballFlexboxProgress";
let currentLevelIndex = 0;
let highestUnlocked = 0;
let attempts = 0;

const pitch = document.getElementById("pitch");
const instructionText = document.getElementById("instruction-text");
const levelIndicator = document.getElementById("level-indicator");
const levelSelector = document.getElementById("level-selector");
const attemptsCount = document.getElementById("attempts-count");
const feedbackMsg = document.getElementById("feedback-message");
const btnCheck = document.getElementById("btn-check");
const btnReset = document.getElementById("btn-reset");
const btnNext = document.getElementById("btn-next");
const selects = document.querySelectorAll(".flex-prop");

function initGame() {
    loadProgress();
    populateLevelSelector();
    loadLevel(currentLevelIndex);
    attachEventListeners();
}

function loadProgress() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        highestUnlocked = parseInt(saved);
        currentLevelIndex = highestUnlocked; 
        if (currentLevelIndex >= levels.length) currentLevelIndex = levels.length - 1;
    }
}

function saveProgress() {
    localStorage.setItem(STORAGE_KEY, highestUnlocked);
    populateLevelSelector();
}

function loadLevel(index) {
    const level = levels[index];
    currentLevelIndex = index;
    attempts = 0;
    
    levelIndicator.textContent = `Level ${index + 1} of ${levels.length}`;
    instructionText.textContent = level.instruction;
    attemptsCount.textContent = attempts;
    levelSelector.value = index;
    
    resetFeedback();
    btnNext.classList.add("hidden");
    btnCheck.classList.remove("hidden");

    pitch.innerHTML = "";
    for (let i = 1; i <= level.players; i++) {
        const player = document.createElement("div");
        player.classList.add("player");
        player.textContent = i;
        pitch.appendChild(player);
    }

    resetProperties();
}

function populateLevelSelector() {
    levelSelector.innerHTML = "";
    levels.forEach((lvl, index) => {
        const option = document.createElement("option");
        option.value = index;
        option.textContent = `Level ${lvl.id}`;
        if (index > highestUnlocked) {
            option.disabled = true;
            option.textContent += " (Locked)";
        }
        levelSelector.appendChild(option);
    });
}

function updatePitchStyle() {
    selects.forEach(select => {
        const prop = select.id;
        const val = select.value;
        pitch.style[prop] = val;
    });
}

function attachEventListeners() {
    selects.forEach(select => {
        select.addEventListener("change", updatePitchStyle);
    });

    btnReset.addEventListener("click", () => {
        resetProperties();
    });

    btnCheck.addEventListener("click", checkSolution);

    btnNext.addEventListener("click", () => {
        if (currentLevelIndex < levels.length - 1) {
            loadLevel(currentLevelIndex + 1);
        }
    });

    levelSelector.addEventListener("change", (e) => {
        loadLevel(parseInt(e.target.value));
    });
}

function resetProperties() {
    selects.forEach(select => {
        select.selectedIndex = 0;
    });
    
    pitch.style = "";
    pitch.style.display = document.getElementById("display").value;
}

function checkSolution() {
    const level = levels[currentLevelIndex];
    let isCorrect = true;
    attempts++;
    attemptsCount.textContent = attempts;

    for (const [prop, expectedValue] of Object.entries(level.expected)) {
        const currentDropdownValue = document.getElementById(prop).value;
        if (currentDropdownValue !== expectedValue) {
            isCorrect = false;
            break;
        }
    }

    if (isCorrect) {
        showFeedback("Goal! Great tactical setup.", "success");
        pitch.classList.add("bounce");
        setTimeout(() => pitch.classList.remove("bounce"), 500);
        
        btnCheck.classList.add("hidden");
        
        if (currentLevelIndex === levels.length - 1) {
            showFeedback("You've completed all levels! Master Tactician!", "success");
        } else {
            btnNext.classList.remove("hidden");
        }

        if (currentLevelIndex >= highestUnlocked) {
            highestUnlocked = currentLevelIndex + 1;
            saveProgress();
        }
    } else {
        showFeedback("Not quite right. Check the instructions and try again.", "error");
        pitch.classList.add("shake");
        setTimeout(() => pitch.classList.remove("shake"), 400);
    }
}

function showFeedback(msg, type) {
    feedbackMsg.textContent = msg;
    feedbackMsg.className = `feedback show ${type}`;
}

function resetFeedback() {
    feedbackMsg.className = "feedback";
    feedbackMsg.textContent = "";
}

initGame();
