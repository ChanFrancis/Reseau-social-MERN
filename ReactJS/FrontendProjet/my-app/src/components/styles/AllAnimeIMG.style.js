import styled from "styled-components"


export const AnimeIMG = styled.img `
    width: 200px;
    height: 375px;
    margin : 30px 30px 0px 30px;
    border-radius: 25px;
    box-shadow: 3px 1px 1px lightgray;
    

    
    &:hover{
        transition: all .1s ease;
        filter: blur(4px) grayscale(90%) brightness(35%);
        transform: scale(1.05); 
    }

    &:active{
        transform: scale(0.98);
    }

    `