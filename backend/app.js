const express = require('express');
const app = express();
const mongoose = require('mongoose');
const user = require('./models/user');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');
const path = require('path');

mongoose.connect('mongodb+srv://thmprlt:vb5u8@cluster0.ujchg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', userRoutes);
app.use('/api/sauces', saucesRoutes);

app.use((req, res) => {
    res.json({message : 'votre requête a bien été reçue'})
});
module.exports = app;