var express = require('express')
var app = express()
app.use(express.static('./dist'))
module.exports = app.listen(8830)