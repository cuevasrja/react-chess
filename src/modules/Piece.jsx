import React from "react"
import PropTypes from "prop-types"

const Piece = ({ piece }) => {
    const p = typeof piece === "string" ? <></> : <img src={piece.img} alt={piece.name} />

    return piece?.show || piece === "X"
        ? (
            <div className="show">
                { p }
            </div>
        )
        : p
}

Piece.propTypes = {
    piece: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.object
    ]).isRequired
}

export default Piece
