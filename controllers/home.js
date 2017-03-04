var express = require('express')
var router = express.Router()
router.get('/', function(req, res) {
    res.render('default', {data:{title:'Docktor', content:'Welcome here'}})
})

module.exports = router