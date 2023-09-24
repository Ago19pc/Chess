const size = 800;
const pieceSize = 80;
const sidedGap = ((size / 8) - pieceSize)/2;
const cellSize = size / 8;

function areEqual(e1, e2) {
    if(!e1 || !e2) return
    if (e1 instanceof Array && e2 instanceof Array) {
        return e1.every((e, i) => e2[i] == e);
    }
    return Object.keys(e1).every(key => {
        return e1[key] === e2[key]
    });
}

let formerCell = null;

function hoverEvent(e, scacchiera){
    const cell = scacchiera.getCell(e.clientX, e.clientY);
    if (cell == undefined) {return}
    
    if (!areEqual(formerCell, cell) && cell.c !== "green") {
        cell.c = 'brown';
        if(formerCell) {
            if (formerCell.getStatus() == 'hold' || formerCell.getStatus() == 'hover'){
                formerCell.setStatus('hold');    
                formerCell.c = formerCell.defaultColor
            }
        }
    }
    if (cell.c == 'green'){
        if(formerCell && formerCell.c !== 'green'){
            formerCell.c = formerCell.defaultColor;
        }
    }

    formerCell = cell;
    draw();
}