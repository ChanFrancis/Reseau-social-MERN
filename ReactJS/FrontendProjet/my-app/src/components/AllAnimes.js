import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom';
import { AnimeIMG } from './styles/AllAnimeIMG.style';
import styled from './styles/AllAnime.style.css'


function AllAnime() {


    const navigate = useNavigate()

    const initialState = {
        loading: true,
        error: "",
        animes: {}
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case "FECTCH_SUCCESS": return {
                loading: false,
                error: "",
                animes: action.payload
            }

            case "FECTCH_ERROR": return {
                loading: false,
                error: "Something went wrong",
                animes: {}
            }

            default: return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        axios.get('http://localhost:5000/', { withCredentials: true })
            .then(response => {
                dispatch({ type: "FECTCH_SUCCESS", payload: response.data })
                console.log(response);
            })
            .catch(error => {
                // console.log(error.code)
                dispatch({ type: "FECTCH_ERROR", payload: error })
                return navigate("/connexion/requise")

            });
    }, [])


    
        // Vérifier si l'utilisateur est admin
        const [Admin, setAdmin] = useState("")
        useEffect(() => {
            axios.get('http://localhost:5000/admincheck', { withCredentials: true })
                .then(response => {
                    if (response.data){
                        console.log("mode admin")
                        setAdmin(true)
                    }
                    else {
                        setAdmin(false)
                    }
                    
                })
                .catch(error => {
                    console.log(error.code)
                });
        }, []);




    // Toggle
    const [Hover, setHover] = useState(false);
    const [EvenementId, setEvenementId] = useState(false);

    try {
        var retourAnimes = state.loading ? 'Loading ...' : state.animes.map((anime, index) => {
            return (
                <div key={index} className='width' >
                    <div className='Anime' >
                        <Link to={`/post/${anime._id}`} >
                            <AnimeIMG
                                id={index}
                                src={`http://localhost:5000/${anime.posterName}`}
                                
                                onMouseEnter={(event) => {
                                    setEvenementId(event.target.id)
                                    console.log(event.target.id)
                                    setHover(true)
                                }}
                                onMouseLeave={() => setHover(false)} />
                        </Link>
                        <br />
                        {Admin? <button className='EditAnimeButton'><Link to={`/anime/${anime._id}`} className='EditAnimeText'> Anime Edit</Link></button>:null}
                        {Hover && (
                            <div className='titre'>
                                {EvenementId == index ? anime.anime : ""}
                            </div>
                        )}
                    </div>
                </div>
            )
        })
    }
    catch (error) {
        console.log("utilisateur non connecté");
        console.log(error)
    }


    return (
        <React.Fragment>
            <div>
                <h1 className='h1Anime'>Animes</h1>
                {Admin? 
                <h2 className='h2Anime'><button className='AddAnimeButton'><Link to="/newanime" className='AddAnimeText'>Ajouter un anime</Link></button></h2>
                :null}
                <div className='containerAnime'>
                    {retourAnimes}
                </div>
            </div>
        </React.Fragment>
    )
}

export default AllAnime