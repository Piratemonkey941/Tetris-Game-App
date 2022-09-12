document.addEventListener('DOMContentLoaded', () => {

    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))

    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#startBtn')
    const width = 10
    let nextRandom = 0
    let timerId
    let score = 0
    const colors = [
        'orange',
        'red',
        'purple',
        'green',
        'blue'
    ]

    // trtrominoes
   const LTetromino = [
    [1, width +1, width*2+1, 2],
    [width, width +1, width + 2, width*2+2],
    [1, width +1, width*2+1, width*2],
    [width, width *2, width*2+1, width*2+2]
    ]

   const ZTetromino = [
    [0, width, width +1, width*2+1],
    [width +1, width + 2, width*2, width*2+1],
    [0, width, width +1, width * 2 +1],
    [width+1, width+2, width * 2, width * 2 +1]
    ]
   const TTetromino = [
    [1, width, width +1, width+2],
    [1, width +1, width + 2, width*2+1],
    [width, width +1, width + 2, width*2+1],
    [1, width, width  +1, width*2+1]
    ]

   const OTetromino = [
    [0,1, width, width +1],
    [0,1, width, width +1],
    [0,1, width, width +1],
    [0,1, width, width +1]
   
    ]
   const ITetromino = [
    [1, width +1, width*2+1, width*3+1],
    [width, width +1, width + 2, width+3],
    [1, width +1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3]
    ]

const theTetrominoes = [
    LTetromino, ZTetromino, TTetromino, OTetromino, ITetromino
]

let currentPosition = 4
let currentRotation = 0

console.log(theTetrominoes[0][0])

// randomly selecting tetro
let random = Math.floor(Math.random()*theTetrominoes.length)
console.log(random)
let current = theTetrominoes[random][currentRotation]



// drawing the tetro
function draw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.add('tetromino')
        squares[currentPosition + index].style.backgroundColor = colors[random]
    })
}

//undraw the tetro

function undraw() {
    current.forEach(index => {
        squares[currentPosition + index].classList.remove('tetromino')
        squares[currentPosition + index].style.backgroundColor = ''
    })
}

//make the tetro move down every second
// timerId = setInterval(moveDown, 900)

//assign function to keycode

function control(e) {
    if(e.keyCode === 37) {
        moveLeft()
    }
    else if (e.keyCode === 38){
        rotate()
    } 
    else if (e.keyCode === 39){
        moveRight() 
    }
    else if (e.keyCode === 40){
        moveDown()
    }
}
document.addEventListener('keyup', control)

// move down function
function moveDown(){

    if(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        undraw()
        currentPosition += width
        draw()
      } else {
        freeze();  
      }
    // undraw()
    // currentPosition += width
    // draw()
    // freeze()
}

// freeze function

function freeze() {
    // if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
        current.forEach(index => squares[currentPosition + index].classList.add('taken'))
        // start new tetro
        random = nextRandom
        nextRandom = Math.floor(Math.random() * theTetrominoes.length)
        current = theTetrominoes[random][currentRotation]
        currentPosition = 4
        draw()
        displayShape()
        addScore()
        gameOver()
        
    // }
}

//move tetro left/right unless at edge or blockage ===============================

  //move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition +=1
    }
    draw()
  }
  //move the tetromino right, unless is at the edge or there is a blockage
  function moveRight() {
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!isAtRightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
      currentPosition -=1
    }
    draw()
  }


function isAtRight(){
        
        return current.some(index=> (currentPosition + index + 1) % width === 0);
    }

function isAtLeft() {
        
    return current.some(index=> (currentPosition + index) % width === 0);

    }

function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }

function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) {
        currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    checkRotatedPosition();
    draw()
}

// sho up next tetro in mini grid
const displaySquares = document.querySelectorAll('.miniGrid div')
const displayWidth = 4
const displayIndex = 0 

// the tetros without rotations 
const upNextTetrominoes = [
    [1, displayWidth +1, displayWidth*2+1, 2],                  //l
    [0, displayWidth, displayWidth +1, displayWidth*2+1],       //z
    [1, displayWidth, displayWidth +1, displayWidth+2],         //t
    [0, 1, displayWidth, displayWidth +1],                      //o
    [1, displayWidth +1, displayWidth*2+1, displayWidth*3+1]    //i
]

function displayShape() {
    //remove any trace of a tetromino form the entire grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach( index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

// add function to button 
startBtn.addEventListener('click', () => {
    if (timerId) {
        clearInterval(timerId)
        timerId = null
    } else {
        draw()
        timerId = setInterval(moveDown, 1000)
        nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
    }
})


//addscore

function addScore() {
    for (let i = 0; i < 199; i +=width) {
        const row = [i , i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

        if(row.every(index => squares[index].classList.contains('taken'))) {
            score += 10
            scoreDisplay.innerHTML = score
            row.forEach(index => {
                squares[index].classList.remove('taken')
                squares[index].classList.remove('tetromino')
                squares[index].style.backgroundColor = ''
            })
            const squaresRemoved = squares.splice(i, width)
            squares = squaresRemoved.concat(squares)
            squares.forEach(cell => grid.appendChild(cell))
        }
    }
}

//game over function

function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        scoreDisplay.innerHTML = 'end'
        clearInterval(timerId)
    }
}


})