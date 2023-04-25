import React, { useState } from "react"
import PropTypes from "prop-types"
import { COLORS, COLS, ROWS, SHOW_COLOR } from "../models/board.enum"
import { initialTeam, movePiece, organizeBoard, showPossibleMoves } from "../services/actions"

const initialBoard = Array(ROWS).fill(Array(COLS).fill(""))

const Board = ({ size }) => {
    const [board, setBoard] = useState(initialBoard)
    const [selected, setSelected] = useState(null)
    const [turn, setTurn] = useState("white")
    const [blackPoints, setBlackPoints] = useState(0)
    const [whitePoints, setWhitePoints] = useState(0)
    const trStyle = {
        width: size,
        height: size / ROWS
    }
    const tdStyles = {
        width: size / COLS,
        height: "100%"
    }
    const swapTurn = () => {
        if (turn === "white") {
            setTurn("black")
        } else {
            setTurn("white")
        }
    }
    const addPoints = (piece) => {
        if (typeof piece === "object") {
            if (piece.color === "black") {
                setWhitePoints(whitePoints + piece.value)
            } else {
                setBlackPoints(blackPoints + piece.value)
            }
        }
    }
    const modifyBoard = (i, j) => {
        const piece = board[i][j]
        if (piece === "X" || piece.show) {
            setBoard(movePiece(selected, { x: j, y: i }, board))
            addPoints(piece)
            swapTurn()
            setSelected(null)
        } else {
            if (typeof piece === "string" || piece.color === turn) {
                setBoard(showPossibleMoves(piece, board))
                setSelected(piece)
            }
        }
    }

    // console.table(board)

    if (board.every(row => row.every(cell => cell === ""))) {
        setBoard(organizeBoard([...initialTeam("white"), ...initialTeam("black")], board))
    }

    return (
        <>
            <h1>Turn: {turn}</h1>
            <h2>Black: {blackPoints} - White: {whitePoints}</h2>
            <table id="board" style={{ width: size, height: size, border: "1px solid black", borderSpacing: 0 }}>
                <tbody>
                    {board.map((row, i) => (
                        <tr style={trStyle} key={i}>
                            {row.map((col, j) => (
                                <td className='cell' style={{ backgroundColor: col === "X" || col.show ? SHOW_COLOR : COLORS[(i + j) % 2], ...tdStyles }} key={i + "-" + j} onClick={() => modifyBoard(i, j)}>
                                    {typeof col === "string" ? "" : <img src={col.img} alt={col.name} style={{ width: "70%", height: "70%" }}/>}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    )
}

Board.propTypes = {
    size: PropTypes.number
}

export default Board
