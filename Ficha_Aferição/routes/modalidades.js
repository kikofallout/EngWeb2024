var express = require('express');
var router = express.Router();
var modalidades = require('../controllers/modalidades')

/* GET home page. */

router.get('/', function(req, res, next) {
    modalidades.list()
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
    });

router.get('/:modalidade', function(req, res, next) {
    modalidades.listModalidade(req.params.modalidade)
        .then(dados => res.jsonp(dados))
        .catch(erro => res.status(500).jsonp(erro))
    }
);

module.exports = router;