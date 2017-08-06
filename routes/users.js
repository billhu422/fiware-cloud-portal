var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('hello!')
  //res.render('users', { title: 'Users' });
});

module.exports = router;
