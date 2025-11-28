import React from 'react'

const Card = (props) => {
  return (
    <div class ='justify-center border-2 border-black w-40 m-2 h-44'>
        <div className='card'>
            <h1> {props.title} </h1>
            <p> {props.description} </p>      
        </div>
    </div>
  )
}

export default Card
