import styled from "styled-components"


export const NavbarS = styled.nav `
    width: 100%;
    height: 50px;
    ${'' /* border-radius: 0px 0px 5px 5px; */}
    display : flex;
    background-color: black;
    padding-left : 100px;
    
    @media only screen and (max-width: 1024px) {
        flex-direction: column;
        align-items: flex-end;
    }
`
