let minePositions = [];
let flaggedCells = [];
let startTime; // 변수를 선언하여 시작 시간 저장
let timerInterval; // setInterval을 사용하여 시간 업데이트를 처리하기 위한 변수


const toggleButton = document.createElement("button");
toggleButton.textContent = "🚩";
toggleButton.style.width = "50px";
toggleButton.style.height = "39px";
toggleButton.style.position = "relative";
toggleButton.style.bottom = "5px";
toggleButton.style.backgroundColor = "rgb(7, 19, 59)";
let isToggled = false;
let isGameOver = false;
document.getElementById("forMobile").appendChild(toggleButton);
let checkGame = 0;
let isStarted = false;


// start game
function easyGame() {
  const row = 10;
  const col = 10;
  const mineNum = 9;
  checkGame = 1;
  isStarted = true;
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col, mineNum);
}
function midGame() {
  const row = 16;
  const col = 16;
  const mineNum = 40;
  checkGame = 2;
  isStarted = true;
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col, mineNum);
}
function hardGame() {
  const row = 30;
  const col = 16;
  const mineNum = 99;
  checkGame = 3;
  isStarted = true;
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col, mineNum);
}
function chalGame() {
  const row = 77;
  const col = 77;
  const mineNum = 2401;
  checkGame = 4;
  isStarted = true;
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col, mineNum);
}
function customGame(){
  rowNum = document.getElementById("row").value;
  colNum = document.getElementById("col").value;
  mineNumber = document.getElementById("mineNum").value;
  const row = parseInt(rowNum);
  const col = parseInt(colNum);
  const mineNum = parseInt(mineNumber);
  checkGame = 5;
  isStarted = true;
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col, mineNum);
}
//start game

//reset
function reset(){
  document.getElementById("dizzy").style.zIndex = 1; 
  document.getElementById("sunglasses").style.zIndex = 1; 
  stopTimer();
  startTimer();
  isGameOver = false;
  if (isStarted){
  if (checkGame === 1){
    easyGame();
  }
  else if (checkGame === 2){
    midGame();
  }
  else if (checkGame === 3){
    hardGame();
  }
  else if (checkGame === 4){
    chalGame();
  }
  else{
    customGame();
  }
}
}
//reset

// set timer
function startTimer() {
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
}


function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsedTime = Math.floor((currentTime - startTime) / 1000); // 경과 시간(초)
  
  document.getElementById("timer").textContent = `Time: ${elapsedTime}`;
}


function stopTimer() {
  clearInterval(timerInterval);
}
//set timer



// set elements
function makeBoard(rowNum, colNum) {
  let tableEle;
  tableEle += '<table>';

  for (let i = 0; i < colNum; i++) {
    tableEle += '<tr>';
    for (let j = 0; j < rowNum; j++) {
      tableEle += '<td></td>'
    }
    tableEle += '</tr>';
  }
  tableEle += '</table>';
  document.getElementById("gameBoard").innerHTML = tableEle;
}  


function setMinePositions(mineNum, totalCells) {
  minePositions = [];

  while (minePositions.length < mineNum) {
    const randomPosition = Math.floor(Math.random() * totalCells);
    if (!minePositions.includes(randomPosition)) {
      minePositions.push(randomPosition);
    }
  }
}



//during game
function openEmptyCells(row, col, rowNum, colNum) {
  if (row < 0 || row >= rowNum || col < 0 || col >= colNum) {
    return; // 범위를 벗어나면 종료
  }

  const index = row * colNum + col;
  const cell = document.querySelectorAll("#gameBoard td")[index];
  
  if (cell.classList.contains('open') || flaggedCells.includes(index)) {
    return; // 이미 열린 셀이거나 깃발이 세워진 셀이면 종료
  }

  cell.classList.add('open'); // 셀 열기
cell.style.backgroundColor = "rgb(30, 44, 90)";
  const nearbyMines = countNearbyMines(row, col, rowNum, colNum);
  if (nearbyMines === 0) {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        openEmptyCells(row + i, col + j, rowNum, colNum);
         // 주변 셀도 연쇄적으로 열기
      }
    }
  } else {
    cell.textContent = nearbyMines;
  }
}


toggleButton.addEventListener("click", function () {
  // 토글 상태 변경
  isToggled = !isToggled;
  if (isGameOver){
    return ;
  }
  // 토글 상태에 따라 버튼 텍스트 변경
  if (isToggled) {
    toggleButton.style.backgroundColor = "rgb(30, 44, 90)";
  } else {
    toggleButton.style.backgroundColor = "rgb(7, 19, 59)";
  }
});


function displayMinesOnBoard(rowNum, colNum, mineNum){
  const cells = document.querySelectorAll("#gameBoard td");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / rowNum);
    const col = index % rowNum;

    if (minePositions.includes(index)) {
      cell.classList.add('mine');
      if (!timerInterval) {
        startTimer(); // 타이머 시작
      }
    }

    cell.addEventListener('click', () => {
      if (isGameOver){
        return ;
      }
      if (minePositions.includes(index)) {
        //toggle
        if (isToggled) {
          // 깃발 모드일 때
          if (flaggedCells.includes(index)) {
            flaggedCells = flaggedCells.filter(item => item !== index);
            cell.textContent = '';
          } else {
            flaggedCells.push(index);
            cell.textContent = '🚩'; // Show flag icon
          }
          updateRemainingMinesCount(mineNum);
        }
        //toggle
        else{
        document.getElementById("timer").textContent = "Game Over"
        displayAllMines();
        document.getElementById("dizzy").style.zIndex = 99; 
        stopTimer();
        isGameOver = true;
      }
    } else {
        //toggle
        if (isToggled) {
          // 깃발 모드일 때
          if (flaggedCells.includes(index)) {
            flaggedCells = flaggedCells.filter(item => item !== index);
            cell.textContent = '';
          } else {
            flaggedCells.push(index);
            cell.textContent = '🚩'; // Show flag icon
          }
          updateRemainingMinesCount(mineNum);
        }
        //toggle
        else{
        openEmptyCells(row, col, rowNum, colNum); // 연쇄적으로 열기
        const nearbyMines = countNearbyMines(row, col, rowNum, colNum);
        cell.textContent = nearbyMines > 0 ? nearbyMines : '0';
        cell.style.backgroundColor = "rgb(30, 44, 90)";
        document.getElementById("star").style.zIndex = 5; 
        setTimeout(() => {
          document.getElementById("star").style.zIndex = 1; 
        }, 200);
      }
      if (!minePositions.includes(index)) {
        cell.classList.add('open');
        checkWin(rowNum, colNum); // Check for win condition
      }}
    });
  
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault(); // 우클릭 메뉴 띄우지 않도록 막음
      if (isGameOver){
        return ;
      }
      if (flaggedCells.includes(index)) {
        flaggedCells = flaggedCells.filter(item => item !== index);
        cell.textContent = '';
      } else {
        flaggedCells.push(index);
        cell.textContent = '🚩'; // Show flag icon
      }
      updateRemainingMinesCount(mineNum);
    });

  });
  
}


function countNearbyMines(row, col, rowNum, colNum) {
  let count = 0;
  
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      
      if (newRow >= 0 && newRow < rowNum && newCol >= 0 && newCol < colNum) {
        const index = newRow * rowNum + newCol;
        if (minePositions.includes(index)) {
          count++;
        }
      }
      else{
        
      }
    }
  }
  
  return count;
}


function revealAllCells(rowNum, colNum) {
  const cells = document.querySelectorAll("#gameBoard td");
  cells.forEach((cell, index) => {
    const row = Math.floor(index / rowNum);
    const col = index % rowNum;

    if (!minePositions.includes(index)) {
      const nearbyMines = countNearbyMines(row, col, rowNum, colNum);
      cell.textContent = nearbyMines > 0 ? nearbyMines : '0';

    }
  });
}


function updateRemainingMinesCount(mineNum) {
  const flaggedCount = flaggedCells.length;
  const remainingMines = mineNum - flaggedCount;
  document.getElementById("remainingMines").textContent = `Remaining Mines: ${remainingMines}`;
}
//during game


//end
function checkWin(rowNum, colNum) {
  const cells = document.querySelectorAll("#gameBoard td");
  let remainingSafeCells = 0;

  cells.forEach((cell, index) => {
    if (!minePositions.includes(index) && !cell.classList.contains('open')) {
      remainingSafeCells++;
    }
  });

  if (remainingSafeCells === 0) {
    revealAllCells(rowNum, colNum);
    getTime = document.getElementById("timer").innerHTML;
    document.getElementById("timer").textContent = getTime + " seconds"
    document.getElementById("sunglasses").style.zIndex = 100; 
    stopTimer();
    displayAllMines();
    isGameOver = true;
  }
}


function displayAllMines() {
  const cells = document.querySelectorAll("#gameBoard td");
  cells.forEach((cell, index) => {
    if (minePositions.includes(index)) {
      cell.textContent = '💣'; // Show mine icon
      cell.style.backgroundColor = "rgb(255, 25, 25)"
    }
  });
}
//end





