import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import { INITIAL_BOARD } from "../models/board.enum"
import { initialTeam, movePiece, organizeBoard, showPossibleMoves } from "../services/actions"
import Board from "./Board"
import Score from "./Score"

const initialBoard = organizeBoard([...initialTeam("white"), ...initialTeam("black")], INITIAL_BOARD)

const Game = ({ size, setCheck, whitePoints, setWhitePoints, blackPoints, setBlackPoints }) => {
    const [board, setBoard] = useState(initialBoard)
    const [selected, setSelected] = useState(null)
    const [turn, setTurn] = useState("white")
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
    const checkGameOver = (bPoints, wPoints) => {
        if (bPoints >= 39 || wPoints >= 39) {
            setCheck(false)
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

    useEffect(() => {
        checkGameOver(blackPoints, whitePoints)
    }, [blackPoints, whitePoints])

    return (
        <>
            <Board size={size} board={board} modifyBoard={modifyBoard} />
            <Score turn={turn} blackPoints={blackPoints} whitePoints={whitePoints} />
        </>
    )
}

Game.propTypes = {
    size: PropTypes.number.isRequired,
    setCheck: PropTypes.func.isRequired,
    whitePoints: PropTypes.number.isRequired,
    setWhitePoints: PropTypes.func.isRequired,
    blackPoints: PropTypes.number.isRequired,
    setBlackPoints: PropTypes.func.isRequired
}

export default Game
