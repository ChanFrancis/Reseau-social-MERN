import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
// import { faHeart } from '@fortawesome/free-regular-svg-icons';
import styled from './styles/Anime.css'

function Anime() {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [post, setPost] = useState({})

    const params = useParams()

    const navigate = useNavigate()

    useEffect(() => {
        axios.get(`http://localhost:5000/post/${params.id}`, { withCredentials: true })
            .then((response) => {
                setLoading(false)
                setError("")
                setPost(response.data)
                window.scrollTo(0, 0)
            })
            .catch((error) => {
                setLoading(false)
                setError("Something went wrong")
                setPost({})
            })
    }, [])


    // L'ID de l'utilisateur
    const [MeID, setID] = useState("")

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





    //   Vérifier les likes
    const [liked, setLiked] = useState("")

    useEffect(() => {

        axios.get(`http://localhost:5000/liked/${params.id}`, { withCredentials: true })
            .then(response => {
                setLiked(response.data)
                console.log("liked? ", response.data)
            })
            .catch(error => {
                console.log(error.code)
                navigate("/connexion/requise")
            });
    }, []);



    //  Récupérer les commentaires
    const initialState = {
        loading: true,
        error: "",
        coms: {}
    };

    const reducer = (state, action) => {
        switch (action.type) {
            case "FECTCH_SUCCESS": return {
                loading: false,
                error: "",
                coms: action.payload
            }

            case "FECTCH_ERROR": return {
                loading: false,
                error: "Something went wrong",
                coms: {}
            }

            default: return state
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        axios.get(`http://localhost:5000/getCom/${params.id}`)
            .then(response => {
                dispatch({ type: "FECTCH_SUCCESS", payload: response.data })
                console.log(response);
            })
            .catch(error => {
                // console.log(error.code)
                dispatch({ type: "FECTCH_ERROR", payload: error })
            });
    }, [])




    //   Afficher les commentaire avec la possibilité de supprimer ses propres commentaires
    try {
        var ComAnime = state.loading ? 'Loading ...' : state.coms.map((com, index) => {
            return (
                <div key={index} className='ComContainer' >
                    <div className='ComUser'>
                        {com.userID.username}
                        {com.userID._id == MeID? 
                        <form action={`http://localhost:5000/animeComment/${com._id}?_method=DELETE`} method="post">
                            <input type="hidden" name="_method" value="DELETE" />
                            <button type='submit' className='ComDelete'>
                            X
                            </button>
                        </form>
                            : null}

                    </div>
                    <div className='Com'>
                        {com.commentaire}
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
        <div className='AnimeContainer'>
            <div className='AnimeContainerL'>
                <div className='AnimeContainerLeft'>
                    {loading ? 'loading...' : <img id='AnimePoster' src={`http://localhost:5000/${post.posterName}`} />}
                </div>

                <div className='AnimeContainerRight'>
                    <div className='AnimeContainerRightFirst'>
                        <h1 className='AnimeTitre'>
                            {loading ? 'loading...' : post.anime}
                        </h1>
                        <div className='LikedContainer'>
                            {liked ?
                                <form action={`http://localhost:5000/likedelete/${liked._id}?_method=DELETE`} method='post'>
                                    <input type="hidden" name="_method" value="DELETE" />
                                    <input type='hidden' value={params.id} name='AnimeID' />
                                    <button type="submit" className='Liked'>
                                        <FontAwesomeIcon icon={faHeart} style={{ color: "#ff0000", }} />
                                    </button>
                                </form>
                                :
                                <form action={`http://localhost:5000/newlike/`} method='post'>
                                    <input type='hidden' value={MeID} name='UserID' />
                                    <input type='hidden' value={params.id} name='AnimeID' />
                                    <button type="submit" className='Liked'>
                                        <FontAwesomeIcon icon={faHeart} style={{ "--fa-primary-color": "#ff0000", }} />
                                    </button>

                                </form>
                            }
                        </div>
                    </div>
                    <div className='AnimeContainerRightSecond'>
                        Année de diffusion : {loading ? 'loading...' : post.diffusion}
                    </div>
                    <div className='AnimeContainerRightSecond'>
                        Type d'anime : {loading ? 'loading...' : post.genre}
                    </div>
                    <div className='AnimeContainerRightSecond'>
                        {loading ? 'loading...' : post.description}

                    </div>
                    <div className='AnimeCom'>
                        <form action='http://localhost:5000/submit-com' method='post' className='AnimeComForm'>
                            <input className='AnimeCommentaire' type="text" name="commentaire" />
                            <input type='hidden' value={params.id} name='pageID' />
                            <input type='hidden' value="anime" name='type' />
                            <input type='hidden' value={MeID} name='userID' />

                            <input className='AnimeAddCom' type='submit' value='Ajouter un commentaire' />
                        </form>


                    </div>
                    <div className='AnimeComMap'>
                        Les commentaires
                        {ComAnime}
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Anime