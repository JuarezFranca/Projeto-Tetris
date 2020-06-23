document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const scoreDisplay = document.querySelector('#score')
    const startBtn = document.querySelector('#start-button')
    const width =  10
    let nextRandom = 0
    let timerId = 0 
    let score = 0
  
    
    //the tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    
    ]
    
    const zTertromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const theTetrominoes = [lTetromino, zTertromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    //gerando tetrominos randomicos
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes [random] [currentRotation]
    
    //desenhando tetrominos
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino')
        })
    }
    

    //apagando tetrominos
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino')
        })    
    }

    //fazendo o tetromino cair a cada segundo
   // timerId = setInterval(moveDown, 1000)

    //atribuindo funções para as setas do teclado
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if(e.keyCode ===38) {
            rotate()
        } else if(e.keyCode === 39) {
            moveRight()
        } else if(e.keyCode === 40) {
            moveDown()
        }
    }
    document.addEventListener('keyup', control)


    //function que movera os tetrominos para baixo
    function moveDown() {
        undraw()
        currentPosition += width
        draw() 
        freeze()        
    }

    //freeze function
    function freeze() {
        if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
            current.forEach(index => squares[currentPosition + index].classList.add('taken'))
            //start em um novo tetromino
            random = nextRandom
            nextRandom = Math.floor(Math.random() * theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    //movendo o tetromino pra esquerda e bloquendo quando chega no limite
    function moveLeft() {
        undraw()
        const isAtleftEdge = current.some( index => (currentPosition + index) % width === 0)

        if(!isAtleftEdge) currentPosition -=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition +=1
    }
    draw()
}
    //movendo o tetromino pra direia e bloqueando quando chega ao limite

    function moveRight() {
        undraw()
        const isAtrightEdge = current.some( index => (currentPosition + index) % width === width -1)

        if(!isAtrightEdge) currentPosition +=1

        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
        currentPosition -=1
    }
    draw()
}

//rotacionando o tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) { // se a rotação for igual a 4 volta pra 0
            currentRotation = 0 
        }
        current = theTetrominoes[random][currentRotation]
        draw()
    }

    //mostrabdo a proxima peça no mini-grid
    const displaySquares = document.querySelectorAll('.mini-grid div')
    const displayWidth = 4
    let displayIndex = 0
    
    
    //criando tetrominos estatico para o mini-grid
    const upNexttetromino = [
        [1, displayWidth+1, displayWidth*2+1, 2], //ltetromino
        [0, displayWidth, displayWidth+1, displayWidth*2+1], //ztetromino
        [1, displayWidth, displayWidth+1,displayWidth+2], //ttetromino
        [0, 1, displayWidth,displayWidth+1], //otetromino
        [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //itetromino
    ]


    //tetromino exibido no mini-grid
    function displayShape(){
        //remove traços do tetrominos no mini grid
        displaySquares.forEach(square => {
            square.classList.remove('tetromino')
        })
        upNexttetromino[nextRandom].forEach( index => {
            displaySquares[displayIndex + index].classList.add('tetromino')
        })
    }

    //adcionando o botão start/stop
    startBtn.addEventListener ('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
        displayShape()
        }
    })

    //add score
    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i + 0, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9, i + 10]

            if(row.every(index => squares[index].classList.contains('taken'))) {
                score += 10
                scoreDisplay.innerHTML = score
                row.forEach(index => {
                    squares[index].classList.remove('taken')
                    squares[index].classList.remove('tetromino')
                })
                const squareRemoved = squares.splice(i, width)
                squares = squareRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
             
            }
        }
    }

    //game over function
    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) {
            scoreDisplay.innerHTML = "fim"
            clearInterval(timerId)
        }
    }


})
    