// Express 
var express = require('express');
var app = express();

// dotenv
require('dotenv').config();



// Too busy
const toobusy = require('toobusy-js');

// Captcha
const session = require('express-session');
const svgCaptcha = require('svg-captcha')

// HPP
const hpp = require('hpp');

app.use(hpp())


// Cache control
const nocache = require('nocache');

app.use(nocache());



// Bodyparser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// CORS
var cors = require('cors');

// var whitelist = ['http//localhost:3000']

const corsOptions = {
    credentials: true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
}

app.options('*', cors(corsOptions));

app.use(cors(corsOptions));
// // Helmet
const helmet = require("helmet");

app.use(helmet.crossOriginEmbedderPolicy())

// Mangodb
var mongoose = require('mongoose');
const Anime = require('./models/Anime');
const User = require('./models/User');
const Blog = require('./models/Blog');
const Like = require('./models/Like');
const Messages = require('./models/Messages');
const Commentaire = require('./models/Commentaire');
const url = process.env.DATABASE_URL;

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Mongodb connected !"))
    .catch(err => console.log(err));

// Cookie parser
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const { createToken, validateToken, validateTokenID } = require("./JWP");

// EJS
app.set("view engine", "ejs");

// Method override
const methodOverride = require('method-override');
app.use(methodOverride("_method"))

// Bcrypt
const bcrypt = require('bcrypt');


// Too busy

app.use(function (req, res, next) {
    if (toobusy()) {
        res.status(503).send("Server Too Busy");
    } else {
        next();
    }
});


// Brute forcing Captcha
app.use(
    session({
        secret: 'SECRET', // Clé secrète pour signer la session
        resave: false,
        saveUninitialized: true,
    })
);

app.get('/captcha', (req, res) => {
    // Génère un captcha SVG avec le module svg-captcha
    const captcha = svgCaptcha.create();
    // Stocke la valeur du captcha dans la session
    req.session.captcha = captcha.text;
    // Renvoie le captcha SVG en réponse
    res.type('svg');
    res.status(200).send(captcha.data);
});

app.post('/verify', (req, res) => {
    const { userInput } = req.body;
    // Vérifie si la valeur saisie par l'utilisateur correspond au captcha stocké dans la session
    if (userInput === req.session.captcha) {
        res.status(200).send('Captcha is valid!');
    } else {
        res.status(400).send('Captcha is invalid!');
    }
});

// Multer
const multer = require('multer');
app.use(express.static('uploads'));

const storage = multer.diskStorage(
    {
        destination: (req, file, cb) => {
            cb(null, 'uploads/')
        },

        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    });

const upload = multer({ storage })
app.post("/uploads", upload.single('image'), (req, res) => {

    if (!req.file) {
        res.status(400).send('No file uploaded');
    }
    else {
        res.send('File uploaded successfully')
    }
})

app.post("/uploadFiles", upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.listen === 0) {
        res.status(400).send('No file uploaded');
    }
    else {
        res.send('Files uploaded successfully')
    }
})




// --------SocketIO --------
const http = require('http');
const socketIO = require('socket.io');
const server = http.createServer(app);


const io = socketIO(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        allowHeaders: ['Content-Type'],
        credentials: true,
    }
})

// Les utilisateurs de socket
const userSockets = new Map();


io.on('connection', (socket) => {

    console.log('New client connected', socket.id);

    // if (!userSockets.has(socket.id)) {
    //     socket.disconnect(true);
    //   }

    io.emit('online', true);

    // socket.on('connect', ({ socket }) => {
    //     userSockets.set(MeID, socket);
    //     console.log("usersockets", userSockets);

    //     console.log("Connected Users : ",connectedUsers)
    // });

    socket.on('privateMessage', (data) => {
        console.log('received message', data);

        let newDate = new Date();
        if (data.MeID == data.interlocuteur) {
            console.log('erreur, un utilisateur ne peut pas s envoyer des message')
        }
        else {
            const Data = new Messages({
                emitterID: data.MeID,
                receiverID: data.interlocuteur,
                messages: data.message,
                date: newDate,
                vu: false,
            })
            Data.save().then(() => {
                console.log("Message saved")
                // res.redirect('')
            })
                .catch(err => console.log("Error"));

            Messages.updateMany(
                { emitterID: data.interlocuteur, receiverID: data.MeID },
                { $set: { vu: true } })
                .then(data => {
                    console.log("Data updated");
                })
                .catch(err => console.log(err));

            io.emit('privateMessage', true);
        }
    });

    socket.on('messageLu', (data) => {
        // console.log('received messageLu : ', data.emitterID, " + ", data.ID);
        io.emit('refresh', true);
        Messages.updateMany(
            { emitterID: data.emitterID, receiverID: data.MeID },
            { $set: { vu: true } })
            .then(data => {
                console.log("Data updated");
            })
            .catch(err => console.log(err));
    });

    socket.on('logout', ({ socket }) => {
        const userSocket = userSockets.get(socket);
        if (userSocket) {
            userSocket.disconnect();
            userSockets.delete(socket);
            console.log(`User disconnected: ${MeID}`);
        }
    })

    socket.on('disconnect', (socket) => {

        const userId = Array.from(userSockets.entries())
            .find(([_, socketInstance]) => socketInstance === socket)?.[0];

        if (userId) {
            userSockets.delete(userId);
            console.log(`User disconnected: ${userId}`);
        }

        // socket.disconnect()
        // console.log('disconnected')
    })



})
















// --------Blog - les acticles --------
app.post('/submit-blog', upload.single('file'), function (req, res) {
    if (!req.file) {
        res.status(400).send('No file uploaded');
    }
    else {
        res.send('Files uploaded successfully')
        const Data = new Blog({
            titre: req.body.titre,
            username: req.body.username,
            imagename: req.body.imagename,
            date_sortie: req.body.date_sortie,
            description: req.body.description,
        })
        Data.save().then(() => {
            console.log("Data saved successfully !")
            res.redirect('/')
        }).catch(err => { console.log("Error") });
    }
})

app.get('/myblog', function (req, res) {
    Blog.find()
        .then((data) => {
            console.log(data);
            res.json(data);
        })
        .catch(err => console.log(err))
});

app.get('/blog/:id', function (req, res) {
    Blog.findOne({
        _id: req.params.id
    }).then(data => {
        res.json(data);
    })
        .catch(err => console.log(err))
});

app.put('/blog/edit/:id', upload.single('poster'), function (req, res) {
    console.log(req.params.id);
    console.log(req.body);
    const Data = {
        titre: req.body.titre,
        imagename: req.body.imagename,
        description: req.body.description,
    }
    Blog.updateOne({ _id: req.params.id }, { $set: Data })
        .then(data => {
            console.log("Data updated");
            res.json(data);
        })
        .catch(err => console.log(err));
},);

app.delete('/blog/delete/:id', function (req, res) {
    Blog.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            res.redirect('http://localhost:3000/article');
        })
        .catch(err => console.log(err))
});



// ------Commentaire---------


app.post('/submit-com', function (req, res) {
    let newDate = new Date();
    const Data = new Commentaire({
        commentaire: req.body.commentaire,
        pageID: req.body.pageID,
        type: req.body.type,
        userID: req.body.userID,
        date: newDate,
    })
    Data.save().then(() => {
        console.log("Data saved successfully !")
        if (req.body.type == "anime") {
            res.redirect(`http://localhost:3000/post/${req.body.pageID}`)
        }
        else (
            res.redirect(`http://localhost:3000/article/${req.body.pageID}`)
        )
    }).catch(err => { console.log("Error") });
})

app.get('/getCom/:id', function (req, res) {
    Commentaire.find({
        pageID: req.params.id
    }).populate("userID", "username")
        .then((data) => {
            console.log('Commentaire avec username', data);
            res.json(data);
        })
        .catch(err => console.log(err))
});


app.delete('/animeComment/:id', function (req, res) {
    Commentaire.findOne({ _id: req.params.id })
        .then((data) => {
            const pageID = data.pageID
            Commentaire.findOneAndDelete({ _id: req.params.id })
                .then(() => {
                    res.redirect(`http://localhost:3000/post/${pageID}`)
                    console.log("commentaire supprimé")
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});

app.delete('/articleComment/:id', function (req, res) {
    Commentaire.findOne({ _id: req.params.id })
        .then((data) => {
            const pageID = data.pageID
            Commentaire.findOneAndDelete({ _id: req.params.id })
                .then(() => {
                    res.redirect(`http://localhost:3000/article/${pageID}`)
                    console.log("commentaire supprimé")
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
});


// ------Liste des Animes---------

// Anime

app.get('/newAnime', function (req, res) {
    res.render('newAnime');
});

app.post('/submitAnime', upload.single('poster'), function (req, res) {
    if (!req.file) {
        res.status(400).send('No file uploaded');
    }
    else {
        res.send('Files uploaded successfully')
        const Data = new Anime({
            anime: req.body.anime,
            diffusion: req.body.diffusion,
            genre: req.body.genre,
            description: req.body.description,
            posterName: req.body.posterName,
        })
        Data.save().then(() => {
            console.log("Data saved")
            // res.redirect('')
        })
            .catch(err => console.log("Error"));
    }
});


app.get('/', validateToken, function (req, res) {
    Anime.find().then((data) => {
        // console.log(data);
        res.json(data);
        // res.render('home', {data: data});
    })
        .catch(err => console.log(err))
});

app.get('/anime/:id', function (req, res) {
    console.log(req.params.id);
    Anime.findOne({
        _id: req.params.id
    }).then(data => {
        res.json(data);
        // res.render('EditAnime', {data: data});
    })
        .catch(err => console.log(err))
});

app.get('/post/:id', function (req, res) {
    Anime.findOne({
        _id: req.params.id
    }).then(data => {
        res.json(data);
    })
        .catch(err => console.log(err))
});

app.put('/anime/edit/:id', upload.single('poster'), function (req, res) {
    console.log(req.params.id);
    console.log(req.body);
    const Data = {
        anime: req.body.anime,
        diffusion: req.body.diffusion,
        genre: req.body.genre,
        description: req.body.description,
        posterName: req.body.posterName,
    }
    Anime.updateOne({ _id: req.params.id }, { $set: Data })
        .then(data => {
            console.log("Data updated");
            res.json(data);
            // res.redirect('http://localhost:3000/animes')
        })
        .catch(err => console.log(err));
},);

app.delete('/anime/delete/:id', function (req, res) {
    Anime.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            res.redirect('http://localhost:3000/animes');
        })
        .catch(err => console.log(err))
});



// ------Like---------

app.get('/liked/:id', validateTokenID, function (req, res) {
    const myID = req.userId
    Like.findOne({
        idUser: myID,
        idManga: req.params.id,
    }).then(data => {
        if (data != null) {

            res.json(data);
            console.log("data info ", data);
            console.log(myID, "and", req.params.id);
        }
        else {
            res.json(false);
            console.log("data info ", data);
            console.log(myID, "and", req.params.id);
        }

    })
        .catch(err => console.log(err))
});

app.post('/newlike', function (req, res) {
    const Data = new Like({
        idUser: req.body.UserID,
        idManga: req.body.AnimeID,
    })
    Data.save().then(() => {
        res.redirect(`http://localhost:3000/post/${req.body.AnimeID}`)
        console.log("Data saved")
    })
        .catch(err => console.log("Error"));
}
);

app.delete('/likedelete/:id', function (req, res) {
    Like.findOneAndDelete({ _id: req.params.id })
        .then(() => {
            res.redirect(`http://localhost:3000/post/${req.body.AnimeID}`)
        })
        .catch(err => console.log(err))
});

app.get('/likes', validateTokenID, function (req, res) {
    const id = req.userId;
    Like.find({
        idUser: id
    })
        .then((data) => {
            console.log("data", data);
            const likedIMG = [];

            const promises = data.map(obj => {
                return Anime.findOne({ _id: obj.idManga });
            });

            Promise.all(promises)
                .then(animeData => {
                    animeData.forEach(anime => {
                        if (anime) {
                            likedIMG.push({ id: anime._id, img: anime.posterName, anime: anime.anime });
                        }
                    });

                    console.log("likedIMG", likedIMG);
                    res.json(likedIMG);
                })
                .catch(err => {
                    console.error(err);
                    res.status(500).json({ message: 'Server error' });
                });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
        });
});



// ------User---------

// app.get('/inscription', function(req, res) {
//     res.render('Inscription');
// });

app.post('/api/inscription', function (req, res) {
    const Data = new User({
        username: req.body.username,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        admin: false,
        online: false
    })
    Data.save().then((data) => {
        console.log('User saved !');
        res.redirect("http://localhost:3000/connexion");
    })
        .catch(err => {
            if (err.code === 11000)
                // res.send('duplicate email found');
                res.status(409).send('Duplicate email found');
            else
                console.log(err);
        });
})


app.post('/api/connexion', function (req, res) {
    User.findOne({
        username: req.body.username
    }).then((user) => {
        if (!user) {
            res.send('No User found');
        }

        if (!bcrypt.compareSync(req.body.password, user.password)) {
            res.send('Invalid password !')
        }
        else {
            const accessToken = createToken(user);
            res.cookie("access-token", accessToken, {
                maxAge: 60 * 60 * 24 * 30,
                httpOnly: true
            })

            User.updateOne({ _id: user.id }, { $set: { online: "true" } })
                .then(() => {
                    console.log("En ligne");

                })
                .catch(err => console.log(err));

            console.log("qui est en ligne ?", user.id)
        }
        res.redirect("http://localhost:3000/");
    }).catch((error) => { console.log(error) });

});


// Vérifie si nous avons un Token
app.get('/connecter', function (req, res) {
    const JWTOKEN = req.cookies["access-token"];
    res.json(!!JWTOKEN);
});


// Envoyer les informations de profil
app.get('/profil/:id', validateToken, function (req, res) {
    console.log(req.params.id);
    User.findOne({
        _id: req.params.id
    }).then(data => {
        res.json(data);
        // res.render('EditAnime', {data: data});
    })
        .catch(err => console.log(err))
});


// Bouton de déconnexion
app.get('/deconnexion/', validateTokenID, function (req, res) {
    const id = req.userId;

    User.updateOne({ _id: id }, { $set: { online: "false" } })
        .then(() => {
            console.log("Hors ligne");
        })
        .catch(err => console.log(err));


    res.clearCookie('access-token')
    console.log("Déconnecté");
    res.redirect('http://localhost:3000');
});


// Chat Liste
app.get('/chatliste', function (req, res) {
    User.find({}, { "email": 0, "password": 0, "admin": 0 }).sort({ "online": -1 }).then((data) => {
        // console.log(data);
        res.json(data);
    })
        .catch(err => console.log(err))
});


app.get('/idcheck', validateTokenID, function (req, res) {
    res.json(req.userId);
});

app.get('/admincheck', validateTokenID, function (req, res) {
    const myID = req.userId
    User.findOne({
        _id: myID
    })
        .then((data) => {
            res.json(data.admin)
        })
        .catch(err => console.log(err))
});


// Renvoyer les messages
app.get('/pm', validateTokenID, function (req, res) {
    const myID = req.userId

    Messages.find({
        $or: [{ emitterID: myID }, { receiverID: myID }]
    })
        .then((data) => {
            // console.log(data);
            res.json(data);
        })
        .catch(err => console.log(err))
});

// Obtenir le nombre de message non lu par l'ID
app.get('/pmNonVu', validateTokenID, function (req, res) {
    const myID = req.userId

    Messages.find({
        receiverID: myID,
        vu: false
    }, {
        "_id": 0,
        "emitterID": 1
    }
    )
        .then((data) => {
            const emitterCounts = {};
            data.forEach((item) => {
                const emitterID = item.emitterID;
                if (emitterCounts.hasOwnProperty(emitterID)) {
                    emitterCounts[emitterID]++;
                } else {
                    emitterCounts[emitterID] = 1;
                }
            });

            console.log("count :", emitterCounts);
            res.json(emitterCounts);
        })

        .catch(err => console.log(err))
});


server.listen(5000, function () {
    console.log("Server Listening on port 5000");
});


