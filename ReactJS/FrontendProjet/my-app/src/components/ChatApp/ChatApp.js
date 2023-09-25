import React, { useEffect, useReducer, useState, createContext, useContext } from 'react'
import axios from 'axios'
import io from 'socket.io-client'
import style from '../styles/ChatApp.style.css'
import { useNavigate } from 'react-router-dom';
import { useSocket } from './SocketContext';


// const socket = io('http://localhost:5000')


function ChatApp() {


  const navigate = useNavigate()
  const socket = useSocket();

  // Prendre mon ID ------------------------------------------
  // Si l'utilisateur n'est pas connecté, renvoyer vers la page de connexion
  const [MeID, setID] = useState("");

  useEffect(() => {
    axios.get('http://localhost:5000/idcheck', { withCredentials: true })
      .then(response => {
        setID(response.data)
        // console.log(response.data)
      })
      .catch(error => {
        console.log(error.code)
        navigate("/connexion/requise")
      });
  }, []);


  // socket.on('connect', {MeID})



  const [message, setMessage] = useState('')
  // Envoyer le message au serveur
  const sendMessage = (e) => {
    e.preventDefault()
    socket.emit('privateMessage', { interlocuteur, MeID, message });
    setMessage('')
  }


  // Recevoir le message est prendre les informations
  const initialState1 = {
    loading: true,
    error: "",
    privateMessages: {}
  };

  const reducer1 = (state, action) => {
    switch (action.type) {
      case "FECTCH_SUCCESS": return {
        loading: false,
        error: "",
        privateMessages: action.payload
      }

      case "FECTCH_ERROR": return {
        loading: false,
        error: "Something went wrong",
        privateMessages: {}
      }

      default: return state
    }
  }


  const [state1, dispatch1] = useReducer(reducer1, initialState1)

  const [privateMessage, setPrivateMessage] = useState(false);
  socket.on('privateMessage', () => {
    setPrivateMessage(true)
  })

  // On récupère les messages pour les afficher plus tard
  useEffect(() => {
    setPrivateMessage(false)
    axios.get('http://localhost:5000/pm', { withCredentials: true })
      .then(response => {
        dispatch1({ type: "FECTCH_SUCCESS", payload: response.data })
        return () => {
          socket.off('privateMessage')
        }
      })
      .catch(error => {
        // console.log(error.code)
        dispatch({ type: "FECTCH_ERROR", payload: error })
      });
  }, [privateMessage]);



  // Prendre le nombre de message non lu
  let [vu, setVu] = useState([]);
  const [refresh, setRefresh] = useState(false);

  socket.on('refresh', () => {
    setRefresh(true)
  })
  socket.on('privateMessage', () => {
    setRefresh(true)
  })

  useEffect(() => {
    setRefresh(false)
    axios.get('http://localhost:5000/pmNonVu', { withCredentials: true })
      .then(response => {
        setVu(response.data)
        // console.log("Vu ",response.data)
        return () => {
          socket.off('privateMessage')
        }
      })
      .catch(error => {
        // console.log(error.code)
        dispatch({ type: "FECTCH_ERROR", payload: error })
      });
  }, [refresh]);



  // Chat Liste ---------------------------------------------------------------
  const initialState = {
    loading: true,
    error: "",
    onlines: {}
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "FECTCH_SUCCESS": return {
        loading: false,
        error: "",
        onlines: action.payload
      }

      case "FECTCH_ERROR": return {
        loading: false,
        error: "Something went wrong",
        onlines: {}
      }

      default: return state
    }
  }


  const [state, dispatch] = useReducer(reducer, initialState)
  const [signalReceived, setSignalReceived] = useState(false);

  socket.on('online', () => {
    setSignalReceived(true)
  })


  useEffect(() => {

    setSignalReceived(false)
    axios.get('http://localhost:5000/chatliste', { withCredentials: true })

      .then(response => {
        dispatch({ type: "FECTCH_SUCCESS", payload: response.data })
        // console.log(response);
        return () => {
          socket.off('online')
        }
      })
      .catch(error => {
        // console.log(error.code)
        dispatch({ type: "FECTCH_ERROR", payload: error })
      });
  }, [signalReceived]);


    // Toggle Chat list petit écran
    const [chatActive, setChatActive] = useState(false);

    const ToggleChat = () => {
      setChatActive(!chatActive);
    };
  


  // Récupérer l'ID de l'username selectionné | Afficher la Chat Liste | 
  // Mettre une class en ligne ou non | Afficher le nombre de messages non lu | Mettre à jour lorsque les messages sont lus
  const [interlocuteur, setInterlocuteur] = useState("");
  const [EvenementId, setEvenementId] = useState(false);
  const [IntUserName, setIntUserName] = useState("");

  // const[info, setInfo] = useState("");


  try {
    var enLigne = state.loading ? 'Loading ...' : state.onlines.map((online, index) => {
      const unreadCount = vu[online._id];


      // Envoyer les informations pour marquer les messages comme étant lu
      let emitterID = online._id
      const SendInfo = () => {
        socket.emit('messageLu', { emitterID, MeID });
        // console.log("messageLu", emitterID, " + ", ID)
      }

      return (
        <div key={index} className={`${MeID === online._id ? 'hide' : 'ChatListeDiv'}${online.online ? " Online" : " Offline"}`}>

          <div id={index}
            onClick={(event) => {
              setEvenementId(event.target.id)
              SendInfo()
              return (setInterlocuteur(online._id), setIntUserName(online.username))
            }}

            className={`${MeID === online._id ? 'hide' : EvenementId == index ? 'Interlocuteur' : "ChatListeDetail"} 
            `}>

            {online.username}
          </div>
          <div className={`${unreadCount == undefined ? 'hide' : 'MessageNonLu'}`} >
            {unreadCount}
          </div>

        </div>
      )
    })
  }
  catch (error) {
    console.log("Aucun utilisateur connecté");
    console.log(error)
    return (
      <div> Selectionnez une conversation </div>
    )
  }


  // afficher les messages reçus
  try {
    // console.log(ID," + ",interlocuteur)
    var conversation = state1.loading ? 'Loading ...' : state1.privateMessages.map((privateMessage, index) => {
      return (
        privateMessage.emitterID === interlocuteur || privateMessage.receiverID === interlocuteur ?
          (privateMessage.emitterID === MeID ?
            <div key={index} className='messageSended'>
              <div className='messageR'>
                {privateMessage.messages}
              </div>
            </div>
            :
            <div key={index} className='messageReceived'>
              <div className='MessageL'>
                {privateMessage.messages}
              </div>
            </div>)
          :
          null

      )
    })
  }
  catch (error) {
    console.log("Aucun utilisateur séléctionné");
    console.log(error)
    return (
      <div> Selectionner un utilisateur </div>
    )
  }



  return (
    <React.Fragment>
      <div id='ChatPage'>
        
        <div className={`ChatList ${chatActive ? ' ShowChat' : null}`}>
          <div className='ContactList2'>Contacts</div>
          {enLigne}
        </div>
          <div className='ContactList' onClick={ToggleChat}>Contacts</div>
        <div className='ChatContainer'>
           <h2>{IntUserName}</h2>
          <div className='MessagesContainer'>
            {conversation}
          </div>
          <form onSubmit={sendMessage} className='MessageFrom'>
            <input type='text' value={message} onChange={(e) => setMessage(e.target.value)}
              className='MessageBar' />
            <button type='submit' className='MessageSubmit'>Envoyer</button>

          </form>

        </div>
      </div>
    </React.Fragment>

  )
}

export default ChatApp