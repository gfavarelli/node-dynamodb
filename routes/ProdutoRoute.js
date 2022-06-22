const express = require('express');
const router = express.Router();
const { validarJWT } = require('../utils/jwt');
const { salvar, remover, alterar, buscaPorCategoria } = require('../database/ProdutoDB');


router.post('/',validarJWT, async (req, res) => {
    if (validarRequestProduto(req)) {
        const cadastro = await salvar(req.body);
        return res.send(cadastro);
    }
    return res.status(500).json({mensagem: "Produto não cadastrado"});
});

router.get('/buscaPorCategoria', validarJWT, async (req, res) => {
    if (!req.body || !req.body.categoria) {
        return res.status(404).json({mensagem: "Produto não encontrado"});    
    } 

    const dados = await buscaPorCategoria(req.body.categoria);
    if (dados) {
        return res.send(dados);
    }

    return res.status(404).json({mensagem: "Produto não encontrado"});
});

router.delete('/', validarJWT, async (req, res) => {
    if (req.body && req.body.id) {
        const retorno = await remover(req.body.id);
        return res.send({sucesso: retorno});
    }
    return res.status(404).json({mensagem: "Produto não encontrado"});
});

router.put('/', validarJWT, async (req, res) => {
    
    if (validarRequestProduto(req) && req.body.id) {
        const dados = await alterar(req.body);
        return res.json({mensagem: "Alterado com sucesso"});
    }

    return res.status(404).json({mensagem: "Produto não encontrado"});
});

function validarRequestProduto(request) {
    return request.body.nome && request.body.descricao && request.body.categoria
}

module.exports = router;