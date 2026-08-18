const gameBoard = document.querySelector("#game-board");
const cards = Array.from(document.querySelectorAll(".card"));

const movesDisplay = document.querySelector("#moves");
const timerDisplay = document.querySelector("#timer");
const pairsDisplay = document.querySelector("#pairs");

const finalMovesDisplay = document.querySelector("#final-moves");
const finalTimeDisplay = document.querySelector("#final-time");

const winScreen = document.querySelector("#win-screen");
const restartButton = document.querySelector("#restart-button");

let firstCard = null;
let secondCard = null;

let moves = 0;
let matchedPairs = 0;

let locked = false;

let seconds = 0;
let timerStarted = false;
let timer;


// Shuffle cards

function shuffleCards() {

    cards.sort(function() {
        return Math.random() - 0.5;
    });

    cards.forEach(function(card) {
        gameBoard.appendChild(card);
    });
}

shuffleCards();


// Timer

function startTimer() {

    if (timerStarted) {
        return;
    }

    timerStarted = true;

    timer = setInterval(function() {

        seconds++;

        updateTimer();

    }, 1000);
}


function updateTimer() {

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    timerDisplay.textContent =
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0");
}


// Card click

cards.forEach(function(card) {

    card.addEventListener("click", function() {

        if (locked) {
            return;
        }

        if (card === firstCard) {
            return;
        }

        if (card.classList.contains("matched")) {
            return;
        }

        startTimer();

        const image = card.querySelector("img");
        const question = card.querySelector("span");

        image.style.display = "block";
        question.style.display = "none";


        if (firstCard === null) {

            firstCard = card;

        } else {

            secondCard = card;

            moves++;

            movesDisplay.textContent = moves;

            checkMatch();
        }

    });

});


// Check match

function checkMatch() {

    const firstImage = firstCard.querySelector("img");
    const secondImage = secondCard.querySelector("img");

    if (firstImage.alt === secondImage.alt) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.classList.add("match-pop");
        secondCard.classList.add("match-pop");

        matchedPairs++;

        pairsDisplay.textContent = matchedPairs;

        // Check if the player has won
        if (matchedPairs === 10) {

            clearInterval(timer);


            setTimeout(function () {

                winScreen.classList.add("show");

                sendGameResult();

            }, 700);

            return;
        }

        // Clear cards after a normal match
        firstCard = null;
        secondCard = null;

    } else {

        locked = true;

        setTimeout(function () {

            firstCard.querySelector("img").style.display = "none";
            firstCard.querySelector("span").style.display = "flex";

            secondCard.querySelector("img").style.display = "none";
            secondCard.querySelector("span").style.display = "flex";

            firstCard = null;
            secondCard = null;

            locked = false;

        }, 1000);
    }
}
// Restart game

restartButton.addEventListener("click", function () {
    location.reload();
});


async function sendGameResult() {

    const result = {
        moves: moves,
        time: seconds,
        pairs: matchedPairs
    };

    try {

        const response = await fetch("http://localhost:3000/api/results", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(result)
        });

        const data = await response.json();

        console.log(data);

    } catch (error) {

        console.error("Error sending game result:", error);

    }
}