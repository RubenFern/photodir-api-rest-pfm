const {Schema, model} = require('mongoose');

const TokensNoValidos = Schema
({
    token:
    {
        type: String,
    },
});

TokensNoValidos.methods.toJSON = function()
{
    const {__v, password, _id, ...tokensNoValidos} = this.toObject();

    // Cambio el nombre de _id a uid
    tokensNoValidos.uid = _id;

    return tokensNoValidos;
}

module.exports = model('TokensNoValido', TokensNoValidos);