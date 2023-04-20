import React, { useState } from 'react'
import { Piece } from '../models/piece.class';
import { PIECES } from '../models/pieces.enum';

const rows = 8
const cols = 8

const initialBoard = Array(rows).fill(Array(cols).fill(''))

const initialTeam = (color) => {
    const pawns = Array(cols).fill(0).map((col, i) => new Piece(PIECES.PAWN, color, {x: i, y: color === 'white' ? 6 : 1}))
    const rooks = [new Piece(PIECES.ROOK, color, {x: 0, y: color === 'white' ? 7 : 0}), new Piece(PIECES.ROOK, color, {x: 7, y: color === 'white' ? 7 : 0})]
    const knights = [new Piece(PIECES.KNIGHT, color, {x: 1, y: color === 'white' ? 7 : 0}), new Piece(PIECES.KNIGHT, color, {x: 6, y: color === 'white' ? 7 : 0})]
    const bishops = [new Piece(PIECES.BISHOP, color, {x: 2, y: color === 'white' ? 7 : 0}), new Piece(PIECES.BISHOP, color, {x: 5, y: color === 'white' ? 7 : 0})]
    const queen = [new Piece(PIECES.QUEEN, color, {x: 3, y: color === 'white' ? 7 : 0})]
    const king = [new Piece(PIECES.KING, color, {x: 4, y: color === 'white' ? 7 : 0})]

    return [...pawns, ...rooks, ...knights, ...bishops, ...queen, ...king]
}

const organizeBoard = (pieces, board) =>{
    return board.map((row, i) => row.map((col, j) => {
        const piece = pieces.find(piece => piece.position.x === j && piece.position.y === i)
        if(piece){
            return piece
        }else{
            return ""
        }
    }))
}

const Board = ({size}) => {
    const [whiteTeam, setWhiteTeam] = useState(initialTeam('white'))
    const [blackTeam, setBlackTeam] = useState(initialTeam('black'))
    const [board, setBoard] = useState(initialBoard);

    console.table(board)

    const colors = [
        '#ded7c5',
        '#171717'
    ];

    if(board.every(row => row.every(cell => cell == ""))){ 
        setBoard(organizeBoard([...whiteTeam, ...blackTeam], board))
    }



    return(
        <table id="board" style={{width: size, height: size, border: '1px solid black', borderSpacing: 0}}>
            <tbody>
                {board.map((row, i) => (
                    <tr style={{width: size, height: size / rows}} key={i}>
                        {row.map((col, j) => (
                            <td 
                                className='cell' 
                                style={{backgroundColor: colors[(i + j) % 2], width: size / cols, height: '100%', color: col.color === "white"? "blue" : "red", textAlign: 'center', fontSize: '80%', fontWeight: 'bold' }} 
                                key={i + "-" + j}
                            >
                                {col.name}
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Board