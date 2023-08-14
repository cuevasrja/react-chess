import { COLS, EMPTY, SHOW, WHITE } from "../models/board.enum"
import { Piece } from "../models/piece.class"
import { PIECES } from "../models/pieces.enum"

export const initialTeam = (color) => {
    const pawns = Array(COLS).fill(0).map((col, i) => new Piece(PIECES.PAWN, color, { x: i, y: color === WHITE ? 6 : 1 }))
    const rooks = [new Piece(PIECES.ROOK, color, { x: 0, y: color === WHITE ? 7 : 0 }), new Piece(PIECES.ROOK, color, { x: 7, y: color === WHITE ? 7 : 0 })]
    const knights = [new Piece(PIECES.KNIGHT, color, { x: 1, y: color === WHITE ? 7 : 0 }), new Piece(PIECES.KNIGHT, color, { x: 6, y: color === WHITE ? 7 : 0 })]
    const bishops = [new Piece(PIECES.BISHOP, color, { x: 2, y: color === WHITE ? 7 : 0 }), new Piece(PIECES.BISHOP, color, { x: 5, y: color === WHITE ? 7 : 0 })]
    const queen = [new Piece(PIECES.QUEEN, color, { x: 3, y: color === WHITE ? 7 : 0 })]
    const king = [new Piece(PIECES.KING, color, { x: 4, y: color === WHITE ? 7 : 0 })]

    return [...pawns, ...rooks, ...knights, ...bishops, ...queen, ...king]
}

export const organizeBoard = (pieces, board) => {
    return board.map((row, i) => row.map((col, j) => {
        const piece = pieces.find(piece => piece.position.x === j && piece.position.y === i)
        return piece?.active ? piece : EMPTY
    }))
}

const longMoves = (piece, board) => {
    const { x, y } = piece.position
    const moves = piece.moves
    const possibleMoves = []
    moves.forEach(move => {
        let i = 1
        while (i < COLS && board[y + (move.y * i)]?.[x + (move.x * i)] !== undefined) {
            const p = board[y + (move.y * i)]?.[x + (move.x * i)]
            if (p && p.color === piece.color) {
                break
            } else if (p && p.color !== piece.color) {
                possibleMoves.push({ x: (move.x * i), y: (move.y * i) })
                break
            } else {
                possibleMoves.push({ x: (move.x * i), y: (move.y * i) })
            }
            i++
        }
    })
    return possibleMoves
}

const onBoard = position => {
    const { x, y } = position
    return x >= 0 && x < COLS && y >= 0 && y < COLS
}

const isPiece = (piece) => {
    return typeof piece !== "string"
}

const possibleCastling = (piece, board) => {
    if (piece.name !== PIECES.KING.name || piece.moved) return []
    const { x, y } = piece.position
    const possibleMoves = [{ x: 2, y: 0 }, { x: -2, y: 0 }]
    return possibleMoves.reduce((acc, move) => {
        if (!onBoard({ x: x + move.x, y: y + move.y })) return acc
        const midCells = board[y].slice(move.x > 0 ? x + 1 : 1, move.x > 0 ? COLS - 1 : x)
        const midCellsEmpty = midCells.every(cell => typeof cell === "string")
        const rookInBorder = board[y]?.[move.x > 0 ? 7 : 0]?.name === PIECES.ROOK.name
        const rook = board[y]?.[move.x > 0 ? 7 : 0]
        const rookAndKingNeverMoved = !(rook?.moved || piece.moved)
        const rookAndKingSameColor = rook?.color === piece.color
        return midCellsEmpty && rookInBorder && rookAndKingNeverMoved && rookAndKingSameColor ? acc.concat({ x: x + move.x, y: y + move.y }) : acc
    }, [])
}

const possibleDestiny = (piece, board) => {
    const { x, y } = piece?.position
    const possibleMoves = piece.name === PIECES.KING.name || piece.name === PIECES.KNIGHT.name
        ? piece.moves
        : longMoves(piece, board)
    const possibleDestination = possibleMoves.map(move => ({ x: x + move.x, y: y + move.y }))
    return possibleDestination.filter(position => {
        const { x, y } = position
        if (onBoard(position)) {
            const p = board[y][x]
            if (p && p.color === piece.color) {
                return false
            } else {
                return true
            }
        }
        return false
    }).concat(possibleCastling(piece, board))
}

const diagonalPawnMoves = (piece) => {
    return piece.color === WHITE ? [{ x: -1, y: -1 }, { x: 1, y: -1 }] : [{ x: -1, y: 1 }, { x: 1, y: 1 }]
}

const diagonalPawnDestiny = (piece, board) => {
    const { x, y } = piece.position
    const possibleMoves = diagonalPawnMoves(piece)
    return possibleMoves.reduce((acc, move) => {
        if (!onBoard({ x: x + move.x, y: y + move.y })) return acc
        const p = board[y + move.y]?.[x + move.x]
        const downCol = board[y]?.[x + move.x]
        if (p === EMPTY && downCol !== EMPTY && downCol.color !== piece.color) {
            return acc.concat({ x: x + move.x, y: y + move.y })
        }
        return acc
    }, [])
}

const possiblePawnDestiny = (piece, board) => {
    const { x, y } = piece.position
    const possibleMoves = piece.moves.map(move => {
        return piece.color === WHITE ? { x: move.x, y: -move.y } : { x: move.x, y: move.y }
    })
    return possibleMoves.reduce((acc, move) => {
        const p = board[y + move.y]?.[x + move.x]
        if (p?.color === piece.color) {
            return acc
        } else if (move.x !== 0 && typeof p === "string") {
            return acc
        } else if (move.y === 2 && y !== 1) {
            return acc
        } else if (move.x === 0 && typeof p !== "string") {
            return acc
        } else {
            return [...acc, { x: x + move.x, y: y + move.y }]
        }
    }, []).concat(diagonalPawnDestiny(piece, board))
}

const cleanBoard = (board) => {
    return board.map(row => row.map(col => {
        return typeof col === "string" ? EMPTY : { ...col, show: false }
    }))
}

export const movePiece = (piece, movement, board) => {
    const { x, y } = movement
    const newBoard = cleanBoard(board)
    const possibleDestination = piece?.name === PIECES.PAWN.name
        ? possiblePawnDestiny(piece, newBoard)
        : possibleDestiny(piece, newBoard)
    if (!possibleDestination.some(position => position.x === x && position.y === y) || piece.color === board[y][x].color) {
        console.log("movePiece: Invalid movement")
        return newBoard
    }
    if (piece?.name === PIECES.PAWN.name && (y === 0 || y === 7)) {
        piece = new Piece(PIECES.QUEEN, piece.color, piece.position)
    }
    const newPiece = { ...piece, position: { x, y } }
    newBoard[y][x] = newPiece
    newBoard[piece.position.y][piece.position.x] = EMPTY
    if (piece.name === PIECES.PAWN.name && !isPiece(board[y][x])) newBoard[piece.color === WHITE ? y + 1 : y - 1][x] = EMPTY
    if (piece.name === PIECES.KING.name && Math.abs(piece.position.x - x) === 2) {
        const rook = board[y][x > piece.position.x ? 7 : 0]
        const newRook = { ...rook, position: { x: x > piece.position.x ? x - 1 : x + 1, y } }
        newBoard[y][x > piece.position.x ? 7 : 0] = EMPTY
        newBoard[y][x > piece.position.x ? x - 1 : x + 1] = newRook
        newBoard[y][x > piece.position.x ? x - 1 : x + 1].moved = true
    }
    newBoard[y][x].moved = true
    return newBoard
}

export const pointsGived = (piece, movement, board) => {
    const { x, y } = movement
    const pieceToRemove = board[y][x]
    const newBoard = cleanBoard(board)
    const possibleDestination = piece?.name === PIECES.PAWN.name
        ? possiblePawnDestiny(piece, newBoard)
        : possibleDestiny(piece, newBoard)
    if (!possibleDestination.some(position => position.x === x && position.y === y) || piece.color === pieceToRemove.color) {
        console.log("pointsGived: Invalid movement")
        return 0
    }
    if (piece.name === PIECES.PAWN.name) {
        const backPiece = board[piece.color === WHITE ? y + 1 : y - 1][x]
        if (typeof pieceToRemove === "string" && typeof backPiece !== "string" && backPiece.color !== piece.color) {
            return backPiece?.value || 0
        }
    }
    return pieceToRemove.value || 0
}

export const showPossibleMoves = (piece, board) => {
    const cleanedBoard = cleanBoard(board)
    if (piece === EMPTY) {
        return cleanedBoard
    }
    const possibleDestination = piece?.name === PIECES.PAWN.name ? possiblePawnDestiny(piece, cleanedBoard) : possibleDestiny(piece, cleanedBoard)
    const newBoard = cleanedBoard.map((row, i) => row.map((col, j) => {
        if (possibleDestination.some(position => position.x === j && position.y === i)) {
            if (typeof col === "string") return SHOW
            col.show = true
            return col
        }
        if (typeof col === "string") return EMPTY
        col.show = false
        return col
    }))
    return newBoard
}
