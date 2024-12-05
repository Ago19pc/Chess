class Casella {
    constructor(x, y, c){
        this.x = x;
        this.y = y;
        this.c = c;
    }

    getStatus(){
        return this.status;
    }
    setStatus(status){
        this.status = status;
    }
}


const trajectoryColor = 'rgba(80, 200, 30, 0.2)';

const blackPawnLink = "./IMAGES/blackpawn.png"
const whitePawnLink = "./IMAGES/whitepawn.png";
const whiteTowerLink = "./IMAGES/whiterook.png"
const blackTowerLink = "./IMAGES/blackrook.png"
const whiteBishopLink = "./IMAGES/whitebishop.png"
const blackBishopLink = "./IMAGES/blackbishop.png"
const whiteHorseLink = "./IMAGES/whitehorse.png"
const blackHorseLink = "./IMAGES/blackhorse.png"
const whiteKingLink = "./IMAGES/whiteking.png"
const blackKingLink = "./IMAGES/blackking.png"
const blackQueenLink = "./IMAGES/blackqueen.png"
const whiteQueenLink = "./IMAGES/whitequeen.png"


function getPieceNameByIndex(x, y) {
    if(y == 1 || y == 6) return "pawn";
    if(y != 0 && y != 7) throw new Error('y invalid!');

    switch(x) {
        case 0:
        case 7:
            return "tower"
        case 1:
        case 6:
            return "horse"
        case 2:
        case 5:
            return "bishop"
        case 3:
            return "queen"
        case 4:
            return "king"
        default:
            throw new Error('Unexpected input! ' + x)
    }
}

class Pezzo {
    constructor(x, y, team){
        this.x = x;
        this.y = y;
        this.team = team
        this.name = getPieceNameByIndex(x, y)
        if (this.name == 'pawn'){ this.team == 'white' ? this.imageSrc = whitePawnLink : this.imageSrc = blackPawnLink }
        else if (this.name == 'tower'){ this.team == 'white' ? this.imageSrc = whiteTowerLink : this.imageSrc = blackTowerLink, this.arrocco = true }
        else if (this.name == 'bishop'){ this.team == 'white' ? this.imageSrc = whiteBishopLink : this.imageSrc = blackBishopLink }
        else if (this.name == 'horse'){ this.team == 'white' ? this.imageSrc = whiteHorseLink : this.imageSrc = blackHorseLink }
        else if (this.name == 'queen'){ this.team == 'white' ? this.imageSrc = whiteQueenLink : this.imageSrc = blackQueenLink }
        else if (this.name == 'king'){ this.team == 'white' ? this.imageSrc = whiteKingLink : this.imageSrc = blackKingLink; this.arrocco = true }
        this.image = document.createElement('img')
        this.image.src=this.imageSrc;
        this.alive = true
    }

    drawOnCanvas(ctx) {
        if (this.alive == 1){
            const x = this.x * cellSize + sidedGap;
            const y = this.y * cellSize + sidedGap;
            pCtx.drawImage(this.image, x, y, pieceSize, pieceSize);
        }
    }

    showPossibleMoves(){
        if (this.name == 'pawn'){
            if (this.team == 'white'){
                // PEDONE BIANCO

            } else {
                // PEDONE NERO
            }
        }
    }

    clearDrawAndMove(newCell){
        let p = scacc.getPieceByCell(newCell);
        // MANGIARE
        if (p != null){
            p.alive = false;
            p.x = 8 * size;
            p.y = 8 * size;
        }
        pCtx.clearRect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
        pCtx.clearRect(newCell.x, newCell.y, cellSize, cellSize);
        this.x = newCell.x / cellSize;
        this.y = newCell.y / cellSize;
        this.drawOnCanvas(pCtx);
    }

    move(newCell){
        cboard.toDraw.forEach(e => {
            if (this.name == 'king' && newCell.x == e.x && newCell.y == e.y){ // SE E IL RE
                if (newCell.y / cellSize == this.y && (newCell.x / cellSize == this.x + 2 || newCell.x / cellSize == this.x - 2)){ // SI STA SPOSTANDO DI 2

                    if (e.x / cellSize == this.x + 2){
                        // ARROCCO DX
                        scacc.getPieceByCoords(7, this.y).clearDrawAndMove(scacc.getCell(5 * cellSize, this.y * cellSize));
                    } else if (e.x / cellSize == this.x - 2){
                        // ARROCCO SX
                        scacc.getPieceByCoords(0, this.y).clearDrawAndMove(scacc.getCell(3 * cellSize, this.y * cellSize));;
                    }
                }
            }
            if (newCell.x == e.x  && newCell.y == e.y) {
                this.clearDrawAndMove(newCell);
                if (this.arrocco && this.arrocco == true) this.arrocco = false;
            }
        })
    }
    
}

class Scacchiera {
    constructor() {
        this.pieces = [];
        this.scacc = [];
    }

    resetPieces(){
        for (let i = 0; i < 32; i++){
            this.pieces[i].alive = true;
            if (i < 8){
                this.pieces[i].y = 1;
                this.pieces[i].x = i;
            }
            else if (i < 16){
                this.pieces[i].y = 6;
                this.pieces[i].x = i - 8;
            } else if (i < 24){
                this.pieces[i].y = 0;
                this.pieces[i].x = i - 16;
            } else {
                this.pieces[i].y = 7;
                this.pieces[i].x = i - 24;
            }
            this.pieces[i].arrocco = true;
        }
        drawPieces();

    }

    getCell(x, y){
        return this.scacc.find(e => {
            return e.y - y < cellSize && e.y - y > -cellSize && e.x - x < cellSize && e.x - x > -cellSize;
        });
    }

    setup() {
        // SCACCHIERA
        for(let i = 0; i < 8; i++){
          for(let j = 0; j < 8; j++){
            const team = (i+j)%2 ? '#777' : '#ba956c';
            this.scacc[i * 8 + j] = new Casella(j * cellSize, i * cellSize, team);
            this.scacc[i * 8 + j].defaultColor = team;
            this.scacc[i * 8 + j].setStatus('hold');
          }
        }

        for(let col = 1; col < 8; col += 5) {
            for(let row = 0; row < 8; row++) {
                this.pieces.push(new Pezzo(row, col, col < 4 ? 'black' : 'white'));
            }
        }
        [0, 7].forEach(col => {
            for(let row = 0; row < 8; row++) {
                this.pieces.push(new Pezzo(row, col, col < 4 ? 'black' : 'white'))
            }
        })
    }

    getPieceByCell(cell){
        for (let i = 0; i < 32; i++){
            if (this.pieces[i].x == cell.x / cellSize && this.pieces[i].y == cell.y / cellSize) {
                return this.pieces[i];
            }
        }
        return null;
    }

    getPieceByCoords(x, y){
        if (x < 0 || x > 7 || y < 0 || y > 7) return null;
        for(let i = 0; i < 32; i++){
            if (this.pieces[i].x == x && this.pieces[i].y == y) return this.pieces[i];
        }
        return null;
    }
}

class boardcover {
    constructor(){
        this.toDraw = [];    
        
    }

    coverDraw(){
        cCtx.clearRect(0, 0, size, size);
        this.toDraw.forEach(e => {
            cCtx.fillStyle = e.c;
            cCtx.fillRect(e.x, e.y, cellSize, cellSize);
        })
    }

    coverClear(){
        cCtx.clearRect(0, 0, size, size);
        this.toDraw = [];
    }

    calculateTrajectory(piece){
        this.toDraw = [];
        switch (piece.name) {
            case 'pawn':
                this.calculateTrajectoryPawn(piece);
                break;
            case 'tower':
                this.calculateTrajectoryTower(piece)
                break;
            case 'bishop':
                this.calculateTrajectoryBishop(piece);
                break;
            case 'horse':
                this.calculateTrajectoryHorse(piece);
                break;
            case 'queen':
                this.calculateTrajectoryBishop(piece);
                this.calculateTrajectoryTower(piece);
                break;
            case 'king':
                this.calculateTrajectoryKing(piece);
                break;
            default:
                console.log('ERROR: Calculate Trajectory, invalid piece_name');
        }
        this.coverDraw();

    }
    
    calculateTrajectoryPawn(piece){

        if (piece.team == 'white'){
            if (piece.y == 6){
                // PEDONE BIANCO PUO AVANZARE DI 2
                if (scacc.getPieceByCoords(piece.x, piece.y - 1) == null){
                    // AVANTI DI 1 E' LIBERO
                    this.toDraw.push(new Casella(piece.x * cellSize, (piece.y - 1) * cellSize, trajectoryColor))
                    if (scacc.getPieceByCoords(piece.x, piece.y - 2) == null){
                        // AVANTI DI 2 E' LIBERO
                        this.toDraw.push(new Casella(piece.x * cellSize, (piece.y-2) * cellSize))
                    }
                }
            } else {
                // PEDONE BIANCO PUO AVANZARE DI 1
                if (scacc.getPieceByCoords(piece.x, piece.y - 1) == null){
                    // AVANTI E' LIBERO
                    this.toDraw.push(new Casella(piece.x * cellSize, (piece.y - 1) * cellSize, trajectoryColor))
                }
            }

            // PASSO DIAGONALE
            let leftie = scacc.getPieceByCoords(piece.x - 1, piece.y - 1);
            let rightie = scacc.getPieceByCoords(piece.x + 1, piece.y - 1);
            if (leftie != null && leftie.team == 'black' && leftie.alive == true){
                this.toDraw.push(new Casella( (piece.x - 1) * cellSize, (piece.y - 1) * cellSize, trajectoryColor))
            }
            if (rightie != null && rightie.team == 'black' && rightie.alive == true){
                this.toDraw.push(new Casella( (piece.x + 1) * cellSize, (piece.y - 1) * cellSize, trajectoryColor))
            }

        } else {
                // PEDONE NERO
                if (piece.y == 1){
                    // PEDONE NERO PUO AVANZARE DI 2
                    if (scacc.getPieceByCoords(piece.x, piece.y + 1) == null){
                        // AVANTI DI 1 E' LIBERO
                        this.toDraw.push(new Casella(piece.x * cellSize, (piece.y + 1) * cellSize, trajectoryColor))
                        if (scacc.getPieceByCoords(piece.x, piece.y + 2) == null){
                            // AVANTI DI 2 E' LIBERO
                            this.toDraw.push(new Casella(piece.x * cellSize, (piece.y+2) * cellSize))
                        }
                    }
                } else {
                    // PEDONE NERO PUO AVANZARE DI 1
                    if (scacc.getPieceByCoords(piece.x, piece.y + 1) == null){
                        // AVANTI E' LIBERO
                        this.toDraw.push(new Casella(piece.x * cellSize, (piece.y + 1) * cellSize, trajectoryColor))
                    }
                }
    
                // PASSO DIAGONALE
                let leftie = scacc.getPieceByCoords(piece.x - 1, piece.y + 1);
                let rightie = scacc.getPieceByCoords(piece.x + 1, piece.y + 1);
                if (leftie != null && leftie.team == 'white' && leftie.alive == true){
                    this.toDraw.push(new Casella( (piece.x - 1) * cellSize, (piece.y + 1) * cellSize, trajectoryColor))
                }
                if (rightie != null && rightie.team == 'white' && rightie.alive == true){
                    this.toDraw.push(new Casella( (piece.x + 1) * cellSize, (piece.y + 1) * cellSize, trajectoryColor))
                }

        }

    }

    calculateTrajectoryHorse(piece){
        // 8 possibili posizioni
        let toCheck = scacc.getPieceByCoords(piece.x - 1, piece.y - 2)
        if (toCheck == null || toCheck.team != piece.team) this.toDraw.push(new Casella((piece.x - 1) * cellSize, (piece.y - 2) * cellSize, trajectoryColor));
        toCheck = scacc.getPieceByCoords(piece.x + 1, piece.y - 2);
        if (toCheck == null || toCheck.team != piece.team) this.toDraw.push(new Casella((piece.x + 1) * cellSize, (piece.y - 2) * cellSize, trajectoryColor));

        toCheck = scacc.getPieceByCoords(piece.x - 2, piece.y - 1);
        if (toCheck == null || toCheck.team != piece.team) this.toDraw.push(new Casella((piece.x - 2) * cellSize, (piece.y  - 1) * cellSize, trajectoryColor));
        toCheck = scacc.getPieceByCoords(piece.x + 2, piece.y - 1);
        if (toCheck == null || toCheck.team != piece.team) this.toDraw.push(new Casella((piece.x + 2) * cellSize, (piece.y - 1) * cellSize, trajectoryColor));

        toCheck = scacc.getPieceByCoords(piece.x - 2, piece.y + 1);
        if (toCheck == null || toCheck.team != piece.team) this.toDraw.push(new Casella((piece.x - 2) * cellSize, (piece.y + 1) * cellSize, trajectoryColor));
        toCheck = scacc.getPieceByCoords(piece.x + 2, piece.y + 1);
        if (toCheck == null || toCheck.team != piece.team) this.toDraw.push(new Casella((piece.x + 2) * cellSize, (piece.y + 1) * cellSize, trajectoryColor));

        toCheck = scacc.getPieceByCoords(piece.x - 1, piece.y + 2);
        if (toCheck == null || toCheck.team != piece.team) this.toDraw.push(new Casella((piece.x - 1) * cellSize, (piece.y + 2) * cellSize, trajectoryColor));
        toCheck = scacc.getPieceByCoords(piece.x + 1, piece.y + 2);
        if (toCheck == null || toCheck.team != piece.team) this.toDraw.push(new Casella((piece.x + 1) * cellSize, (piece.y + 2) * cellSize, trajectoryColor));
    }

    calculateTrajectoryTower(piece){
        // UP
        let Offset = 1;
        while (piece.y - Offset >= 0 && scacc.getPieceByCoords(piece.x, piece.y - Offset) == null){
            this.toDraw.push(new Casella(piece.x * cellSize, (piece.y - Offset) * cellSize, trajectoryColor));
            Offset++;
        }
        if (piece.y - Offset >= 0 && scacc.getPieceByCoords(piece.x, piece.y - Offset) != null && scacc.getPieceByCoords(piece.x, piece.y - Offset).team != piece.team){
            this.toDraw.push(new Casella(piece.x * cellSize, (piece.y - Offset) * cellSize, trajectoryColor));
        }
        // DOWN
        Offset = 1;
        while (piece.y + Offset <= 7 && scacc.getPieceByCoords(piece.x, piece.y + Offset) == null){
            this.toDraw.push(new Casella(piece.x * cellSize, (piece.y + Offset) * cellSize, trajectoryColor));
            Offset++;
        }
        if (piece.y + Offset <= 7 && scacc.getPieceByCoords(piece.x, piece.y + Offset) != null && scacc.getPieceByCoords(piece.x, piece.y + Offset).team != piece.team){
            this.toDraw.push(new Casella(piece.x * cellSize, (piece.y + Offset) * cellSize, trajectoryColor));
        }
        // LEFT
        Offset = 1;
        while (piece.x - Offset >= 0 && scacc.getPieceByCoords(piece.x - Offset, piece.y) == null){
            this.toDraw.push(new Casella((piece.x - Offset) * cellSize, piece.y * cellSize, trajectoryColor));
            Offset++;
        }
        if (piece.y - Offset >= 0 && scacc.getPieceByCoords(piece.x - Offset, piece.y) != null && scacc.getPieceByCoords(piece.x - Offset, piece.y).team != piece.team){
            this.toDraw.push(new Casella((piece.x - Offset) * cellSize, piece.y * cellSize, trajectoryColor));
        }
        // RIGHT
        Offset = 1;
        while (piece.x + Offset <= 7 && scacc.getPieceByCoords(piece.x + Offset, piece.y) == null){
            this.toDraw.push(new Casella((piece.x + Offset) * cellSize, piece.y * cellSize, trajectoryColor));
            Offset++;
        }
        if (piece.y - Offset <= 7 && scacc.getPieceByCoords(piece.x + Offset, piece.y) != null && scacc.getPieceByCoords(piece.x + Offset, piece.y).team != piece.team){
            this.toDraw.push(new Casella((piece.x + Offset) * cellSize, piece.y * cellSize, trajectoryColor));
        }
    }

    calculateTrajectoryBishop(piece){
        // ALTO SX
        let Offset = 1;
        while(piece.x - Offset >= 0 && piece.y - Offset >= 0 && scacc.getPieceByCoords(piece.x - Offset, piece.y - Offset) == null){
            this.toDraw.push(new Casella((piece.x - Offset) * cellSize, (piece.y - Offset) * cellSize, trajectoryColor));
            Offset++;
        } 
        if (piece.x - Offset >= 0 && piece.y - Offset >= 0 && scacc.getPieceByCoords(piece.x - Offset, piece.y - Offset) != null && scacc.getPieceByCoords(piece.x - Offset, piece.y - Offset).team != piece.team){
            this.toDraw.push(new Casella((piece.x - Offset) * cellSize, (piece.y - Offset) * cellSize, trajectoryColor));
        }

        // ALTO DX
        Offset = 1;
        while(piece.x + Offset <= 7 && piece.y - Offset >= 0 && scacc.getPieceByCoords(piece.x + Offset, piece.y - Offset) == null){
            this.toDraw.push(new Casella((piece.x + Offset) * cellSize, (piece.y - Offset) * cellSize, trajectoryColor));
            Offset++;
        } 
        if (piece.x + Offset <= 7 && piece.y - Offset >= 0 && scacc.getPieceByCoords(piece.x + Offset, piece.y - Offset) != null && scacc.getPieceByCoords(piece.x + Offset, piece.y - Offset).team != piece.team){
            this.toDraw.push(new Casella((piece.x + Offset) * cellSize, (piece.y - Offset) * cellSize, trajectoryColor));
        }
        // BASSO SX
        Offset = 1;
        while(piece.x - Offset >= 0 && piece.y + Offset <= 7 && scacc.getPieceByCoords(piece.x - Offset, piece.y + Offset) == null){
            this.toDraw.push(new Casella((piece.x - Offset) * cellSize, (piece.y + Offset) * cellSize, trajectoryColor));
            Offset++;
        } 
        if (piece.x - Offset >= 0 && piece.y + Offset <= 7 && scacc.getPieceByCoords(piece.x - Offset, piece.y + Offset) != null && scacc.getPieceByCoords(piece.x - Offset, piece.y + Offset).team != piece.team){
            this.toDraw.push(new Casella((piece.x - Offset) * cellSize, (piece.y + Offset) * cellSize, trajectoryColor));
        }
        // BASSO DX
        Offset = 1;
        while(piece.x + Offset <= 7 && piece.y + Offset <= 7 && scacc.getPieceByCoords(piece.x + Offset, piece.y + Offset) == null){
            this.toDraw.push(new Casella((piece.x + Offset) * cellSize, (piece.y + Offset) * cellSize, trajectoryColor));
            Offset++;
        } 
        if (piece.x + Offset <= 7 && piece.y + Offset <= 7 && scacc.getPieceByCoords(piece.x + Offset, piece.y + Offset) != null && scacc.getPieceByCoords(piece.x + Offset, piece.y + Offset).team != piece.team){
            this.toDraw.push(new Casella((piece.x + Offset) * cellSize, (piece.y + Offset) * cellSize, trajectoryColor));
        }
        
    }

    calculateTrajectoryKing(piece){
        if (piece.y - 1 >= 0){ // RIGA DI SOPRA
            if (piece.x - 1 >= 0){ // ALTO SX
                if (scacc.getPieceByCoords(piece.x - 1, piece.y - 1) == null || scacc.getPieceByCoords(piece.x - 1, piece.y - 1).team != piece.team){
                    this.toDraw.push(new Casella((piece.x - 1) * cellSize, (piece.y - 1) * cellSize, trajectoryColor));
                }
            }
            if (piece.x + 1 <= 7){ // ALTO DX
                if (scacc.getPieceByCoords(piece.x + 1, piece.y - 1) == null ||scacc.getPieceByCoords(piece.x + 1, piece.y - 1).team != piece.team){
                    this.toDraw.push(new Casella((piece.x + 1) * cellSize, (piece.y - 1) * cellSize, trajectoryColor));
                }
            }
            // ALTO CENTRO
            if (scacc.getPieceByCoords(piece.x, piece.y - 1) == null ||scacc.getPieceByCoords(piece.x, piece.y - 1).team != piece.team){
                this.toDraw.push(new Casella((piece.x) * cellSize, (piece.y - 1) * cellSize, trajectoryColor));
            }
        }
        if (piece.y + 1 <= 7){ // RIGA DI SOTTO

            if (piece.x - 1 >= 0){ // BASSO SX
                if (scacc.getPieceByCoords(piece.x - 1, piece.y + 1) == null ||scacc.getPieceByCoords(piece.x - 1, piece.y + 1).team != piece.team){
                    this.toDraw.push(new Casella((piece.x - 1) * cellSize, (piece.y + 1) * cellSize, trajectoryColor));
                }
            }
            if (piece.x + 1 <= 7){ // BASSO DX
                if (scacc.getPieceByCoords(piece.x + 1, piece.y + 1) == null ||scacc.getPieceByCoords(piece.x + 1, piece.y + 1).team != piece.team){
                    this.toDraw.push(new Casella((piece.x + 1) * cellSize, (piece.y + 1) * cellSize, trajectoryColor));
                }
            }
            // BASSO CENTRO
            if (scacc.getPieceByCoords(piece.x, piece.y + 1) == null ||scacc.getPieceByCoords(piece.x, piece.y + 1).team != piece.team){
                this.toDraw.push(new Casella((piece.x) * cellSize, (piece.y + 1) * cellSize, trajectoryColor));
            }
        }
        // RIGA CENTRALE
        // SX
        if (piece.x - 1 >= 0){
            if (scacc.getPieceByCoords(piece.x - 1, piece.y) == null || scacc.getPieceByCoords(piece.x - 1, piece.y).team != piece.team){
                this.toDraw.push(new Casella((piece.x - 1) * cellSize, piece.y * cellSize, trajectoryColor));
            }
        }
        // DX
        if (piece.x + 1 <= 7){
            if (scacc.getPieceByCoords(piece.x + 1, piece.y) == null || scacc.getPieceByCoords(piece.x + 1, piece.y).team != piece.team){
                this.toDraw.push(new Casella((piece.x + 1) * cellSize, piece.y * cellSize, trajectoryColor));
            }
        }
        // ARROCCO
        let rooks = [];
        if (piece.team == 'black') {
            rooks[0] = scacc.pieces[16];
            rooks[1] = scacc.pieces[23];
        } else {
            rooks[0] = scacc.pieces[24];
            rooks[1] = scacc.pieces[31];
        }
        // SX
        if (piece.arrocco == true && rooks[0].arrocco == true){
            let i = 1;
            while (scacc.getPieceByCoords(piece.x - i, piece.y) == null && piece.x - i >= 0){
                i++;
            }
            if (scacc.getPieceByCoords(0, piece.y) == rooks[0]){
                this.toDraw.push(new Casella((piece.x - 2) * cellSize, piece.y * cellSize, trajectoryColor));
            }
        }
        // DX
        if (piece.arrocco == true && rooks[1].arrocco == true){
            let i = 1;
            while (scacc.getPieceByCoords(piece.x + i, piece.y) == null && piece.x + i <= 7){
                i++;
            }
            if (scacc.getPieceByCoords(7, piece.y) == rooks[1]){
                this.toDraw.push(new Casella((piece.x + 2) * cellSize, piece.y * cellSize, trajectoryColor));
            }
        }
    }

}