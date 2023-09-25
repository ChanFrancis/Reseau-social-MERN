import React from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import styled from '../styles/Index.css'
import ControlledCarousel from "./HeroCarousel"
import ArticlesImgOverlay from "./CartesArticles"

function Index() {


  return (
    <React.Fragment>
      {/* <h1>Bienvenue sur AnimeME</h1> */}
      <div className='HEROContainer'>
        <h1 className='IndexTitre'>Bienvenue à AnimeME!</h1>
        <div className='HERO'>
          <ControlledCarousel />
        </div>

      </div>
      <div>
      <ArticlesImgOverlay />
      </div>
    </React.Fragment>
  )
}

export default Index