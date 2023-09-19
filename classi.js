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

const pawnImageLink = "https://upload.wikimedia.org/wikipedia/commons/2/2f/Tux_Classic_flat_look_3D.svg";

function getImageSrcByIndex(x, y) {
    return "http://www.lunapic.com/editor/premade/transparent.gif"
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
        this.imageSrc = pawnImageLink //getImageSrcByIndex(x, y)
        this.alive = true
    }

    drawOnCanvas(ctx) {
        const image = new Image();
        const x = this.x * cellSize + sidedGap;
        const y = this.y * cellSize + sidedGap;
        image.onload=function(){
            ctx.drawImage(image, x, y, pieceSize, pieceSize);
        };
        image.src=this.imageSrc;
    }
}

class Scacchiera {
    constructor() {
        this.pieces = [];
        this.scacc = [];
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
            const team = (i+j)%2 ? 'black' : 'white';
            this.scacc[i * 8 + j] = new Casella(j * cellSize, i * cellSize, team);
            this.scacc[i * 8 + j].defaultColor = team;
            this.scacc[i * 8 + j].setStatus('hold');
          }
        }

        for(let col = 1; col < 8; col += 5) {
            for(let row = 0; row < 8; row++) {
                this.pieces.push(new Pezzo(row, col, row < 4 ? 'black' : 'white'));
            }
        }
        [0, 7].forEach(col => {
            for(let row = 0; row < 8; row++) {
                this.pieces.push(new Pezzo(row, col, row < 4 ? 'black' : 'white'))
            }
        })
    }
}