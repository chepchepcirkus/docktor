var express = require('express')
var router = express.Router()
router.get('/', function(req, res) {
    res.render('about', {data:{title:'About', content:'version and source here'}})
})

module.exports = router