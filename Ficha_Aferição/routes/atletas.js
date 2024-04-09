var express = require('express');
var router = express.Router();
var atletas = require('../controllers/atletas')

/* GET home page. */
router.get('/', function(req, res, next) {
  atletas.list()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.post('/', function(req, res, next) {
  atletas.insert(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
}
);

router.put('/:id', function(req, res, next) {
  atletas.update(req.params.id, req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
}
);

router.delete('/:id', function(req, res, next) {
  atletas.delete(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
}
);

module.exports = router;
