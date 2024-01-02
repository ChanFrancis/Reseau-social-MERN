

<h1>ProjetMERNstack</h1> 

<img src="https://github.com/ChanFrancis/ProjetMERNstack/assets/108381402/98e443ee-a2e1-45c9-ba3d-41407a4c17db" width="100%" onclick="return false;">
<br>
<h3>Projet :</h3>
Développement d'un réseau social (back-end et front-end) avec MongoDB, Express, React et NodeJS (MERN Stack).<br>
ODM : Mongoose <br><br>
Visualisation du résultat :
Render https://frontendprojet.onrender.com/ <br>
Le backend et le frontend ont été déployés dans des serveurs différents. Si vous utilisez Firefox, il se peut que vous ne puissiez pas vous connecter connectement avec les cookies. Il faudra dont retirer la protection renforcée contre le pistage (le petit boulier en haut, à gauche de l'URL) ou utiliser Chrome.
<br><br>

Afin de tester toutes les fonctionnalités, vous pouvez créer un compte simple dans la page de connexion. Dans le cas où vous souhaitez ne pas créer de compte vous pouvez utilisez ces 2 comptes afin d'utiliser la messagerie et autres :

Identifiant : Lucy<br>
Mot de Passe : 123
<br><br>
Identifiant : Fred<br>
Mot de Passe : 123



<h2>Fonctionnalité</h2> 

### 1. Page de Connexion (JSON Web Token)
- On peut s’inscrire au site internet
- Possibilité de se connecter
  <br><br>

### 2.  Page Actualités (CRUD)
Requis : <br>
Les utilisateurs peuvent consulter la page, mais seuls les admins peuvent utiliser le CRUD.

- Création d’actualité
- Consultation des fils d’actualités
- Modification des actualités
- Suppression d’une actualité
    <br><br>
    ![image](https://github.com/ChanFrancis/ProjetMERNstack/assets/108381402/5adc8052-bc46-4134-9d36-2bf58db91a4b)
    <br><br>


### 3. Page Animes (CRUD)
Requis : <br>
L'utilisateur doit être connecté afin de consulter cette page. <br>
Les membres peuvent consulter la page, mais seuls les admins peuvent utiliser le CRUD.

- Création d’un anime
- Consultation des animes
- Modification d’un anime
- Suppression d’un anime
   <br><br>
   ![image](https://github.com/ChanFrancis/ProjetMERNstack/assets/108381402/14022152-add0-4b12-a9ad-c8cda9cd673f)
   <br><br>


### 4. Page Messagerie (Socket IO)
Description : <br>
Les membres peuvent accéder au Chat privé et envoyer des messages aux autres membres. <br>
L'utilisateur doit être connecter afin de consulter cette page. <br>
Certains comptes ont été paramétrés pour être connectés en permanence.

- Possibilité d’envoyer un message privé à une autre personne
- Possibilité de voir si les membres sont connectés
- Possibilité de recevoir un message privé
- Possibilité de consulter l’historique des messages
- Possibilité de sélectionner la personne avec qui je m'adresse
- Recevoir une alerte pour les messages non lu
- Les alertes disparaissent losque l'on clique dessus ou lorsqu'on répond au message
   <br><br>
![image](https://github.com/ChanFrancis/ProjetMERNstack/assets/108381402/54ed5772-ea13-409d-82c9-e0d0ceb0ff24)

  <br><br>

### 5. Commentaires (CRD)
Requis : <br>
Les utilisateurs peuvent consulter les commentaires, mais seuls les membres/admins peuvent commenter.

- Possibilité de commenter un article ou un anime
- Possibilité de supprimer ses commentaires
   <br><br>
   ![image](https://github.com/ChanFrancis/ProjetMERNstack/assets/108381402/2c23dcf3-4276-49f6-b965-069102acb5fa)
   <br><br>


### 6. Profil / Like
Requis : <br>
L'utilisateur doit être connecté afin de consulter leur profil.<br>

- La page Profil doit contenir les animes que le membre a liké
