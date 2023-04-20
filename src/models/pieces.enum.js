export const PIECES = {
    KING: {
        name: "king",
        moves: [
            {x:0, y:1},
            {x:0, y:-1},
            {x:1, y:0},
            {x:-1, y:0},
            {x:1, y:1},
            {x:1, y:-1},
            {x:-1, y:1},
            {x:-1, y:-1}
        ],
        value: 100
    },
    QUEEN: {
        name: "queen",
        moves: [
            {x:0, y:1},
            {x:0, y:-1},
            {x:1, y:0},
            {x:-1, y:0},
            {x:1, y:1},
            {x:1, y:-1},
            {x:-1, y:1},
            {x:-1, y:-1}
        ],
        value: 9
    },
    PAWN: {
        name: "pawn",
        moves: [
            {x:0, y:1},
            {x:0, y:2},
            {x:1, y:1},
            {x:-1, y:1}
        ],
        value: 1
    },
    KNIGHT: {
        name: "knight",
        moves: [
            {x:1, y:2},
            {x:2, y:1},
            {x:2, y:-1},
            {x:1, y:-2},
            {x:-1, y:-2},
            {x:-2, y:-1},
            {x:-2, y:1},
            {x:-1, y:2}
        ],
        value: 3
    },
    ROOK: {
        name: "rook",
        moves: [
            {x:0, y:1},
            {x:0, y:-1},
            {x:1, y:0},
            {x:-1, y:0}
        ],
        value: 5
    },
    BISHOP: {
        name: "bishop",
        moves: [
            {x:1, y:1},
            {x:1, y:-1},
            {x:-1, y:1},
            {x:-1, y:-1}
        ],
        value: 3
    }
}