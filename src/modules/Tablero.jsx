import React from 'react'

const Tablero = ({size}) => {
    const rows = 8
    const cols = 8

    const colors = [
        '#ded7c5',
        '#171717'
    ];

    return(
        <table id="tablero" style={{width: size, height: size, border: '1px solid black', borderSpacing: 0}}>
            <tbody>
                {Array(rows).fill(0).map((row, i) => (
                    <tr style={{width: size, height: size / rows}} key={i}>
                        {Array(cols).fill(0).map((col, j) => (
                            <td style={{backgroundColor: colors[(i + j) % 2], width: size / cols, height: '100%'}} key={i + "-" + j}></td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}

export default Tablero