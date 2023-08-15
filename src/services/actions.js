// Import the constants and classes needed
import { COLS, EMPTY, SHOW, WHITE } from "../models/board.enum"
import { Piece } from "../models/piece.class"
import { PIECES } from "../models/pieces.enum"

/**
 * Initialize a team of pieces of the given color
 * @param {string} color
 * @returns {Piece[]}
 */
export const initialTeam = (color) => {
    const pawns = Array(COLS).fill(0).map((col, i) => new Piece(PIECES.PAWN, color, { x: i, y: color === WHITE ? 6 : 1 }))
    const rooks = [new Piece(PIECES.ROOK, color, { x: 0, y: color === WHITE ? 7 : 0 }), new Piece(PIECES.ROOK, color, { x: 7, y: color === WHITE ? 7 : 0 })]
    const knights = [new Piece(PIECES.KNIGHT, color, { x: 1, y: color === WHITE ? 7 : 0 }), new Piece(PIECES.KNIGHT, color, { x: 6, y: color === WHITE ? 7 : 0 })]
    const bishops = [new Piece(PIECES.BISHOP, color, { x: 2, y: color === WHITE ? 7 : 0 }), new Piece(PIECES.BISHOP, color, { x: 5, y: color === WHITE ? 7 : 0 })]
    const queen = [new Piece(PIECES.QUEEN, color, { x: 3, y: color === WHITE ? 7 : 0 })]
    const king = [new Piece(PIECES.KING, color, { x: 4, y: color === WHITE ? 7 : 0 })]

    return [...pawns, ...rooks, ...knights, ...bishops, ...queen, ...king]
}

/**
 * Organize the board with the given pieces
 * @param {Piece} pieces
 * @param {string[][]} board
 * @returns {string[][]}
 */
export const organizeBoard = (pieces, board) => {
    return board.map((row, i) => row.map((_, j) => {
        const piece = pieces.find(piece => piece.position.x === j && piece.position.y === i)
        return piece?.active ? piece : EMPTY
    }))
}
/**
 * Find the piece in the possible long moves
 * @param {Piece} piece
 * @param {string[][]} board
 * @returns {Object[]}
 */
const longMoves = (piece, board) => {
    // Get x and y coordinates of the piece
    const { x, y } = piece.position
    // Get the possible moves of the piece
    const moves = piece.moves
    const possibleMoves = []
    // For each move
    moves.forEach(move => {
        let i = 1
        // While the piece is on the board and the cell is empty
        while (i < COLS && board[y + (move.y * i)]?.[x + (move.x * i)] !== undefined) {
            const p = board[y + (move.y * i)]?.[x + (move.x * i)]
            if (p && p.color === piece.color) { // If the cell is not empty we stop
                break
            } else if (p && p.color !== piece.color) { // If the cell is not empty and is not the same color we add it to the possible moves
                possibleMoves.push({ x: (move.x * i), y: (move.y * i) })
                break
            } else { // In other case we add the cell to the possible moves
                possibleMoves.push({ x: (move.x * i), y: (move.y * i) })
            }
            i++
        }
    })
    return possibleMoves
}

/**
 * Checks if the given position is on the board
 * @param {object: {x, y}} position
 * @returns boolean
 */
const onBoard = position => {
    const { x, y } = position
    return x >= 0 && x < COLS && y >= 0 && y < COLS
}

/**
 * Checks if the given cell is a piece
 * @param {object || string} cell
 * @returns boolean
 */
const isPiece = (cell) => {
    return typeof cell !== "string"
}

/**
 * Add a possible Castling move to the possible moves of the king if it is possible
 * @param {Piece} piece
 * @param {string[][]} board
 * @returns {object[]}
 */
const possibleCastling = (piece, board) => {
    // If the piece is not a king or it has already moved we return an empty array
    if (piece.name !== PIECES.KING.name || piece.moved) return []
    // Get x and y coordinates of the piece
    const { x, y } = piece.position
    // Get the possible moves of the piece
    const possibleMoves = [{ x: 2, y: 0 }, { x: -2, y: 0 }]
    // Reduce the possible moves to the ones that are possible
    return possibleMoves.reduce((acc, move) => {
        // If the destiny cell is not on the board we return the accumulator
        if (!onBoard({ x: x + move.x, y: y + move.y })) return acc
        // We get the cells between the king and the rook and check if all of them are empty
        const midCells = board[y].slice(move.x > 0 ? x + 1 : 1, move.x > 0 ? COLS - 1 : x)
        const midCellsEmpty = midCells.every(cell => typeof cell === "string")
        // We get the rook and check if it is in the border
        // If move.x > 0 the king is moving to the right and the rook is in the right border
        // Opposite, if move.x < 0 the king is moving to the left and the rook is in the left border
        const rook = board[y]?.[move.x > 0 ? 7 : 0]
        const rookInBorder = rook?.name === PIECES.ROOK.name
        // We check if the rook and the king have never moved and if they are the same color
        const rookAndKingNeverMoved = !(rook?.moved || piece.moved)
        const rookAndKingSameColor = rook?.color === piece.color
        // If all the conditions are true we add the move to the accumulator
        return midCellsEmpty && rookInBorder && rookAndKingNeverMoved && rookAndKingSameColor ? acc.concat({ x: x + move.x, y: y + move.y }) : acc
    }, [])
}

/**
 * Find the possible destiny of the given piece
 * @param {Piece} piece
 * @param {string[][]} board
 * @returns {object[]}
 */
const possibleDestiny = (piece, board) => {
    // Get x and y coordinates of the piece
    const { x, y } = piece?.position
    // If the piece is the king or the knight we return the possible moves. Otherwise we return the long moves
    const possibleMoves = piece.name === PIECES.KING.name || piece.name === PIECES.KNIGHT.name
        ? piece.moves
        : longMoves(piece, board)
    // We calculate the possible destiny of the piece using the possible moves
    const possibleDestination = possibleMoves.map(move => ({ x: x + move.x, y: y + move.y }))
    // We filter the possible destiny to remove the cells that are not on the board or that are occupied by a piece of the same color
    return possibleDestination.filter(position => {
        const { x, y } = position
        if (onBoard(position)) {
            const p = board[y][x]
            if (p && p.color === piece.color) {
                return false
            }
            return true
        }
        return false
        // We add the possible castling moves to the possible destiny (Only will be added if the piece is a king)
    }).concat(possibleCastling(piece, board))
}

/**
 * Return the diagonal moves of the pawn depending on its color
 * @param {Piece} piece
 * @returns {object[]}
 */
const diagonalPawnMoves = (piece) => {
    return piece.color === WHITE ? [{ x: -1, y: -1 }, { x: 1, y: -1 }] : [{ x: -1, y: 1 }, { x: 1, y: 1 }]
}

/**
 * Find the possible diagonal destiny of the pawn
 * @param {Piece} piece
 * @param {string[][]} board
 * @returns {object[]}
 */
const diagonalPawnDestiny = (piece, board) => {
    // Get x and y coordinates of the piece
    const { x, y } = piece.position
    // Get the possible diagonal moves of the pawn
    const possibleMoves = diagonalPawnMoves(piece)
    // Reduce the possible moves to the ones that are possible
    return possibleMoves.reduce((acc, move) => {
        // If the destiny cell is not on the board we return the accumulator
        if (!onBoard({ x: x + move.x, y: y + move.y })) return acc
        // We get the destiny cell
        const p = board[y + move.y]?.[x + move.x]
        // Also get the cell below the destiny cell
        const downCol = board[y]?.[x + move.x]
        // If the destiny cell is empty and the cell below the destiny cell is not empty and is not the same color as the pawn we add the move to the accumulator
        if (p === EMPTY && downCol !== EMPTY && downCol.color !== piece.color) {
            return acc.concat({ x: x + move.x, y: y + move.y })
        }
        // Otherwise we return the accumulator
        return acc
    }, [])
}

/**
 * Concat the possible diagonal destiny of the pawn with the possible moves of the pawn
 * @param {Piece} piece
 * @param {string[][]} board
 * @returns {object[]}
 */
const possiblePawnDestiny = (piece, board) => {
    // Get x and y coordinates of the piece
    const { x, y } = piece.position
    // Get the possible moves of the pawn and change the y coordinate depending on the color of the pawn
    const possibleMoves = piece.moves.map(move => {
        return piece.color === WHITE ? { x: move.x, y: -move.y } : { x: move.x, y: move.y }
    })
    // Reduce the possible moves to the ones that are possible
    return possibleMoves.reduce((acc, move) => {
        const p = board[y + move.y]?.[x + move.x]
        // If the destiny cell is not on the board we return the accumulator
        if (!onBoard({ x: x + move.x, y: y + move.y })) return acc
        if (p?.color === piece.color) { // If the peace on the destiny cell is the same color as the pawn we return the accumulator
            return acc
        } else if (move.x !== 0 && typeof p === "string") { // If the pawn is moving to the sides and the destiny cell is empty we return the accumulator
            return acc
        } else if (move.y === 2 && y !== 1) { // If the pawn is moving two cells and the pawn is not in the initial position we return the accumulator
            return acc
        } else if (move.x === 0 && typeof p !== "string") { // If the pawn is moving forward and the destiny cell is not empty we return the accumulator
            return acc
        } else { // Otherwise we add the move to the accumulator
            return [...acc, { x: x + move.x, y: y + move.y }]
        }
        // We concat the possible diagonal destiny of the pawn with the possible moves of the pawn
    }, []).concat(diagonalPawnDestiny(piece, board))
}

/**
 * Clean the board to remove the show property of the pieces
 * @param {string[][]} board
 * @returns {string[][]}
 */
const cleanBoard = (board) => {
    return board.map(row => row.map(col => {
        return typeof col === "string" ? EMPTY : { ...col, show: false }
    }))
}

/**
 * Move the piece to the new position
 * @param {Piece} piece
 * @param {object: {x, y}} movement
 * @param {string[][]} board
 * @returns {string[][]}
 */
export const movePiece = (piece, movement, board) => {
    // Get the x and y coordinates of the movement
    const { x, y } = movement
    // Clean the board to remove the show property of the pieces
    const newBoard = cleanBoard(board)
    // Get the possible destiny of the piece
    const possibleDestination = piece?.name === PIECES.PAWN.name
        ? possiblePawnDestiny(piece, newBoard)
        : possibleDestiny(piece, newBoard)
    // If the movement is not possible we return the board
    if (!possibleDestination.some(position => position.x === x && position.y === y) || piece.color === board[y][x].color) {
        console.log("movePiece: Invalid movement")
        return newBoard
    }
    // If the piece is a pawn and is moving to the last row we change the piece to a queen
    if (piece?.name === PIECES.PAWN.name && (y === 0 || y === 7)) {
        piece = new Piece(PIECES.QUEEN, piece.color, piece.position)
    }
    // We create a new piece with the new position and add it to the board
    const newPiece = { ...piece, position: { x, y } }
    newBoard[y][x] = newPiece
    // We remove the piece from the old position
    newBoard[piece.position.y][piece.position.x] = EMPTY
    // If the piece is a pawn and is moving to the side and the destiny cell is empty we remove the piece below the destiny cell
    if (piece.name === PIECES.PAWN.name && !isPiece(board[y][x])) newBoard[piece.color === WHITE ? y + 1 : y - 1][x] = EMPTY
    // If the piece is a king and is moving two cells to the side we move the rook (castling)
    if (piece.name === PIECES.KING.name && Math.abs(piece.position.x - x) === 2) {
        const rook = board[y][x > piece.position.x ? 7 : 0]
        const newRook = { ...rook, position: { x: x > piece.position.x ? x - 1 : x + 1, y } }
        newBoard[y][x > piece.position.x ? 7 : 0] = EMPTY
        newBoard[y][x > piece.position.x ? x - 1 : x + 1] = newRook
        newBoard[y][x > piece.position.x ? x - 1 : x + 1].moved = true
    }
    // We set the moved property of the piece to true (used for castling)
    newBoard[y][x].moved = true
    return newBoard
}

/**
 * Get the points gived by the piece
 * @param {Piece} piece
 * @param {object: {x, y}} movement
 * @param {string[][]} board
 * @returns {number}
 */
export const pointsGived = (piece, movement, board) => {
    // Get the x and y coordinates of the movement
    const { x, y } = movement
    // Get the piece on the destiny cell and clean the board to remove the show property of the pieces
    const pieceToRemove = board[y][x]
    const newBoard = cleanBoard(board)
    // Get the possible destiny of the piece
    const possibleDestination = piece?.name === PIECES.PAWN.name
        ? possiblePawnDestiny(piece, newBoard)
        : possibleDestiny(piece, newBoard)
    // If the movement is not possible we return 0
    if (!possibleDestination.some(position => position.x === x && position.y === y) || piece.color === pieceToRemove.color) {
        console.log("pointsGived: Invalid movement")
        return 0
    }
    // If the piece is a pawn
    if (piece.name === PIECES.PAWN.name) {
        // Get the piece below the destiny cell
        const backPiece = board[piece.color === WHITE ? y + 1 : y - 1][x]
        // If the pawn is moving to the side and the destiny cell is empty we return the piece below the destiny cell
        if (typeof pieceToRemove === "string" && typeof backPiece !== "string" && backPiece.color !== piece.color) {
            return backPiece?.value || 0
        }
    }
    // Otherwise we return the value of the piece on the destiny cell
    return pieceToRemove?.value || 0
}

/**
 * Modify the board to show the possible moves of the piece selected
 * @param {Piece} piece
 * @param {string[][]} board
 * @returns {string[][]}
 */
export const showPossibleMoves = (piece, board) => {
    // Clean the board to remove the show property of the pieces
    const cleanedBoard = cleanBoard(board)
    // If the piece selected is empty we return the board
    if (piece === EMPTY) {
        return cleanedBoard
    }
    // Get the possible destiny of the piece
    const possibleDestination = piece?.name === PIECES.PAWN.name ? possiblePawnDestiny(piece, cleanedBoard) : possibleDestiny(piece, cleanedBoard)
    // Create a new board with the possible moves of the piece. In the possible moves we show the piece if the cell is empty or the piece is from the other color
    const newBoard = cleanedBoard.map((row, i) => row.map((col, j) => {
        // If some of the possible moves is the current cell we show the piece
        if (possibleDestination.some(position => position.x === j && position.y === i)) {
            // If the cell is empty we show the piece
            if (typeof col === "string") return SHOW
            // Otherwise we show the piece if the piece is from the other color
            col.show = true
            return col
        }
        // If the cell is empty we return the cell
        if (typeof col === "string") return EMPTY
        // If the cell has a piece from the same color we return the cell
        col.show = false
        return col
    }))
    return newBoard
}
