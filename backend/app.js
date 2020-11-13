const express = require ('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const clientesRoutes = require ('./rotas/clientes');
mongoose.connect('mongodb+srv://usjt-ccp1an-bua:usjt-ccp1an-bua@cluster0.ssm0w.mongodb.net/usjt-clientes?retryWrites=true&w=majority')
.then(() =>  console.log ("Conexao OK")).catch(() => console.log ("Conexão NOK"));
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT,  OPTIONS');
  next()
});

app.use('/api/clientes', clientesRoutes);



module.exports = app

