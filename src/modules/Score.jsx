import React from "react"
import PropTypes from "prop-types"

const Score = ({ turn, blackPoints, whitePoints }) => {
    return (
        <div>
            <h1>Turn: {turn}</h1>
            <h2>Score</h2>
            <h3>Black: {blackPoints} - White: {whitePoints}</h3>
        </div>
    )
}

Score.propTypes = {
    turn: PropTypes.string.isRequired,
    blackPoints: PropTypes.number.isRequired,
    whitePoints: PropTypes.number.isRequired
}

export default Score
