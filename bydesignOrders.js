

var bydesignOrders = function() {
    // Modules
    var soap = require('soap')

    // Mongoose Models
    var Order = require('./models/order')

    // Soap URL
    var url = 'https://api.securefreedom.com/lilyannedesigns/webservice/orderapi.asmx?wsdl'

    // Soap Client
    soap.createClient(url, function(err, client) {

        // Get order list recent
        client.GetOrderListRecent({
            Credentials: {
                Username: 'IntegrationAPI',
                Password: 'sf!9]3NV^vh[_53D',
                Token: ''
            },
            PeriodType: 'week',
            PeriodLength: 4,
            EvalDateLastModified: 'false'
        }, 
        function(err, result) {
            // Throw error
            if (err) throw err

            // Get order list from result
            var orderList = result.GetOrderListRecentResult.OrderList

            // Iterate through order list
            for (order of orderList) {
                // Create order promise
                var orderPromise = new Promise(function(resolve, reject) {
                    // Store order object in this promise
                    var currentOrder = order

                    // Create order info promise
                    var orderInfoPromise = client.GetOrderInfo_V2Async({
                        Credentials: {
                            Username: 'IntegrationAPI',
                            Password: 'sf!9]3NV^vh[_53D',
                            Token: ''
                        },
                        OrderID: order.OrderID
                    })

                    // Create order details info promise
                    var orderDetailsInfoPromise = client.GetOrderDetailsInfo_V2Async({
                        Credentials: {
                            Username: 'IntegrationAPI',
                            Password: 'sf!9]3NV^vh[_53D',
                            Token: ''
                        },
                        OrderID: order.OrderID
                    })

                    // Get promised data from promises
                    Promise.all([orderInfoPromise, orderDetailsInfoPromise]).then(function(results) {
                        // Get order info & order details info from result
                        var orderInfo = results[0][0].GetOrderInfo_V2Result
                        var orderDetailsInfo = results[1][0].GetOrderDetailsInfo_V2Result

                        // Resolve promise with object
                        resolve({
                            order: currentOrder,
                            orderInfo: orderInfo,
                            orderDetailsInfo: orderDetailsInfo
                        })
                    })
                })

                // Get promised data from order promise
                orderPromise.then(function(result) {

                    // Remap result
                    var order = result.order
                    var orderInfo = result.orderInfo
                    var orderDetailsInfo = result.orderDetailsInfo

                    // Create status field
                    var status = ''

                    // Set status field
                    if (orderInfo.Status == 'Entered') {
                        status = 'waiting-payment'
                    }
                    else if (orderInfo.Status == 'Posted') {
                        status = 'ready-to-pack'
                    }
                    else if (orderInfo.Status == 'Shipped') {
                        status = 'complete'
                    }
                    else if (orderInfo.Status == 'Void') {
                        status = 'void'
                    }

                    // Create items array
                    var items = []

                    // Check order details response exists
                    if (orderDetailsInfo.OrderDetailsResponse) {
                        // Iterate through items
                        for (item of orderDetailsInfo.OrderDetailsResponse.OrderDetailsResponseV2) {
                            // Push item to items array
                            items.push({
                                itemId: item.ProductID,
                                description: item.Description,
                                quantity: item.Quantity,
                                price: item.Price,
                                volume: item.Volume,
                                tax: item.Tax,
                                taxableAmount: item.TaxableAmount
                            })
                        }
                    }

                    // Create new order
                    var order = new Order({
                        orderId: orderInfo.OrderID,
                        customerId: orderInfo.RepNumber,
                        status: status,
                        orderDate: orderInfo.OrderDate,

                        billName1: orderInfo.BillName1,
                        billName2: orderInfo.BillName2,
                        billStreet1: orderInfo.BillStreet1,
                        billStreet2: orderInfo.BillStreet2,
                        billCity: orderInfo.BillCity,
                        billState: orderInfo.BillState,
                        billPostalCode: orderInfo.BillPostalCode,
                        billCounty: orderInfo.BillCounty,
                        billCountry: orderInfo.BillCountry,
                        billEmail: orderInfo.BillEmail,
                        billPhone: orderInfo.BillPhone,

                        shipName1: orderInfo.ShipName1,
                        shipName2: orderInfo.ShipName2,
                        shipStreet1: orderInfo.ShipStreet1,
                        shipStreet2: orderInfo.ShipStreet2,
                        shipCity: orderInfo.ShipCity,
                        shipState: orderInfo.ShipState,
                        shipPostalCode: orderInfo.ShipPostalCode,
                        shipCounty: orderInfo.ShipCounty,
                        shipCountry: orderInfo.ShipCountry,
                        shipEmail: orderInfo.ShipEmail,
                        shipPhone: orderInfo.ShipPhone,

                        invoiceNotes: orderInfo.InvoiceNotes,
                        shipMethodId: orderInfo.ShipMethodID,
                        shipMethod: orderInfo.ShipMethod,
                        market: orderInfo.Market,
                        rankPriceType: orderInfo.RankPriceType,
                        partyId: orderInfo.PartyID,
                        currencyTypeId: orderInfo.CurrencyTypeID,
                        giftOrder: orderInfo.GiftOrder,
                        alternateShipMethodId: orderInfo.AlternateShipMethodID,

                        items: items
                    })

                    // // Save order
                    // order.save(function(err, order) {
                    //     // Throw error
                    //     if (err) throw err

                    //     // DEBUG
                    //     console.log('Saved an order')
                    // })
                })
            }

        })

    })
}

module.exports = bydesignOrders