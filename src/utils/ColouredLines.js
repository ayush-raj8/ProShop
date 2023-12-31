import React from 'react'

function ColouredLines({ color,backgroundColor }) {
  return (
    <div
        style={{
            color: color,
            backgroundColor: backgroundColor,
            borderTop: "1px solid "
        }}
    />
  )
}

export default ColouredLines
