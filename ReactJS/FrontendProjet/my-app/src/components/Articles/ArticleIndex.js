import React, { useEffect, useReducer, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import styled from '../styles/CartesArticles.css';


function BlogIndex() {


    // Vérifier si l'utilisateur est admin
    const [Admin, setAdmin] = useState("")
    useEffect(() => {
        axios.get('http://localhost:5000/admincheck', { withCredentials: true })
            .then(response => {
                if (response.data) {
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


    const initialState = {
        loading: true,
        error: '',
        blogs: {}
    }

    const reducer = (state, action) => {
        switch (action.type) {
            case 'FETCH_SUCCESS':
                return {
                    loading: false,
                    error: '',
                    blogs: action.payload
                }
            case 'FETCH_ERROR':
                return {
                    loading: false,
                    blogs: {},
                    error: 'something went wrong',
                }
            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        axios.get('http://localhost:5000/myblog')
            .then(reponse => {
                dispatch({ type: 'FETCH_SUCCESS', payload: reponse.data })
            })
            .catch((error) => ({ type: 'FETCH_ERROR', payload: error }));
    }, [])




    return (
        <React.Fragment>
            <div className='ArticleHeader'>
                <h1> Nos articles</h1>
                {Admin ? <button className='AjouteArticle'><Link to='/article/ajouter' className='AjouteArticleTexte'> Ajouter un article</Link></button> : null}
            </div>
            <section class="articles">
            {state.loading ? 'Loading...' : state.blogs.map((blog, index) => {
                return (
                    <React.Fragment key={index}>
                        <Link to={`/article/${blog._id}`} className='CSSArticle'>
                            <article className='Article'>
                                <div class="article-wrapper">
                                    <div className='ArticleIMGContainer'>
                                        <img src={`http://localhost:5000/${blog.imagename}`} className='ArticleIMG' alt="" />
                                    </div>
                                    <div class="article-body">
                                        <h2 className='Article-Titre'>{blog.titre}</h2>
                                        <p className='Article-Description'>
                                            {blog.description}
                                        </p>
                                        <div class="read-more">
                                            Voir plus
                                        </div>
                                    </div>
                                </div>
                            </article>
                            <div className='ArticleEdit'>
                            {Admin ? <button className='ArticleEditButton'><Link to={`/article/edit/${blog._id}`} className='ArticleEditTexte'> Article Edit</Link></button> : null}
                            </div>
                        </Link>
                        
                    </React.Fragment>
                )
                
            })}
            </section>
        </React.Fragment>
    )
}

export default BlogIndex