const {Schema, model} = require('mongoose');

const TokensInvalid = Schema
({
    token:
    {
        type: String,
    },
});

TokensInvalid.methods.toJSON = function()
{
    const {__v, password, _id, ...tokenInvalid} = this.toObject();

    // Cambio el nombre de _id a uid
    tokenInvalid.uid = _id;

    return tokenInvalid;
}

module.exports = model('TokensInvalid', TokensInvalid);