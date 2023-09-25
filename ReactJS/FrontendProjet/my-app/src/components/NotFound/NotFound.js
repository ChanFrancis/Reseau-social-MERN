import React from 'react'
import styled from '../styles/NotFound.style.css'



function NotFound() {


  return (
    <div>
    <img src={require ('../images/NF.jpg')} alt='404 Page not found' className='nfIMG'></img>
    </div>
  )
}

export default NotFound