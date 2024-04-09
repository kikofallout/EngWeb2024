var Atletas = require('../models/atletas');

module.exports.list = () => {
    return Atletas
        .distinct('desportos')
        // sorts by sport name
        .exec()
}

module.exports.listModalidade = modalidade => {
    return Atletas
        .find({desportos: modalidade})
        .sort({nome: 1})
        .exec()
}