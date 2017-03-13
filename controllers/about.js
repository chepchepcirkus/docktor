var express = require('express')
var router = express.Router()
router.get('/', function(req, res) {
    req.app.renderData.data = {title:'About', content:'version and source here'};
    res.render('about', req.app.renderData);
})

module.exports = router