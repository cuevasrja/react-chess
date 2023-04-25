import React, { useState } from "react"
import "./App.css"
import Game from "./modules/Game"
import { SIZE } from "./models/board.enum"
import GameOver from "./modules/GameOver"

function App () {
    const [check, setCheck] = useState(true)
    const [blackPoints, setBlackPoints] = useState(0)
    const [whitePoints, setWhitePoints] = useState(0)
    return (
        <div id={check ? "game" : "gameOver"} >
            {check
                ? <Game size={SIZE} setCheck={setCheck} whitePoints={whitePoints} setWhitePoints={setWhitePoints} blackPoints={blackPoints} setBlackPoints={setBlackPoints} />
                : <GameOver whitePoints={whitePoints} blackPoints={blackPoints} />
            }
        </div>
    )
}

export default App
