import React from "react"
import PropTypes from "prop-types"

const GameOver = ({ blackPoints, whitePoints }) => {
    return (
        <>
            <h1>Game Over</h1>
            <p>Black: {blackPoints}</p>
            <p>White: {whitePoints}</p>
            <b>{whitePoints > blackPoints
                ? "White team wins"
                : "Black team wins"}
            </b>
            <button onClick={() => window.location.reload()}>Play Again</button>
        </>
    )
}

GameOver.propTypes = {
    blackPoints: PropTypes.number.isRequired,
    whitePoints: PropTypes.number.isRequired
}

export default GameOver
