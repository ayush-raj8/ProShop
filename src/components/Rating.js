import React from 'react'

function Rating({value,color}) {
  return (
    <div className="rating">
       <span>
            <i style={{color}} className={
                 value >= 0.75
                 ? 'fas fa-star'
                 : value > 0.25
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
            } >
            </i>
       </span>

       <span>
            <i style={{color}} className={
                 value >= 1.75
                 ? 'fas fa-star'
                 : value >= 1.25
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
            } >
            </i>
       </span>

       <span>
            <i style={{color}} className={
                 value >= 2.75
                 ? 'fas fa-star'
                 : value >= 2.25
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
            } >
            </i>
       </span>

       <span>
            <i style={{color}} className={
                 value >= 3.75
                 ? 'fas fa-star'
                 : value >= 3.25
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
            } >
            </i>
       </span>

       <span>
            <i style={{color}} className={
                 value >= 4.75
                 ? 'fas fa-star'
                 : value > 4.25
                    ? 'fas fa-star-half-alt'
                    : 'far fa-star'
            } >
            </i>
       </span>

      <span class="crimson-text">{value}</span>

    </div>
  )
}

export default Rating
