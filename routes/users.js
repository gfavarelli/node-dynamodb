const express = require('express');
const router = express.Router();
const { salvar, remover, buscaPorEmail, alterar, buscaPorEmailSenha } = require('./../database/dynamodb');

router.get('/login', async(req, res) => {
    const dados = await buscaPorEmailSenha(req.body.email, req.body.senha);

    if (dados) {
        return res.send(dados);
    }
    return res.status(404).send("Usuário não encontrado");
});

router.get('/', async (req, res) => {
    const dados = await buscaPorEmail(req.body.email);
    if (dados) {
        return res.send(dados);
    }
    
    return res.status(404).send("Usuário não encontrado");
});

router.post('/', async (req, res) => {
    console.log('caiu aqui', req.body);
    const cadastro = await salvar(req.body);
    return res.send(cadastro);
});

router.delete('/', async (req, res) => {
    const retorno = await remover(req.body.id, req.body.email);
    res.send({sucesso: retorno});
});

router.put('/', async (req, res) => {
    console.log(req.body);
    const dados = await alterar(req.body);
    res.send("OK");
});

module.exports = router;