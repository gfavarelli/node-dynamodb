const crypto = require('crypto');
const AWS = require("aws-sdk");
const { encrypt, getSenhaDecrypt }  = require('./../utils/crypto');

const awsConfig = {
    "region": "sa-east-1",
    "endpoint": "http://dynamodb.sa-east-1.amazonaws.com",
    "accessKeyId": "SUA_KEY_ID", "secretAccessKey": "SUA_ACCESS_KEY"
};

AWS.config.update(awsConfig);
const dynamoDb = new AWS.DynamoDB.DocumentClient();

async function salvar(bodyRequest) {
    const senhaEncrypt = encrypt(bodyRequest.senha);

    bodyRequest.id = crypto.randomBytes(32).toString('hex');
    bodyRequest.ativo = true;
    bodyRequest.cadastro = new Date().toString();
    bodyRequest.senha = senhaEncrypt;

    console.log(bodyRequest);
    var params = {
        TableName: "Usuario",
        Item:  bodyRequest
    };

    try {
        const data = await dynamoDb.put(params).promise();
        return bodyRequest;
    } catch (err) {
        return null;
    }
}

async function remover(id, email) {
    var params = {
        TableName: 'Usuario',
        Key: {
            id: id,
            email: email
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

async function buscaPorEmailSenha(email, senha) {
    try {
        
        var params = {
            TableName: "Usuario",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        }

        const dados = await dynamoDb.scan(params).promise();
        
        if (dados && dados.Items) {
            const usuario = dados.Items[0];
            const senhaDecrypt = getSenhaDecrypt(usuario.senha);
            return (senha === senhaDecrypt) ? usuario : null
        }
        
        return null;
    } catch (err) {
        return null;
    }
}

async function buscaPorEmail(email) {
    try {
        var params = {
            TableName: "Usuario",
            FilterExpression: "email = :email",
            ExpressionAttributeValues: {
                ":email": email
            }
        }

        const dados = await dynamoDb.scan(params).promise();
        return dados.Items[0];
    } catch (err) {
        return null;
    }
}

async function alterar(usuario) {
    var params = {
        TableName: "Usuario",
        Key: { "id": usuario.id, "email": usuario.email },
        UpdateExpression: "set nome = :nome",
        ExpressionAttributeValues: {
            ":nome": usuario.nome,
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
    buscaPorEmail,
    alterar,
    buscaPorEmailSenha
}
        