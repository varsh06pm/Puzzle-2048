var board;
var score=0;
var rows=4;
var cols=4;


window.onload = function(){
    setGame();
}

function setGame(){
    board = [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
    ]

    // board = [
    //     [2,2,2,2],
    //     [2,2,2,2],
    //     [4,4,8,8],
    //     [4,4,8,8]
    // ]

    //creating the board
    for(let r = 0; r< rows; r++){
        for(let c = 0; c<cols; c++){
            //creates <div id='0-0'></div>
            let tile = document.createElement("div");
            //sets coordinates to the board that corresponds to the tile
            tile.id = r.toString() + "-" + c.toString();
            let num = board[r][c];
            updateTile(tile,num);
            document.getElementById("board").append(tile);
        }
    }

    //to start the game two tiles are set to '2' initially thats y the func is called twice
    setTwo();
    setTwo();
}

function hasEmptyTile(){
    for(let r = 0; r< rows; r++){
        for(let c = 0; c<cols; c++){
            if(board[r][c]==0){
                return true;
            } 
        }
    }
    return false;
}

function setTwo() {
    //if the board is full 
    if(!hasEmptyTile()){
        return;
    }
    let found = false; //whenever we move the tiles up/down/left/right if there's an open tile that is empty we will call setTwo func
    while(!found){
        //random r,c 
        let r = Math.floor(Math.random()*rows);
        let c = Math.floor(Math.random()*cols);

        if(board[r][c]==0){
            board[r][c] = 2;
            let tile = document.getElementById(r.toString()+"-"+c.toString());
            tile.innerText = "2";
            tile.classList.add("x2");
            found = true;
        }
    }
}

function updateTile(tile,num){
    tile.innerText = "";
    tile.classList.value = ""; //clear the classList 
    tile.classList.add("tile");
    if(num>0){
        tile.innerText = num;
        if(num <= 4096){
            tile.classList.add("x"+num.toString());
        }else{
            tile.classList.add("x8192");
        }
    }
}

document.addEventListener("keyup",(e) => {
    if(e.code == "ArrowLeft") {
        slideLeft();
        setTwo(); //after each slide a new tile is added
    }
    else if(e.code == "ArrowRight") {
        slideRight();
        setTwo();
    }
    else if(e.code == "ArrowUp") {
        slideUp();
        setTwo();
    }
    else if(e.code == "ArrowDown") {
        slideDown();
        setTwo();
    }
    document.getElementById("score").innerText = score;

    // check for win and game over
    handleWin();
    handleGameOver();
})

function filterZero(row){
    return row.filter(num => num!=0);  //creates a new array without zeroes
}

function slide(row) {
    //[0,2,2,2]
    row = filterZero(row); //get rid of zeroes -> [2,2,2]

    //slide
    for(let i=0;i<row.length-1;i++){
        //check every 2
        if(row[i]==row[i+1]){
            row[i] *= 2;
            row[i+1] = 0;
            score += row[i];
        } //[2,2,2] -> [4,0,2]
    }

    row = filterZero(row); //[4,2]

    //add the zeroes back to complete the row
    while(row.length < cols){
        row.push(0);
    } //[4,2,0,0]

    return row;
}

function slideLeft(){
    for(let r = 0;r<rows;r++){
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for(let c=0;c<cols;c++){
            let tile = document.getElementById(r.toString() + "-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideRight(){
    for(let r = 0;r<rows;r++){
        let row = board[r];
        row.reverse();
        row = slide(row);
        row.reverse();
        board[r] = row;

        for(let c=0;c<cols;c++){
            let tile = document.getElementById(r.toString() + "-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideUp(){
    for(let c=0;c<cols;c++){
        let row = [board[0][c],board[1][c],board[2][c],board[3][c]];
        row = slide(row);
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for(let r=0;r<rows;r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

function slideDown(){
    for(let c=0;c<cols;c++){
        let row = [board[0][c],board[1][c],board[2][c],board[3][c]];
        row.reverse();
        row = slide(row);
        row.reverse();
        // board[0][c] = row[0];
        // board[1][c] = row[1];
        // board[2][c] = row[2];
        // board[3][c] = row[3];
        for(let r=0;r<rows;r++){
            board[r][c] = row[r];
            let tile = document.getElementById(r.toString() + "-"+c.toString());
            let num = board[r][c];
            updateTile(tile,num);
        }
    }
}

//to check if the player has won
function hasWon() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 2048) {
                return true;
            }
        }
    }
    return false;
}

//to check if the game is over
function isGameOver() {
    if (hasEmptyTile()) {
        return false; // If there are empty tiles, game is not over
    }

    // Check if adjacent tiles have the same value
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            let current = board[r][c];
            // Check left
            if (c > 0 && board[r][c - 1] === current) {
                return false;
            }
            // Check right
            if (c < cols - 1 && board[r][c + 1] === current) {
                return false;
            }
            // Check up
            if (r > 0 && board[r - 1][c] === current) {
                return false;
            }
            // Check down
            if (r < rows - 1 && board[r + 1][c] === current) {
                return false;
            }
        }
    }
    return true; // If no adjacent tiles have the same value and no empty tiles, game is over
}

let gameOverDisplayed = false; // Flag variable to track if game over message is displayed
let winDisplayed = false; // Flag variable to track if win message is displayed

// Function to handle game over
function handleGameOver() {
    if (isGameOver() && !gameOverDisplayed) { // Check if game over and message not displayed
        gameOverDisplayed = true; // Set flag to true to indicate message displayed

        // Hide the game board
        document.getElementById("board").style.display = "none";

        // Show game over message
        const gameOverMessage = document.createElement("div");
        gameOverMessage.innerText = "Game Over - Better Luck Next Time!";
        gameOverMessage.style.fontSize = "36px";
        gameOverMessage.style.textAlign = "center";
        document.body.appendChild(gameOverMessage);

        // Refresh the page after 5 seconds
        setTimeout(() => {
            location.reload(); // Reload the page
        }, 5000);
    }
}

// Function to handle win
function handleWin() {
    if (hasWon() && !winDisplayed) { // Check if win and message not displayed
        winDisplayed = true; // Set flag to true to indicate message displayed

        // Hide the game board
        document.getElementById("board").style.display = "none";

        // Show win message
        const winMessage = document.createElement("div");
        winMessage.innerText = "Congratulations, You Win!";
        winMessage.style.fontSize = "36px";
        winMessage.style.textAlign = "center";
        document.body.appendChild(winMessage);

        // Refresh the page after 5 seconds
        setTimeout(() => {
            location.reload(); // Reload the page
        }, 5000);
    }
}



