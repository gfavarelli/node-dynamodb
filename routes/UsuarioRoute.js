const express = require('express');
const router = express.Router();
const { validarJWT, gerarTokenJwt } = require('../utils/jwt');
const { salvar, remover, buscaPorEmail, alterar, buscaPorEmailSenha } = require('../database/UsuarioDB');

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
    if (req.body && req.body.nome && req.body.senha) {
        const cadastro = await salvar(req.body);
        return res.send(cadastro);
    }
    
    return res.status(500).json({mensagem: "Usuario não cadastrado"});
});

router.get('/', validarJWT, async (req, res) => {
    const dados = await buscaPorEmail(req.body.email);
    if (dados) {
        return res.send(dados);
    }

    return res.status(404).json({mensagem: "Usuário não encontrado"});
});

router.delete('/', async (req, res) => {
    if (validarRequestIdBody(req)) {
        const retorno = await remover(req.body.id, req.body.email);
        return res.send({sucesso: retorno});
    }

    return res.status(404).json({mensagem: "Usuário não encontrado"});
});

router.put('/', validarJWT, async (req, res) => {
    
    if (validarRequestIdBody(req)) {
        const dados = await alterar(req.body);
        return res.json({mensagem: "Alterado com sucesso"});
    }
    
    return res.status(404).json({mensagem: "Usuário não encontrado"});
});

function validarRequestIdBody(request) {
    return request.body && request.body.id && request.body.email;
}


module.exports = router;