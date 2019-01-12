// Modules
var express = require('express')
var app = express()
var Router = express.Router

var http = require('http').Server(app)
var io = require('socket.io')(http)

var mustache = require('mustache-express')
var mongoose = require('mongoose')

// Models
var Order = require('./models/order')
var Item = require('./models/item')
var Bin = require('./models/bin')
var Location = require('./models/location')

// ByDesign
var bydesignOrders = require('./bydesignOrders')

// Routers
var routes = require('./routes')

// Sockets
var sockets = require('./sockets')

// Mongoose
mongoose.connect('mongodb://localhost/lilyannejewellery', {useNewUrlParser: true})

mongoose.connection.on('error', function(err) {
    if (err) throw err
})

mongoose.connection.once('open', function() {
    // Express Config
    app.engine('mustache', mustache())

    app.set('view engine', 'mustache')
    app.set('views', __dirname + '/views')

    app.use(express.static('public'))

    // Routers
    app.use('/', routes)

    // Sockets
    sockets(io)

    // Process bydesign orders
    // bydesignOrders()

    // Server Listener
    http.listen('8080', function() {
        console.log('[INFO] Server listening on localhost:8080.')
    })
})