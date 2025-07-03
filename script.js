document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.getElementById('flags-left');
    const result = document.getElementById('result');
    const width = 10;
    const totalBoard = width * width;
    let bombAmount = 20;
    let squaresArray = [];
    let isGameOver = false;
    let flags = 0;
    
    // Create the board
    function createBoard() {
        flagsLeft.innerHTML = bombAmount;

        // Get shuffled game array with random bombs
        const bombArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array( totalBoard - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombArray);

        const shuffledArray = gameArray.sort( () => Math.random() - 0.5);
        


        for (let index = 0; index < totalBoard; index++) {
            const square = document.createElement('div');
            square.id = index;
            square.classList.add(shuffledArray[index]);
            grid.appendChild(square);
            squaresArray.push(square);
            
            //Normal click
            square.addEventListener('click', function() {
                click(square);
            });

            // Cntrl and left click
            square.addEventListener('contextmenu', function(e) {
                   e.preventDefault();
                addFlag(square);
            });
        }

        // Add numbers
        for (let i = 0; i < squaresArray.length; i++) {
            let total = 0;
            const isLeftEdge = (i % width === 0); // 40 % 10 === 0 YES
            const isRightEdge = (i % width === width - 1 ) // 19 % 10 === 9 YES
            
           if (squaresArray[i].classList.contains('valid')) {
                // Check left
                if (i > 0 && !isLeftEdge && squaresArray[i - 1].classList.contains('bomb')) total++;
                // Check top-right
                if (i >= width && !isRightEdge && squaresArray[i + 1 - width].classList.contains('bomb')) total++;
                // Check top
                if (i >= width && squaresArray[i - width].classList.contains('bomb')) total++;
                // Check top-left
                if (i >= width && !isLeftEdge && squaresArray[i - 1 - width].classList.contains('bomb')) total++;
                // Check right
                if (i < totalBoard - 1 && !isRightEdge && squaresArray[i + 1].classList.contains('bomb')) total++;
                // Check bottom-left
                if (i < totalBoard - width && !isLeftEdge && squaresArray[i - 1 + width].classList.contains('bomb')) total++;
                // Check bottom-right
                if (i < totalBoard - width && !isRightEdge && squaresArray[i + 1 + width].classList.contains('bomb')) total++;
                // Check bottom
                if (i < totalBoard - width && squaresArray[i + width].classList.contains('bomb')) total++;
                squaresArray[i].setAttribute('data', total);
            }
        }
    }

    createBoard();

    //Click function
    function click(square){

        if(isGameOver || square.classList.contains('checked') || square.classList.contains('flag')) return;

        if(square.classList.contains('bomb')) {
            gameOver();
        } else {
            let total = square.getAttribute('data');
            if(total != 0 ){
                if( total == 1) square.classList.add('one');
                if( total == 2) square.classList.add('two');
                if( total == 3) square.classList.add('three');
                if( total == 4) square.classList.add('four');
                square.innerHTML = total;
                square.classList.add('checked');
                return;
            }
            checkSquare(square);
        }
       square.classList.add('checked');
    }

    // Add flag with right click
    function addFlag(square){
        if(isGameOver) return;
        if(!square.classList.contains('checked') && (flags < bombAmount)){
            if(!square.classList.contains('flag')){
                square.classList.add('flag');
                flags++;
                square.innerHTML = '🚩';
                flagsLeft.innerHTML = bombAmount - flags;
                checkForWin();
            } else {
                square.classList.remove('flag');
                flags--;
                square.innerHTML = '';
                flagsLeft.innerHTML = bombAmount - flags;
            }
        }
    }

    // Check newighbouring squeares once squares is clicked
   function checkSquare(square){
    const currentId = square.id;
    const isLeftEdge = (currentId % width === 0);
    const isRightEdge = (currentId % width === width - 1);

    setTimeout(function() {
        if (currentId > 0 && !isLeftEdge){
            const newId = parseInt(currentId) - 1;
            const newSquare = document.getElementById(newId);
            if(!newSquare.classList.contains('bomb')) click(newSquare);
        }

        if (currentId > 9 && !isRightEdge){
            const newId = parseInt(currentId) + 1 - width;
            const newSquare = document.getElementById(newId);
            if(!newSquare.classList.contains('bomb')) click(newSquare);
        }

        if (currentId > 10){
            const newId = parseInt(currentId) - width;
            const newSquare = document.getElementById(newId);
            if(!newSquare.classList.contains('bomb')) click(newSquare);
        }

        if (currentId > 11 && !isLeftEdge){
            const newId = parseInt(currentId) - 1 - width;
            const newSquare = document.getElementById(newId);
            if(!newSquare.classList.contains('bomb')) click(newSquare);
        }

        if (currentId < 98 && !isRightEdge){
            const newId = parseInt(currentId) + 1;
            const newSquare = document.getElementById(newId);
            if(!newSquare.classList.contains('bomb')) click(newSquare);
        }

        if (currentId < 90 && !isLeftEdge){
            const newId = parseInt(currentId) - 1 + width;
            const newSquare = document.getElementById(newId);
            if(!newSquare.classList.contains('bomb')) click(newSquare);
        }

        if (currentId < 88 && !isRightEdge){
            const newId = parseInt(currentId) + 1 + width;
            const newSquare = document.getElementById(newId);
            if(!newSquare.classList.contains('bomb')) click(newSquare);
        }

        if (currentId < 89){
            const newId = parseInt(currentId) + width;
            const newSquare = document.getElementById(newId);
            if(!newSquare.classList.contains('bomb')) click(newSquare);
        }
    },10);
}

    function checkForWin(){
        let matches = 0;

        for (let i = 0; i < squaresArray.length; i++){
            if(squaresArray[i].classList.contains('flag') && squaresArray[i].classList.contains('bomb')){
                matches++;
            }

            if(matches=== bombAmount){
                result.innerHTML = 'You Win!';
                isGameOver = true;
            }
        }
    }

    function gameOver(){
        result.innerHTML = 'Boom! Game Over!';
        isGameOver = true;

        // Show all the bombs
        squaresArray.forEach(function(square) {
            if(square.classList.contains('bomb')){
                square.innerHTML = '💣';
                square.classList.remove('bomb');
                square.classList.add('checked');
            }
        });
    }
});