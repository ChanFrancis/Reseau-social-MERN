import React, { useEffect, useReducer, useState } from 'react'
import { Link } from 'react-router-dom';
import { NavbarS } from './styles/NavbarS.style'
import axios from 'axios'
import styled from './styles/NavLink.css'
import { useSocket } from './ChatApp/SocketContext';



function Navbar() {


  const [MeID, setID] = useState("");

  useEffect(() => {
    axios.get(
      "http://localhost:5000/idcheck",
      {
        withCredentials: true
      }).then(response => {
        // console.log(response)
        setID(response.data? 
          (
            <Link to={`http://localhost:3000/profil/${response.data}`} className="CSSNavLink">
              Profil
            </Link>
          ) : (
            null
          ));
      }).catch(error => {
        console.log('Not connected')
      });
  },[])

  const socketLogout = () => {

    if (socket) {
      socket.on('logout', { userId: MeID }); 
    }
  };


  const socket = useSocket();
  const [IsConnected, setIsConnected] = useState(null);

  useEffect(() => {
    axios.get(
      "http://localhost:5000/connecter",
      {
        withCredentials: true
      }).then(response => {
        // console.log(response)
        setIsConnected(response.data? 
          (
            <Link to='http://localhost:5000/deconnexion/' className="CSSNavLink" onClick={socketLogout}>
              Se déconnecter
            </Link>
          ) : (
            <Link to="/connexion" className="CSSNavLink">
              Se connecter
            </Link>
          ));
      }).catch(error => {
        console.log(error)
      });
  },[])


  const [menuActive, setMenuActive] = useState(false);

  const ToggleActivate = () => {
    setMenuActive(!menuActive);
  };

  return (
    <NavbarS menuActive={menuActive}>
      <div className='logoDiv'><a href='/'><img src={require('./images/logo-.png')} className='logoNav' /></a></div>
      <div className='NavMenu' onClick={ToggleActivate}>Menu</div>
      <div className={`nav-links ${menuActive ? 'activeNav' : ''}`}>
      <Link to="/" className="CSSNavLink">
        Accueil
      </Link>
      <Link  to="/article" className="CSSNavLink">
      Articles
      </Link>
      <Link to="/animes" className="CSSNavLink">
        Animes
      </Link>
      <Link to="/messagerie" className="CSSNavLink">
        Messagerie
      </Link>
      {MeID}
      {IsConnected}
      </div>

    </NavbarS>
  )
}

export default Navbar