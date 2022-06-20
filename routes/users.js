const express = require('express');
const router = express.Router();
const { validarJWT, gerarTokenJwt } = require('./../utils/jwt');
const { salvar, remover, buscaPorEmail, alterar, buscaPorEmailSenha } = require('./../database/dynamodb');

router.post('/login', async(req, res) => {
    const dados = await buscaPorEmailSenha(req.body.email, req.body.senha);

    if (dados) {
        const token = gerarTokenJwt(dados.id);
        dados.token = token;
        dados.auth = true;

        return res.send(dados);
    }
    return res.status(404).json( { mensagem: "Usuário não encontrado" });
});

router.post('/', async (req, res) => {
    const cadastro = await salvar(req.body);
    return res.send(cadastro);
});

router.get('/', validarJWT, async (req, res) => {
    const dados = await buscaPorEmail(req.body.email);
    if (dados) {
        return res.send(dados);
    }

    return res.status(404).json({mensagem: "Usuário não encontrado"});
});

router.delete('/', validarJWT, async (req, res) => {
    const retorno = await remover(req.body.id, req.body.email);
    res.send({sucesso: retorno});
});

router.put('/', validarJWT, async (req, res) => {
    const dados = await alterar(req.body);
    res.json({mensagem: "Alterado com sucesso"});
});


module.exports = router;