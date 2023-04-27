import React from "react"
import PropTypes from "prop-types"
import { COLORS, COLS, ROWS } from "../models/board.enum"
import Piece from "./Piece"

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
            <table id="board" style={{ width: size, height: size }}>
                <tbody>
                    {board.map((row, i) => (
                        <tr style={trStyle} key={i}>
                            {row.map((col, j) => (
                                <td className={"cell"} style={{ backgroundColor: COLORS[(i + j) % 2], ...tdStyles }} key={i + "-" + j} onClick={() => modifyBoard(i, j)}>
                                    <Piece piece={col} ></Piece>
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
