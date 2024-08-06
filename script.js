console.log("Hello Fellow DEV!");

let col1 = null;
let col2 = null;

let goback = document.querySelector(".goback");

let color1 = document.querySelector(".colorselect11");
let color2 = document.querySelector(".colorselect12");
let color3 = document.querySelector(".colorselect13");
let color4 = document.querySelector(".colorselect21");
let color5 = document.querySelector(".colorselect22");
let color6 = document.querySelector(".colorselect23");

let colorname;
let colorname2;

color1.addEventListener("click", function() {
    color1.style.border = "3px solid black";
    color2.style.border = "";
    color3.style.border = "";

    col1 = window.getComputedStyle(color1).backgroundColor;
    colorname = "Red";
});

color2.addEventListener("click", function() {
    color1.style.border = "";
    color2.style.border = "3px solid black";
    color3.style.border = "";
    col1 = window.getComputedStyle(color2).backgroundColor;
    colorname = "Blue";
});

color3.addEventListener("click", function() {
    color1.style.border = "";
    color2.style.border = "";
    color3.style.border = "3px solid black";
    col1 = window.getComputedStyle(color3).backgroundColor;
    colorname = "Green";
});

color4.addEventListener("click", function() {
    color4.style.border = "3px solid black";
    color5.style.border = "";
    color6.style.border = "";
    col2 = window.getComputedStyle(color4).backgroundColor;
    colorname2 = "Yellow";
});

color5.addEventListener("click", function() {
    color4.style.border = "";
    color5.style.border = "3px solid black";
    color6.style.border = "";
    col2 = window.getComputedStyle(color5).backgroundColor;
    colorname2 = "Orange";
});

color6.addEventListener("click", function() {
    color4.style.border = "";
    color5.style.border = "";
    color6.style.border = "3px solid black";
    col2 = window.getComputedStyle(color6).backgroundColor;
    colorname2 = "Pink";
});

document.addEventListener("DOMContentLoaded", function() {
    const squares = document.querySelectorAll(".square");
    let startButtonOne = document.getElementById("start-button-one");
    let startButtonComputer = document.getElementById("start-button-computer");
    const resetButton = document.querySelector(".button");
    const welcomeScreen = document.querySelector(".welcome-screen");
    const gameContainer = document.querySelector(".grandfather-box");
    const ColorSelect = document.querySelector(".color-choose");
    let againstComputer = false;
    let iteration = 1;
    let gameOver = true;
    resetButton.style.display = "none";

    startButtonOne.addEventListener("click", function() {
        startGame();
    });

    startButtonComputer.addEventListener("click", function() {
        againstComputer = true;
        startGame();
    });

    function startGame() {
        if (col1 === null || col2 === null) {
            alert("Please select colors for both players");
            return;
        }
        welcomeScreen.style.display = "none";
        gameContainer.style.display = "block";
        resetButton.style.display = "block";
        ColorSelect.style.display = "none";
        const para = document.createElement("p");
        const node = document.createTextNode("Don't Come Here. Play the game bozo!.");
        para.appendChild(node);
        document.body.appendChild(para);
        resetButton.style.backgroundColor = "red";
        resetButton.style.marginBottom = "-100px";
        gameContainer.style.marginBottom = "640px";
        gameOver = false;
    }

    squares.forEach(function(square) {
        square.addEventListener("click", function() {
            if (gameOver || square.querySelector(".icon") || square.querySelector(".icon1")) {
                return;
            }

            playerMove(square);

            if (againstComputer && !gameOver) {
                computerMove();
            }
        });
    });

    function playerMove(square) {
        if (iteration % 2 !== 0) {
            let cross = document.createElement("div");
            cross.classList.add("icon1");
            cross.innerHTML = `
                <div class="cross1"></div>
                <div class="cross2"></div>
            `;
            square.appendChild(cross);
            square.style.backgroundColor = col1;
        } else {
            let icon = document.createElement("div");
            icon.classList.add("icon");
            icon.classList.add("circle");
            square.appendChild(icon);
            square.style.backgroundColor = col2;
        }
        iteration++;
        checkWin();
    }

    function computerMove() {
        let emptySquares = [];
        squares.forEach(function(square) {
            if (!square.querySelector(".icon") && !square.querySelector(".icon1")) {
                emptySquares.push(square);
            }
        });

        if (emptySquares.length === 0) return;

        // Check if the computer can win in the next move
        for (let i = 0; i < emptySquares.length; i++) {
            let square = emptySquares[i];
            square.style.backgroundColor = col2;
            let win = checkWinForColor(col2);
            square.style.backgroundColor = '';

            if (win) {
                let icon = document.createElement("div");
                icon.classList.add("icon");
                icon.classList.add("circle");
                square.appendChild(icon);
                square.style.backgroundColor = col2;

                iteration++;
                checkWin();
                return;
            }
        }

        // Check if the player is about to win and block them
        for (let i = 0; i < emptySquares.length; i++) {
            let square = emptySquares[i];
            square.style.backgroundColor = col1;
            let win = checkWinForColor(col1);
            square.style.backgroundColor = '';

            if (win) {
                let icon = document.createElement("div");
                icon.classList.add("icon");
                icon.classList.add("circle");
                square.appendChild(icon);
                square.style.backgroundColor = col2;

                iteration++;
                checkWin();
                return;
            }
        }

        // If no immediate threat or win, choose a random square
        let randomIndex = Math.floor(Math.random() * emptySquares.length);
        let square = emptySquares[randomIndex];

        let icon = document.createElement("div");
        icon.classList.add("icon");
        icon.classList.add("circle");
        square.appendChild(icon);
        square.style.backgroundColor = col2;

        iteration++;
        checkWin();
    }

    function checkWinForColor(color) {
        const positions = [
            [".one", ".two", ".three"],
            [".four", ".five", ".six"],
            [".seven", ".eight", ".nine"],
            [".one", ".four", ".seven"],
            [".two", ".five", ".eight"],
            [".three", ".six", ".nine"],
            [".one", ".five", ".nine"],
            [".three", ".five", ".seven"]
        ];

        for (let pos of positions) {
            let [a, b, c] = pos.map(selector => document.querySelector(selector));
            if (a.style.backgroundColor === color && b.style.backgroundColor === color && c.style.backgroundColor === color) {
                return true;
            }
        }
        return false;
    }

    function checkDraw() {
        let allFilled = true;
        squares.forEach(function(square) {
            if (!square.querySelector(".icon") && !square.querySelector(".icon1")) {
                allFilled = false;
            }
        });
        if (allFilled) {
            setTimeout(function() {
                alert("It's a draw!");
            }, 500);
            setTimeout(function() {
                window.location.reload();
            }, 1000);
            gameOver = true;
        }
    }

    function checkWin() {
        const positions = [
            [".one", ".two", ".three"],
            [".four", ".five", ".six"],
            [".seven", ".eight", ".nine"],
            [".one", ".four", ".seven"],
            [".two", ".five", ".eight"],
            [".three", ".six", ".nine"],
            [".one", ".five", ".nine"],
            [".three", ".five", ".seven"]
        ];

        for (let pos of positions) {
            let [a, b, c] = pos.map(selector => document.querySelector(selector));
            if (a.style.backgroundColor === col1 && b.style.backgroundColor === col1 && c.style.backgroundColor === col1) {
                setTimeout(function() {
                    alert(`${colorname} wins!`);
                }, 500);
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
                gameOver = true;
                return;
            } else if (a.style.backgroundColor === col2 && b.style.backgroundColor === col2 && c.style.backgroundColor === col2) {
                setTimeout(function() {
                    alert(`${colorname2} wins!`);
                }, 500);
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
                gameOver = true;
                return;
            }
        }

        checkDraw();
    }

    resetButton.addEventListener("click", function() {
        window.location.reload();
    });
});


goback.addEventListener("click", function() {
    window.location.href="https://game-site-orpin.vercel.app/";});