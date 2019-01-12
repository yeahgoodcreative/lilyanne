// Modules
var express = require('express')
var Router = express.Router

// Instantiate router
var router = new Router()

// Routes
router.get('/', function(req, res) {
    res.redirect('/orders')
})

router.get('/orders', function(req, res) {
    res.render('orders', {})
})

router.get('/orders/pack/1', function(req, res) {
    // console.log(req.query.orderid)

    res.render('orders-pack1', {orderId: req.query.orderid})
})

router.get('/orders/pack/2', function(req, res) {
    res.render('orders-pack2', {})
})

router.get('/orders/pack/3', function(req, res) {
    res.render('orders-pack3', {})
})

router.get('/orders/pack/4', function(req, res) {
    res.render('orders-pack4', {})
})

router.get('/inventory/items', function(req, res) {
    res.render('inventory-items', {})
})

router.get('/inventory/bins', function(req, res) {
    res.render('inventory-bins', {})
})

router.get('/inventory/locations', function(req, res) {
    res.render('inventory-locations', {})
})

// Export router
module.exports = router