import React from 'react'
import styled from './styles/Footer.css'

function Footer() {
    return (
        <div className='Footer'>
            <div className='ColonneFooter'>
                <div className='FooterTitre'>AnimeME</div>
                <div className='FooterContent'>Qui sommes-nous</div>
                <div className='FooterContent'>FAQ</div>
                <div className='FooterContent'>Nous contacter</div>
            </div >

            <div className='ColonneFooter'>
                <div className='FooterTitre'> Légal</div>
                <div className='FooterContent'>Mentions légales</div>
                <div className='FooterContent'>Politique de confidentialité</div>
                <div className='FooterContent'>Conditions générales d’utilisation</div>
            </div>
            
            <div className='ColonneLogo'> 
                <div><img src='./insta.jpg' className='FooterLogo'></img></div>
                <div><img src='./fb.png' className='FooterLogo'></img></div>
                <div><img src='/Linkedin.png' className='FooterLogo'></img></div>
            </div>
        </div>
    )
}

export default Footer