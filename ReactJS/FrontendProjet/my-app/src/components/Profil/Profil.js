import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { AnimeIMG } from '../styles/AllAnimeIMG.style';
import { useParams } from 'react-router-dom'
import styled from '../styles/Profil.css'


function Profil() {
    //   User infos
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [user, setUser] = useState({})

    const params = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:5000/profil/${params.id}`, { withCredentials: true })
            .then((response) => {
                setLoading(false)
                setError("")
                setUser(response.data)
            })
            .catch((error) => {
                setLoading(false)
                setError("Something went wrong")
                setUser({})
            })
    }, [])


    // User likes
    const initialStates = {
        loading: true,
        error: "",
        likes: {}
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case "FECTCH_SUCCESS": return {
                loading: false,
                error: "",
                likes: action.payload
            }

            case "FECTCH_ERROR": return {
                loading: false,
                error: "Something went wrong",
                likes: {}
            }

            default: return state
        }
    }


    const [state, dispatch] = useReducer(reducer, initialStates)

    useEffect(() => {
        axios.get('http://localhost:5000/likes', { withCredentials: true })
            .then(response => {
                dispatch({ type: "FECTCH_SUCCESS", payload: response.data })
                console.log("ici", response.data);
            })
            .catch(error => {
                // console.log(error.code)
                dispatch({ type: "FECTCH_ERROR", payload: error })
            });
    }, [])

    // Toggle
    const [Hover, setHover] = useState(false);
    const [EvenementId, setEvenementId] = useState(false);

    try {
        var AnimesLike = state.loading ? 'Loading ...' : state.likes.map((like, index) => {
            return (
                <div key={index} className='LikeContainer1'>
                    <div className='LikeContainer'>
                        <Link to={`/post/${like.id}`} >
                            <AnimeIMG
                                id={index}
                                src={`http://localhost:5000/${like.img}`}

                                onMouseEnter={(event) => {
                                    setEvenementId(event.target.id)
                                    console.log(event.target.id)
                                    setHover(true)
                                }}
                                onMouseLeave={() => setHover(false)} />
                        </Link>
                        <br />
                        {Hover && (
                            <div className='titre'>
                                {EvenementId == index ? like.anime : ""}
                            </div>
                        )}

                    </div>
                </div>
            )
        })
    }
    catch (error) {
        console.log(error)
    }




    return (
        <React.Fragment>
            <div className='ProfilContainer'>
                <div className='Username'>{loading ? 'loading...' : user.username}</div>
                <h2 className='h2'>Les animes likés</h2>
                <div className='ListeLikeProfil'>
                    {AnimesLike}
                </div>


            </div>
        </React.Fragment>
    )
}

export default Profil