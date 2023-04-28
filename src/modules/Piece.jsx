import React from "react"
import PropTypes from "prop-types"
import { SHOW } from "../models/board.enum"

const Piece = ({ piece }) => {
    const p = typeof piece === "string" ? <></> : <img src={piece.img} alt={piece.name} />

    return piece?.show || piece === SHOW
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
