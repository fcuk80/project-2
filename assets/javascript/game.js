const grid = document.querySelector('.grid');
const resultDisplay = document.querySelector('.results');
const width = 15;
let currentShooterIndex = 202;
let invadersId;
let isGoingRight = true;
let direction = 1;
let results = 0;
let aliensRemoved = [];

// Define the alien invaders
const alienInvaders = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39,
];

// Create grid and assign squares
for (let i = 0; i < width * width; i++) {
    const square = document.createElement('div');
    grid.appendChild(square);
}
const squares = Array.from(document.querySelectorAll('.grid div'));

// Draw the invaders on the grid
function drawInvaders() {
    alienInvaders.forEach((invader, index) => {
        if (!aliensRemoved.includes(index)) {
            squares[invader].classList.add('invader');
        }
    });
}

// Remove invaders from the grid
function removeInvaders() {
    alienInvaders.forEach(invader => {
        squares[invader].classList.remove('invader');
    });
}

// Move the shooter based on key press
function moveShooter(e) {
    squares[currentShooterIndex].classList.remove('shooter');
    if (e.key === 'ArrowLeft' && currentShooterIndex % width !== 0) {
        currentShooterIndex -= 1;
    } else if (e.key === 'ArrowRight' && currentShooterIndex % width < width - 1) {
        currentShooterIndex += 1;
    }
    squares[currentShooterIndex].classList.add('shooter');
}

// Move the invaders across the grid
function moveInvaders() {
    const leftEdge = alienInvaders[0] % width === 0;
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;
    removeInvaders();

    if (rightEdge && isGoingRight) 
        {
            for (let i = 0; i < alienInvaders.length; i++) 
            {
                alienInvaders[i] += width + 1
                direction = -1
                isGoingRight = false
            }
        }
        if(leftEdge && !isGoingRight) 
            {
                for (let i = 0; i < alienInvaders.length; i++)
                {
                    alienInvaders[i] += width - 1
                    direction = 1
                    isGoingRight = true
                }
            }

    alienInvaders.forEach((invader, index) => {
        alienInvaders[index] += direction;
    });

    drawInvaders();

    // Check for game over or win
    if (squares[currentShooterIndex].classList.contains('invader')) {
        resultDisplay.textContent = 'GAME OVER';
        clearInterval(invadersId);
        alert('GAME OVER');
        setTimeout(restartGame, 3000);
        location.reload();
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultDisplay.textContent = 'YOU WIN';
        clearInterval(invadersId);
        alert('YOU WIN');
        setTimeout(restartGame(), 3000);
        location.reload();
    }
}

// Restart the game
function restartGame() {
    clearInterval(invadersId);
    currentShooterIndex = 202;
    aliensRemoved = [];
    isGoingRight = true;
    direction = 1;
    results = 0;

    squares.forEach(square => {
        square.className = '';
    });

    drawInvaders();
    squares[currentShooterIndex].classList.add('shooter');
    resultDisplay.textContent = results.toString();
    invadersId = setInterval(moveInvaders, 600);
}

// Shoot at the invaders
function shoot(e) {
    let lazerId;
    let currentLazerIndex = currentShooterIndex;

    function moveLazer() {
        squares[currentLazerIndex].classList.remove('lazer');
        currentLazerIndex -= width;
        squares[currentLazerIndex].classList.add('lazer');

        if (squares[currentLazerIndex].classList.contains('invader')) {
            squares[currentLazerIndex].className = 'boom';
            setTimeout(() => squares[currentLazerIndex].classList.remove('boom'), 250);
            clearInterval(lazerId);

            const alienRemoved = alienInvaders.indexOf(currentLazerIndex);
            aliensRemoved.push(alienRemoved);
            results++;
            resultDisplay.textContent = results.toString();
        }
    }

    if (e.key === 'ArrowUp') {
        lazerId = setInterval(moveLazer, 100);
    }
}

// Event listeners
document.addEventListener('keydown', moveShooter);
document.addEventListener('keydown', shoot);

// Start the game
drawInvaders();
squares[currentShooterIndex].classList.add('shooter');
invadersId = setInterval(moveInvaders, 600);
