const grid = document.querySelector('.grid')
const resultDisply = document.querySelector('.results')
let currentShooterIndex = 202
const width = 15
const aliensRemoved = []
let invadersId
let isGoingRight = true
let direction = 1
let results = 0
//looping the div to make a grid

for (let i = 0; i < width * width; i++) 
{
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = 
[
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39,
]

function draw() 
{
    for (let i = 0; i < alienInvaders.length; i++) 
    {
        if (!aliensRemoved.includes(i)) 
        {
        squares[alienInvaders[i]].classList.add('invader')
        }
    }
}
draw()

squares[currentShooterIndex].classList.add('shooter')

function remove() 
{
    for (let i = 0; i <alienInvaders.length; i++) 
    {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}

function moveShooter(e) 
{
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key) 
    {
        case 'ArrowLeft':
            if (currentShooterIndex % width !==0) currentShooterIndex -=1
            break
        case 'ArrowRight':
            if (currentShooterIndex % width <width - 1) currentShooterIndex +=1
            break
    }
squares[currentShooterIndex].classList.add('shooter')
}

document.addEventListener('keydown', moveShooter)

function moveInvaders() 
{
    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()


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

for (let i = 0; i < alienInvaders.length; i++) 
    {
        alienInvaders[i] += direction
    }

    draw()

// trying to display message at end of game

    if (squares[currentShooterIndex].classList.contains("invader")) 
    {
        resultDisply.innerHTML = 'GAME OVER'
        clearInterval (invadersId)
    }

    if (aliensRemoved.length === alienInvaders.length) 
    {
        resultDisply.innerHTML = 'YOU WIN'
        clearInterval (invadersId)

    }
}


invadersId = setInterval(moveInvaders,600)

function shoot(e) 
    {
    let lazerId
    let currentLazerIndex = currentShooterIndex

    function moveLazer() 
    {
        squares[currentLazerIndex].classList.remove('lazer')
        currentLazerIndex -= width
        squares[currentLazerIndex].classList.add('lazer')
    
        if (squares[currentLazerIndex].classList.contains('invader')) 
        {
            squares[currentLazerIndex].classList.remove('lazer')
            squares[currentLazerIndex].classList.remove('invader')
            squares[currentLazerIndex].classList.add('boom')

            setTimeout(() => squares[currentLazerIndex].classList.remove('boom'))
            clearInterval(lazerId)

            const alienRemoved = alienInvaders.indexOf(currentLazerIndex)
            aliensRemoved.push(alienRemoved)
            results++
            resultDisply.innerHTML = results
        }
    }

    switch(e.key) 
    {
        case 'ArrowUp':
            lazerId = setInterval(moveLazer, 100)
            break        
    }


}

document.addEventListener('keydown', shoot)

