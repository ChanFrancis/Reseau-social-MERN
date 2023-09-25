import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import styled from '../styles/HeroCarousel.css'


function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} className='CSSCarouselContainer'>
      <Carousel.Item>
      <img src='./Solo-Leveling.png' alt='' text="First slide" className='CSSCarousel'/>
      </Carousel.Item>
      <Carousel.Item>
        <img src='./Minato.jpg' alt=''  text="Second slide" className='CSSCarousel'/>
      </Carousel.Item>
      <Carousel.Item>
        <img src='./sao.jpg' alt=''  text="Third slide" className='CSSCarousel'/>
      </Carousel.Item>
    </Carousel>
  );
}

export default ControlledCarousel;