import React from "react"
import PropTypes from "prop-types"
import { COLORS, COLS, ROWS, SHOW_COLOR } from "../models/board.enum"

const Board = ({ size, board, modifyBoard }) => {
    const trStyle = {
        width: size,
        height: size / ROWS
    }
    const tdStyles = {
        width: size / COLS,
        height: "100%"
    }
    return (
        <div>
            <table id="board" style={{ width: size, height: size, border: "1px solid black", borderSpacing: 0 }}>
                <tbody>
                    {board.map((row, i) => (
                        <tr style={trStyle} key={i}>
                            {row.map((col, j) => (
                                <td className='cell' style={{ backgroundColor: col === "X" || col.show ? SHOW_COLOR : COLORS[(i + j) % 2], ...tdStyles }} key={i + "-" + j} onClick={() => modifyBoard(i, j)}>
                                    {typeof col === "string" ? "" : <img src={col.img} alt={col.name} style={{ width: "70%", height: "70%" }} />}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

Board.propTypes = {
    size: PropTypes.number.isRequired,
    board: PropTypes.array.isRequired,
    modifyBoard: PropTypes.func.isRequired
}

export default Board
