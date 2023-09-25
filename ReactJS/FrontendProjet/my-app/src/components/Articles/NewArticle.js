import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import styled from '../styles/UpdateArticle.css'

function MyBlog() {

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



    const navigate = useNavigate()

    const [file, setFile] = useState(null);
    const [username, setUsername] = useState("");
    const [titre, setTitre] = useState("");
    const [imagename, setImagename] = useState("");
    const [description, setDescription] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setImagename(event.target.files[0].name);
    }

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    }

    const handleTitreChange = (event) => {
        setTitre(event.target.value);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (file) {
            const formData = new FormData();
            formData.append('file', file)
            formData.append('username', username)
            formData.append('titre', titre)
            formData.append('imagename', imagename)
            formData.append('description', description)

            axios.post('http://localhost:5000/submit-blog', formData)
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
            <h1 className='h1'>Ajouter un nouvel article</h1>
            <form onSubmit={handleSubmit}>
                <label>Titre</label><br />
                <input type='text' name='titre' onChange={handleTitreChange} />

                <br /><br />

                <label>Username</label><br />
                <input type='text' name='Username' onChange={handleUsernameChange} />

                <br /><br />

                <label>Image :</label><br />
                <input type='file' onChange={handleFileChange} />

                <br /><br />

                <label>Description</label><br />
                <textarea type='text' name='description' onChange={handleDescriptionChange}
                rows="20" cols="100" style={{resize:'none',}} />

                <br /><br />

                <button type='submit'>Envoyer</button>
            </form>
        </div>
    )
}

export default MyBlog