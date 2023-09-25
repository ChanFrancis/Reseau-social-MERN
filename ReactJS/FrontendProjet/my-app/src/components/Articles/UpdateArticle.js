import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import styled from '../styles/UpdateArticle.css'

function UpdateAnime() {

    const navigate = useNavigate()

    const params = useParams()


    // Vérifier si l'utilisateur est admin
    useEffect(() => {
        axios.get('http://localhost:5000/admincheck', { withCredentials: true })
            .then(response => {
                if (response.data) {
                    console.log("mode admin")
                }
                else {
                    navigate("/connexion/requise")
                }

            })
            .catch(error => {
                console.log(error.code)
                navigate("/connexion/requise")
            });
    }, []);


    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const [titre, setTitre] = useState('')
    const [imagename, setImagename] = useState('')
    const [description, setDescription] = useState('')
    const [poster, setPoster] = useState(null)

    useEffect(() => {
        axios.get(`http://localhost:5000/blog/${params.id}`)
            .then((response) => {
                setLoading(false)
                setError('')
                setTitre(response.data.titre)
                setDescription(response.data.description)
            })
            .catch((error) => {
                setLoading(false)
                setError('Something went wrong')
                setTitre({})
            })
    }, [])


    const handleTitreChange = (event) => {
        setTitre(event.target.value)
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value)
    }

    const handleFileChange = (event) => {
        setPoster(event.target.files[0]);
        setImagename(event.target.files[0].name);
    }


    const handleSubmit = (event) => {
        event.preventDefault();
        if (poster) {
            const formData = new FormData();
            formData.append('poster', poster)
            formData.append('titre', titre)
            formData.append('description', description)
            formData.append('imagename', imagename)

            axios.put(`http://localhost:5000/blog/edit/${params.id}`, formData)
                .then(response => {
                    console.log(response.data);
                    return navigate("/article")
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }



    return (
        <div className='UpdateContainer'>
            <h1 className='h1'>Article "{loading ? "Loading..." : titre}"</h1>
            <form onSubmit={handleSubmit} >

                <label for="">Titre : </label><br/>
                <input type="text" name="titre" value={titre} onChange={handleTitreChange} />

                <br /> <br />

                <label for="">Description : </label><br/>
                <textarea name="description" value={description} onChange={handleDescriptionChange} type="text" rows="20" cols="100" style={{resize:'none',}}>
                </textarea>
                {/* <input type="text" name="description" value={description} onChange={handleDescriptionChange} /> */}

                <br />

                <br /><br />

                <label htmlFor="">Image : </label>
                <input type='file' onChange={handleFileChange} />

                <br /><br />

                <input type="submit" value="Valider" />
            </form>

            <br />

            <form action={`http://localhost:5000/blog/delete/${params.id}?_method=DELETE`} method="post">
                <input type="hidden" name="_method" value="DELETE" />

                <input type="submit" value="Supprimer" />
            </form>

        </div>
    )
}

export default UpdateAnime