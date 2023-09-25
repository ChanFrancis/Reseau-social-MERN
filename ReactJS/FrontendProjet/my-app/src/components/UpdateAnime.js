import React, {useEffect, useState} from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import styled from "./styles/NewAnime.css"

function UpdateAnime() {

    const navigate = useNavigate()

    const params= useParams()


    // Vérifier si l'utilisateur est admin
    useEffect(() => {
      axios.get('http://localhost:5000/admincheck', { withCredentials: true })
          .then(response => {
              if (response.data){
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

    const [anime, setAnime] = useState({})
    const [diffusion, setDiffussion] = useState('')
    const [genre, setGenre] = useState('')
    const [description, setDescription] = useState('')
    const [posterName, setposterName] = useState('')
    const [poster, setPoster] = useState(null)
    const [animeName, setAnimeName] = useState('')

    useEffect(()=>{
      axios.get(`http://localhost:5000/anime/${params.id}`)
        .then((response)=>{
          setLoading(false)
          setError('')
          setAnime(response.data.anime)
          setAnimeName(response.data.anime)
          setGenre(response.data.genre)
          setDiffussion(response.data.diffusion)
          setDescription(response.data.description)
        })
        .catch((error)=>{
          setLoading(false)
          setError('Something went wrong')
          setAnime({})
        })
    },[])


    const handleAnimeChange = (event)=>{
      setAnime(event.target.value)
    }

    const handleDiffusionChange = (event)=>{
      setDiffussion(event.target.value)
    }

    const handleGenreChange = (event)=>{
      setGenre(event.target.value)
    }

    const handleDescriptionChange = (event)=>{
      setDescription(event.target.value)
    }

    const handleFileChange = (event) => {
      setPoster(event.target.files[0]);
      setposterName(event.target.files[0].name);
  }


    const handleSubmit = (event) => {
      event.preventDefault();
      if(poster){
      const formData = new FormData();
      formData.append('poster', poster)
      formData.append('anime', anime)
      formData.append('diffusion', diffusion)
      formData.append('genre', genre)
      formData.append('description', description)
      formData.append('posterName', posterName)
      
      axios.put(`http://localhost:5000/anime/edit/${params.id}`, formData)
      .then(response =>{
          console.log(response.data);
          return navigate("/animes")
      })
      .catch(err=>{
          console.log(err)
      })
      }}

   

  return (
    <div className='AddAnime'>
    
    <h1 className='h1'>Mis à jour de l'anime "{animeName}"</h1>
        <form onSubmit={handleSubmit} >

        <label for="">Anime : </label><br/>
        <input type="text" name="anime" value ={anime} onChange={handleAnimeChange}/>

     <br/><br/>

        <label for="">Année de diffusion : </label><br/>
        <input type="number" min="1950" max="2099" step="1" name="diffusion" value ={diffusion} onChange={handleDiffusionChange}/>

        <br/><br/>

        <label for="">genre : </label><br/>
        <input type="text" name="genre" value ={genre} onChange={handleGenreChange}/>
        {/* <input type="text" name="genre" Value ={genre} /> */}
        {/* Le V majuscule dans la "value" permet d'effectuer la même action sans "Handler" */}

        <br/><br/>

        <label for="">Bref description : </label> <br/>
        <textarea name="description" id="" cols="30" rows="10" style={{resize:'none',}} value ={description} onChange={handleDescriptionChange}></textarea>

        <br/><br/>

        <label htmlFor="">Poster : </label><br/>
        <input type='file' onChange={handleFileChange} />
    
        <br/><br/>

        <input type="submit" value="Valider"/>
    </form>

    <br/>

    <form action={`http://localhost:5000/anime/delete/${params.id}?_method=DELETE`} method="post">
        <input type="hidden" name="_method" value="DELETE"/>

        <input type="submit" value="Supprimer"/>
    </form>

    </div>
  )
}

export default UpdateAnime