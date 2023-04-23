import { COLS } from "../models/board.enum"
import { Piece } from "../models/piece.class"
import { PIECES } from "../models/pieces.enum"

export const initialTeam = (color) => {
    const pawns = Array(COLS).fill(0).map((col, i) => new Piece(PIECES.PAWN, color, { x: i, y: color === "white" ? 6 : 1 }))
    const rooks = [new Piece(PIECES.ROOK, color, { x: 0, y: color === "white" ? 7 : 0 }), new Piece(PIECES.ROOK, color, { x: 7, y: color === "white" ? 7 : 0 })]
    const knights = [new Piece(PIECES.KNIGHT, color, { x: 1, y: color === "white" ? 7 : 0 }), new Piece(PIECES.KNIGHT, color, { x: 6, y: color === "white" ? 7 : 0 })]
    const bishops = [new Piece(PIECES.BISHOP, color, { x: 2, y: color === "white" ? 7 : 0 }), new Piece(PIECES.BISHOP, color, { x: 5, y: color === "white" ? 7 : 0 })]
    const queen = [new Piece(PIECES.QUEEN, color, { x: 3, y: color === "white" ? 7 : 0 })]
    const king = [new Piece(PIECES.KING, color, { x: 4, y: color === "white" ? 7 : 0 })]

    return [...pawns, ...rooks, ...knights, ...bishops, ...queen, ...king]
}

export const organizeBoard = (pieces, board) => {
    return board.map((row, i) => row.map((col, j) => {
        const piece = pieces.find(piece => piece.position.x === j && piece.position.y === i)
        if (piece && piece.active) {
            return piece
        } else {
            return ""
        }
    }))
}

const possibleDestiny = (piece, board) => {
    const { x, y } = piece.position
    const possibleMoves = piece.moves
    const possibleDestination = possibleMoves.map(move => ({ x: x + move.x, y: y + move.y }))
    return possibleDestination.filter(position => {
        const { x, y } = position
        if (x >= 0 && x < COLS && y >= 0 && y < COLS) {
            const p = board[y][x]
            if (p && p.color === piece.color) {
                return false
            } else {
                return true
            }
        }
        return false
    })
}

const possiblePawnDestiny = (piece, board) => {
    const { x, y } = piece.position
    let possibleMoves = piece.moves
    if (y !== 1 && y !== 6) {
        possibleMoves.shift({ x: 0, y: 2 })
    }
    if (piece.color === "white") {
        possibleMoves = possibleMoves.map(move => ({ x: move.x, y: -move.y }))
    }
    return possibleMoves.reduce((acc, move) => {
        if (move.x === 0) {
            const p = board[y + move.y][x + move.x]
            if (!p) {
                return acc.concat({ x: x + move.x, y: y + move.y })
            }
            return acc
        } else { //! Hay un error cuando seleccionas un peo y luego el de al lado, aparece una casilla en diagonal
            const p = board[y + move.y][x + move.x]
            if (p && p.color !== piece.color) {
                return acc.concat({ x: x + move.x, y: y + move.y })
            }
            return acc
        }
    }
    , [])
}

export const movePiece = (piece, position, board) => {
    const { x, y } = piece.position
    const possibleDestination = piece.name === PIECES.PAWN.name ? possiblePawnDestiny(piece, board) : possibleDestiny(piece, board)
    if (possibleDestination.includes(position)) {
        const newBoard = board.map((row, i) => row.map((col, j) => {
            if (i === position.y && j === position.x) {
                return piece
            } else if (i === y && j === x) {
                return ""
            } else {
                return col
            }
        }))
        return newBoard
    }
    console.log("Movimiento no permitido")
    return board
}

export const showPossibleMoves = (piece, board) => {
    const possibleDestination = piece.name === PIECES.PAWN.name ? possiblePawnDestiny(piece, board) : possibleDestiny(piece, board)
    const newBoard = board.map((row, i) => row.map((col, j) => {
        if (possibleDestination.some(position => position.x === j && position.y === i)) {
            if (typeof col === "string") return "X"
            else {
                col.show = true
                return col
            }
        }
        if (typeof col === "string") return ""
        else {
            col.show = false
            return col
        }
    }))
    return newBoard
}
