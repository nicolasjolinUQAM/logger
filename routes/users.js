var express = require('express');
var router = express.Router();
var appLogger = require('../applogger');

/* GET users listing. */
router.get('/', function(ctx, next) {
  ctx.res.send('respond with a resource');
  appLogger.error('No registered users');
});

module.exports = router;
