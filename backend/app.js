const express = require ('express');
const app = express();
const bodyParser = require ('body-parser');
const mongoose = require ('mongoose');
const Cliente = require('./models/cliente');
mongoose.connect('mongodb+srv://usjt-ccp1an-bua:usjt-ccp1an-bua@cluster0.ssm0w.mongodb.net/usjt-clientes?retryWrites=true&w=majority')
.then(() =>  console.log ("Conexao OK")).catch(() => console.log ("Conexão NOK"));
app.use(express.json());

const clientes = [
  {
    id: '1',
    nome: 'Jose',
    fone: '11223344',
    email: 'jose@email.com'
  },
  {
    id: '2',
    nome: 'Maria',
    fone: '2119992233',
    email: 'maria@email.com'
  },
  {
    id: '3',
    nome: 'Afonso',
    fone: '11998877',
    email: 'afonso@email.com'
  }
];

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, PUT,  OPTIONS');
  next()
});

//DELETE /api/clientes/eii1349fewajlçf1
app.delete('/api/clientes/:id', (req, res, next) => {
  //console.log ("Params: " + JSON.stringify(req.params));
  Cliente.deleteOne({ _id: req.params.id }).then((resultado) => {
    console.log(resultado);
    res.status(200).json({ mensagem: "Cliente removido" });
  })
})


//http://localhost:3000/api/clientes
app.get('/api/clientes', (req, res, next) => {
  Cliente.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      mensagem: "Tudo OK",
      clientes: documents
    });
  })
});

app.get('/api/clientes/:id', (req, res, next) => {
  Cliente.findById(req.params.id).then(cli => {
    if (cli) {
      res.status(200).json(cli);
    }
    else
      res.status(404).json({ mensagem: "Cliente não encontrado!" })
  })
});


app.post('/api/clientes', (req, res, next) => {
  const cliente = new Cliente({
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  })
  cliente.save().then(clienteInserido => {
    console.log(clienteInserido);
    res.status(201).json({ mensagem: 'Cliente inserido', id: clienteInserido._id })
  });
});



app.put("/api/clientes/:id", (req, res, next) => {
  const cliente = new Cliente({
    _id: req.params.id,
    nome: req.body.nome,
    fone: req.body.fone,
    email: req.body.email
  });
  Cliente.updateOne({ _id: req.params.id }, cliente)
    .then((resultado) => {
      console.log(resultado)
    });
  res.status(200).json({ mensagem: 'Atualização realizada com sucesso' })
});

module.exports = app

