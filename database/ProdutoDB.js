const crypto = require('crypto');
const AWS = require("aws-sdk");
const { AwsConfig } = require('../config/Credenciais');

const tableName = "Produto";
AWS.config.update(AwsConfig);
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function salvar(bodyRequest) {

    bodyRequest.Id = crypto.randomBytes(32).toString('hex');
    bodyRequest.ativo = true;
    bodyRequest.cadastro = new Date().toString();

    var params = {
        TableName: tableName,
        Item: bodyRequest
    };

    try {
        await dynamoDb.put(params).promise();
        return bodyRequest;
    } catch (err) {
        console.log('err', err);
        return null;
    }
}

async function remover(id) {
    var params = {
        TableName: tableName,
        Key: {
            Id: id
        }
    }

    try {
        const item = await dynamoDb.delete(params).promise();
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
}

async function buscaPorCategoria(categoria) {
    try {
        var params = {
            TableName: tableName,
            FilterExpression: "categoria = :categoria",
            ExpressionAttributeValues: {
                ":categoria": categoria
            }
        }

        const dados = await dynamoDb.scan(params).promise();
        return dados.Items[0];
    } catch (err) {
        console.log('err', err);
        return null;
    }
}

async function alterar(produto) {
    var params = {
        TableName: tableName,
        Key: { Id: produto.id},
        UpdateExpression: "set nome = :nome, descricao = :descricao, categoria = :categoria",
        ExpressionAttributeValues: {
            ":nome": produto.nome,
            ":descricao": produto.descricao,
            ":categoria": produto.categoria
        },
        ReturnValues: "UPDATED_NEW"
    };

    try {
        const dados = await dynamoDb.update(params).promise();
        return dados;
    } catch (err) {
        console.log('Update', err);
    }
}

module.exports = {
    salvar,
    remover,
    alterar,
    buscaPorCategoria
}
