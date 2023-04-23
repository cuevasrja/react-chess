import React, { useState } from "react"
import PropTypes from "prop-types"
import { COLORS, COLS, ROWS, SHOW_COLOR } from "../models/board.enum"
import { initialTeam, organizeBoard, showPossibleMoves } from "../services/actions"

const initialBoard = Array(ROWS).fill(Array(COLS).fill(""))

const Board = ({ size }) => {
    // eslint-disable-next-line no-unused-vars
    const [whiteTeam, setWhiteTeam] = useState(initialTeam("white"))
    // eslint-disable-next-line no-unused-vars
    const [blackTeam, setBlackTeam] = useState(initialTeam("black"))
    const [board, setBoard] = useState(initialBoard)

    console.table(board)

    if (board.every(row => row.every(cell => cell === ""))) {
        setBoard(organizeBoard([...whiteTeam, ...blackTeam], board))
    }

    return (
        <table id="board" style={{ width: size, height: size, border: "1px solid black", borderSpacing: 0 }}>
            <tbody>
                {board.map((row, i) => (
                    <tr style={{ width: size, height: size / ROWS }} key={i}>
                        {row.map((col, j) => (
                            <td className='cell' style={{ backgroundColor: col === "X" || col.show ? SHOW_COLOR : COLORS[(i + j) % 2], width: size / COLS, height: "100%" }} key={i + "-" + j} onClick={() => setBoard(showPossibleMoves(col, board))}>
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
