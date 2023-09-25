import React from 'react'
import styled from './styles/UpdateArticle.css'


function SignUp() {
  return (
    <div className='UpdateContainer'>
      <h1 className='h1'>Inscription</h1>

      <form action="http://localhost:5000/api/inscription" method="post" className='Inscription'>

        <label for="">Username</label><br />
        <input type="text" name="username" className='InputInscription'/>
        <br /><br />

        <label for="">Email</label><br />
        <input type="email" name="email" className='InputInscription'/>
        <br /><br />

        <label for="">Mot de passe</label><br />
        <input type="password" name="password" className='InputInscription'/>
        <br /><br />
        <div className='SubmitInscription'>
          <input type="submit" name="Inscription" value={"Créer un compte"} /> 

        </div>

      </form>
    </div>
  )
}

export default SignUp