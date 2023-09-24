const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const piecesCanvas = document.getElementById('pieces');
const pCtx = piecesCanvas.getContext("2d");

const coverCanvas = document.getElementById('overBoard');
const cCtx = coverCanvas.getContext("2d");

const scacc = new Scacchiera();
scacc.setup();
const cboard = new boardcover();

let lastCellClicked = null;


function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

sleep(60).then(_ => draw())

function drawBoard() {
    // SCACCHIERA
    scacc.scacc.forEach(casella => {
        ctx.fillStyle = casella.c;
        ctx.fillRect(casella.x, casella.y, cellSize, cellSize);
    });
}

function drawPieces() {
  pCtx.clearRect(0, 0, size, size);
  scacc.pieces.forEach(function (piece) {
    if (piece.alive == true) piece.drawOnCanvas(pCtx);
  });
}

function draw() {
    drawBoard();
    drawPieces();
}
  
function mouseClicked(e, scacc){
    const currentCell = scacc.getCell(e.clientX, e.clientY);
    const currentClikedPiece = scacc.getPieceByCell(currentCell);
    if (lastCellClicked == null){
      if (currentClikedPiece){
        cboard.calculateTrajectory(currentClikedPiece);
        lastCellClicked = currentCell;
        currentCell.c = 'green';
        currentCell.setStatus('clicked');
        drawBoard()
        return;
      } else return;
    }
    newCellClicked = scacc.getCell(e.clientX, e.clientY);
    if (areEqual(newCellClicked, lastCellClicked)) {
      // CLICCATO 2 VOLTE SULLO STESSO ELEMENTO
      newCellClicked.setStatus('hover');
      newCellClicked.c = 'brown';
      cboard.coverClear();
      lastCellClicked = null;
      newCellClicked = null;
      drawBoard()
      return;
    } else {
      // TODO: caso clicco su un altra cella
      //console.log(scacc.getPieceByCell(lastCellClicked));
      if (scacc.getPieceByCell(lastCellClicked) != null){
        scacc.getPieceByCell(lastCellClicked).move(newCellClicked)
        cboard.coverClear();
        lastCellClicked.setStatus('hold');
        lastCellClicked.c = lastCellClicked.defaultColor;
        lastCellClicked = null;
        newCellClicked = null;
        //console.log(lastCellClicked, scacc.getPieceByCell(lastCellClicked));
      }
      drawBoard();
    }
}
  
function getPressedPiece(x, y){
  for(let i = 0; i < 16; i++){
    if ((blackTeam[i].x - sidedGap)/ cellSize == x && (blackTeam[i].y - sidedGap)/ cellSize == y){
      ret = ['black', itoPiece(i), i];
      return ret;
    }
    if ((whiteTeam[i].x - sidedGap)/ cellSize == x && (whiteTeam[i].y - sidedGap)/ cellSize == y){
      ret = ['white', itoPiece(i), i];
      return ret;
    }
  }
  return null;
}

function itoPiece(i){
  // PEZZI 0,7 Torre 1,6 Cavallo 2,5 Alfiere 3Regina 4Re 8-15 Pedoni
  if (i == 0 || i == 7) { return 'Torre'}
  else if (i == 1 || i == 6) { return 'Cavallo'}
  else if (i == 2 || i == 5) { return 'Alfiere'}
  else if (i == 3) {return 'Regina'}
  else if (i == 4) {return 'Re'}
  else if (i > 7 && i < 16) {return 'Pedone'}
  else {return 'ERRORE'}
}

window.onmousemove = e => hoverEvent(e, scacc);
document.querySelector("#pieces").onclick = e => mouseClicked(e, scacc)
