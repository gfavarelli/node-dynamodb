const express = require('express');
const bodyParser = require('body-parser');
const usuarioRoute = require('./routes/UsuarioRoute');
const produtoRoute = require('./routes/ProdutoRoute');
const app = express();
const PORT = 4000;

app.use(bodyParser.json()); //para ter o body da request
app.use('/usuario', usuarioRoute);
app.use('/produto', produtoRoute);
app.use(bodyParser.json());
app.listen(PORT, () => console.log('Rodando em '+ PORT));