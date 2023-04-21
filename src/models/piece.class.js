export class Piece {
    type = {}
    name = ""
    color = ""
    position = { x: 0, y: 0 }
    moves = []
    active = true
    value = 0
    img = ""

    constructor (type, color, position) {
        this.type = type
        this.name = type.name
        this.color = color
        this.position = position
        this.moves = type.moves
        this.active = true
        this.value = type.value
        this.img = `/src/assets/${type.name}_${color}.png`
    }
}
