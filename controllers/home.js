var express = require('express');
var router = express.Router();
router.get('/', function(req, res) {
    req.app.renderData.data = {title:'Docktor', content:'Welcome here'};
    res.render('default', req.app.renderData)
});

module.exports = router