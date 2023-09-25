import React from 'react'
import styled from './styles/Connexion.style.css'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom';




function Login() {

    const params = useParams();

    return (
        <React.Fragment>
            <div className='fullpage'>
                <h1 className='login'> {params.id != null ? <>{"Veuillez vous connectez"} <br /> {"pour accéder à la page"} </> : "Login"} </h1>
                <div className='cadreBorder'>
                    <div className='cadre'>
                        <div className='image'>
                            <img src={require('./images/Naruto.png')} className='narutoIMG' />
                        </div>
                        <div className='text'>
                            <img src={require('./images/bienvenue.png')} className='bienvenue'/>
                        </div>
                        <div className='form'>
                            <div className='formBox'>
                                <form action="http://localhost:5000/api/connexion" method="post">

                                    <label for="">Identifiant</label>
                                    <br />
                                    <input type="text" name="username" className='input' />
                                    <br /><br />
                                    <label for="">Mot de passe</label>
                                    <br />
                                    <input type="password" name="password" className='input' />
                                    <br /><br />
                                    <input type="submit" value="Connexion" className='connexion' />

                                </form>
                                <hr />
                                <button className="nouveauCompte">
                                    <Link to="/inscription" className='nouveauCompteTexte'>Créer un nouveau compte</Link>
                                </button>
                            </div>
                            <br />
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}

export default Login