import './App.css';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { SocketProvider } from './components/ChatApp/SocketContext';

import Home from './components/Home/Index';
import Navbar from './components/Navbar';
import Connexion from './components/Connexion';
import AllAnimes from './components/AllAnimes';
import NewAnime from './components/NewAnimes';
import UpdateAnime from './components/UpdateAnime';
import NotFound from './components/NotFound/NotFound';
import ChatApp from './components/ChatApp/ChatApp';
import Anime from './components/Anime';
import Inscription from './components/Inscription';
import Profil from './components/Profil/Profil';
import ArticleIndex from './components/Articles/ArticleIndex';
import NewArticle from './components/Articles/NewArticle';
import ArticleDetail from './components/Articles/ArticleDetail';
import UpdateArticle from './components/Articles/UpdateArticle';
import Footer from './components/Footer';




function App() {


  return (
    <div className="App">
      <SocketProvider>
      
          <Navbar />
          <Routes >
            <Route path='/' element={<Home />} />
            <Route path='/connexion' element={<Connexion />} />
            <Route path='/connexion/:id' element={<Connexion />} />
            <Route path='/inscription' element={<Inscription />} />
            <Route path='/profil/:id' element={<Profil />} />
            <Route path='/animes' element={<AllAnimes />} />
            <Route path='/newanime' element={<NewAnime />} />
            <Route path='/post/:id' element={<Anime />} />
            <Route path='/anime/:id' element={<UpdateAnime />} />
            <Route path='/article' element={<ArticleIndex />} />
            <Route path='/article/:id' element={<ArticleDetail />} />
            <Route path='/article/edit/:id' element={<UpdateArticle />} />
            <Route path='/article/ajouter' element={<NewArticle />} />
            <Route path='/messagerie' element={<ChatApp />} />







            <Route path='/*' element={<NotFound />} />
          </Routes>
          <Footer />

      </SocketProvider>
    </div>
  );
}

export default App;
