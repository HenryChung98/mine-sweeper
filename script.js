tdArr = document.getElementsByTagName("td");
const COLOR = ["red", "skyblue", "olive", "green", "blue", "purple", "brown", "black"];
let minePositions = [];
let flaggedCells = [];
let startTime; // 변수를 선언하여 시작 시간 저장
let timerInterval; // setInterval을 사용하여 시간 업데이트를 처리하기 위한 변수

function easyGame() {
  const row = 9;
  const col = 9;
  const mineNum = 10;
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col, mineNum);

}
function midGame() {
  const row = 16;
  const col = 16;
  const mineNum = 40;
    
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col, mineNum);

}
function hardGame() {
  const row = 30;
  const col = 16;
  const mineNum = 99;
    
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, co, mineNum);

}
function chalGame() {
  const row = 59;
  const col = 59;
  const mineNum = 1500;
    
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

  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col, mineNum);
  
}


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
      if (minePositions.includes(index)) {
        alert('Game Over');
        displayAllMines();
        document.getElementById("dizzy").style.zIndex = 99; 
        stopTimer();
      } else {
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
      }
    });
  
    cell.addEventListener('contextmenu', (event) => {
      event.preventDefault(); // 우클릭 메뉴 띄우지 않도록 막음
  
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
    // alert('You Win!\n' + getTime + ' seconds');
    document.getElementById("sunglasses").style.zIndex = 100; 
    stopTimer();
    displayAllMines();
  }
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


function displayAllMines() {
  const cells = document.querySelectorAll("#gameBoard td");
  cells.forEach((cell, index) => {
    if (minePositions.includes(index)) {
      cell.textContent = '💣'; // Show mine icon
      cell.style.backgroundColor = "rgb(255, 25, 25)"
    }
  });
}

function startGame(row, col, mineNum) {
  makeBoard(row, col);
  setMinePositions(mineNum, row * col);
  displayMinesOnBoard(row, col);
}

function updateRemainingMinesCount(mineNum) {
  const flaggedCount = flaggedCells.length;
  const remainingMines = mineNum - flaggedCount;
  document.getElementById("remainingMines").textContent = `Remaining Mines: ${remainingMines}`;
}

// ... (기타 함수들)

// function reset() {
//   // 초기화 코드 작성
//   document.body.style.backgroundColor = ''; // 배경색 초기화
//   document.getElementById("timer").textContent = 'Time: 0'; // 타이머 초기화
//   minePositions = []; // 폭탄 위치 초기화
//   clearInterval(timerInterval); // 타이머 멈추기
//   timerInterval = null;
//   startTime = null;

//   const cells = document.querySelectorAll("#gameBoard td");
//   cells.forEach(cell => {
//     cell.textContent = ''; // 셀 내용 초기화
//     cell.style.backgroundColor = ''; // 셀 배경색 초기화
//     cell.classList.remove('open', 'mine'); // 클래스 초기화
//   });
//   startGame(row, col, mineNum);
// }