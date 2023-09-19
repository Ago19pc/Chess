const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");

const piecesCanvas = document.getElementById('pieces');
const pCtx = piecesCanvas.getContext("2d");

const scacc = new Scacchiera();
scacc.setup();

let lastCellClicked = null;

function drawBoard() {
    // SCACCHIERA
    scacc.scacc.forEach(casella => {
        ctx.fillStyle = casella.c;
        ctx.fillRect(casella.x, casella.y, 100, 100);
    });
}

function drawPieces() {
    scacc.pieces.forEach(function (piece) {
        piece.drawOnCanvas(pCtx);
    })
}

function draw() {
    drawBoard();
    drawPieces();
}
  
function mouseClicked(e, scacc){
    const currentCell = scacc.getCell(e.clientX, e.clientY);
    if (lastCellClicked == null){
      lastCellClicked = currentCell;
      currentCell.c = 'green';
      drawBoard()
      return;
    }
    newCellClicked = scacc.getCell(e.clientX, e.clientY);
    if (areEqual(newCellClicked, lastCellClicked)) {
      // CLICCATO 2 VOLTE SULLO STESSO ELEMENTO
      newCellClicked.c = currentCell.defaultColor;
      lastCellClicked = null;
      newCellClicked = null;
      drawBoard()
      return;
    } else {
      // TODO: caso clicco su un altra cella
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
window.onclick = e => mouseClicked(e, scacc)

draw();