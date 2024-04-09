var Atletas = require('../models/atletas');

module.exports.list = () => {
    return Atletas
        .find()
        .sort({nome: 1})
        .exec()

}

module.exports.insert = atleta => {
    return Atletas.create(atleta)
}

module.exports.update = (id, atleta) => {
    return Atletas.updateOne({_id: id}, atleta)
}

module.exports.delete = id => {
    return Atletas.deleteOne({_id: id})
}
