import React, { useState, useReducer, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import '../styles/ArticleDetail.css'
import '../styles/Anime.css'

function ArticleDetail() {

    const navigate = useNavigate()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
    const [blog, setBlog] = useState({})

    const params = useParams()


    const initialState = {
        loading: true,
        error: "",
        blog: {}
    };

    const [text, setText] = useState([]);

    useEffect(() => {
        axios.get(`http://localhost:5000/blog/${params.id}`)
            .then((response) => {
                setLoading(false)
                setError("")
                setBlog(response.data)
                setText(response.data.description)
                window.scrollTo(0, 0)
            })
            .catch((error) => {
                setLoading(false)
                setError("Something went wrong")
                setBlog({})
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
                setID(false)
                console.log(error.code)

            });
    }, []);


    //  Récupérer les commentaires
    const initialState2 = {
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

    const [state, dispatch] = useReducer(reducer, initialState2)

    useEffect(() => {
        axios.get(`http://localhost:5000/getCom/${params.id}`)
            .then(response => {
                dispatch({ type: "FECTCH_SUCCESS", payload: response.data })
                console.log("ici ",response);
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
                        <form action={`http://localhost:5000/articleComment/${com._id}?_method=DELETE`} method="post">
                            <input type="hidden" name="_method" value="DELETE" />
                            <button type='submit' className='ComDelete'>
                            X
                            </button>
                        </form>
                            : null}

                    </div>
                    <form className='Com' >
                        {com.commentaire}
                    </form>
                </div>
            )
        })
    }
    catch (error) {
        console.log("utilisateur non connecté");
        console.log(error)
    }


    return (
        <div className='ArticleDContainer'>
            {loading ? 'loading...' : <img className='ArticleDIMG' src={`http://localhost:5000/${blog.imagename}`} />}
            <div className='ArticleD'>
                <h1 className='ArticleDTitre'>{loading ? 'loading...' : blog.titre}</h1>
                <h3> {loading ? 'loading...' : blog.data_sortie}</h3>
                <div className='ArticleDdescription'>
                    {loading ? 'loading...' : blog.description}
                </div>
                <div className='ArticleComMap'>
                {MeID ?
                    <div className='ArticleComContainer'>
                        <form action='http://localhost:5000/submit-com' method='post' className='ArticleCommentaire'>
                            <input className='ArticleInputCommentaire' type="text" name="commentaire" />
                            <input type='hidden' value={params.id} name='pageID' />
                            <input type='hidden' value="article" name='type' />
                            <input type='hidden' value={MeID} name='userID' />

                            <input className='AnimeAddCom' type='submit' name='+ Ajouter un commentaire' />
                        </form>


                    </div>
                    : null}
                    Les Commentaires
                {ComAnime}
                </div>
            </div>
        </div>
    )
}

export default ArticleDetail