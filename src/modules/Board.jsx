import React, { useState } from "react"
import PropTypes from "prop-types"
import { COLORS, COLS, ROWS, SHOW_COLOR } from "../models/board.enum"
import { initialTeam, movePiece, organizeBoard, showPossibleMoves } from "../services/actions"

const initialBoard = Array(ROWS).fill(Array(COLS).fill(""))

const Board = ({ size }) => {
    const [board, setBoard] = useState(initialBoard)
    const [selected, setSelected] = useState(null)
    const trStyle = {
        width: size,
        height: size / ROWS
    }
    const tdStyles = {
        width: size / COLS,
        height: "100%"
    }
    const modifyBoard = (i, j) => {
        console.log(i, j)
        const piece = board[i][j]
        if (piece === "X" || piece.show) {
            setBoard(movePiece(selected, { x: j, y: i }, board))
            setSelected(null)
        } else {
            setBoard(showPossibleMoves(piece, board))
            setSelected(piece)
        }
    }

    // console.table(board)

    if (board.every(row => row.every(cell => cell === ""))) {
        setBoard(organizeBoard([...initialTeam("white"), ...initialTeam("black")], board))
    }

    return (
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
    )
}

Board.propTypes = {
    size: PropTypes.number
}

export default Board
