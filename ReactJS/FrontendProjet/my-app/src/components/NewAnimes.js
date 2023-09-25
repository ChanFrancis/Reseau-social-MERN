import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from "./styles/NewAnime.css"

function NewAnime() {

    const navigate = useNavigate()

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


    const [poster, setPoster] = useState(null);
    const [anime, setAnime] = useState("");
    const [diffusion, setDiffusion] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");
    const [posterName, setPosterName] = useState("");

    const handleFileChange = (event) => {
        setPoster(event.target.files[0]);
        setPosterName(event.target.files[0].name);
    }

    const handleDiffusionChange = (event) => {
        setDiffusion(event.target.value);
    }

    const handleAnimeChange = (event) => {
        setAnime(event.target.value);
    }

    const handleGenreChange = (event) => {
        setGenre(event.target.value);
    }

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        if (poster) {
            const formData = new FormData();
            formData.append('poster', poster)
            formData.append('anime', anime)
            formData.append('diffusion', diffusion)
            formData.append('genre', genre)
            formData.append('description', description)
            formData.append('posterName', posterName)

            axios.post('http://localhost:5000/submitAnime', formData)
                .then(response => {
                    console.log(response.data);
                    return navigate("/animes")
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    return (
        <React.Fragment>
            <div className='AddAnime'>
                <h1 className='h1'>Ajouter un nouvel anime</h1>
                <form onSubmit={handleSubmit} method="post">

                    <label htmlFor="">Anime : </label><br/>
                    <input type="text" onChange={handleAnimeChange} />

                    <br /><br />

                    <label htmlFor="">Année de diffusion : </label><br/>
                    <input type="number" min="1950" max="2099" step="1" onChange={handleDiffusionChange} />

                    <br /><br />

                    <label htmlFor="">Genre : </label><br/>
                    <input type="text" onChange={handleGenreChange} />

                    <br /><br />

                    <label htmlFor="">Bref description : </label><br/>
                    <textarea name="description" id="" cols="30" rows="10" style={{resize:'none',}} onChange={handleDescriptionChange}></textarea>

                    <br /><br />

                    <label htmlFor="">Poster : </label><br/>
                    <input type='file' onChange={handleFileChange} />

                    <br /><br />


                    <input type="submit" value="Valider" />
                </form>
            </div>
        </React.Fragment>
    )
}

export default NewAnime