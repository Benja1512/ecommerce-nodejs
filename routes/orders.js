const express = require("express");
const {Order} = require("../models/order");
const {Category} = require("../models/category");
const {OrderItem} = require("../models/order-item");

const router = express.Router();


router.get(`/`, async (req, res) => {
    const oderList = await Order.find().populate('user', 'name').sort({'dateOrdered':-1});

    if (!orderList) {
        res.status(500).json({success: false})
    }
    res.send(orderList);
})

router.get(`/:id`, async (req, res) => {
    const oderList = await Order.findById(req.params.id).populate('user', 'name').sort({'dateOrdered':-1});

    let order;
    if (!order) {
        res.status(500).json({success: false})
    }
    res.send(order);
})


// Post a new order REST API

router.post('/', async (req, res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderItem => {
        let newOrderItem = OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product
        })

        let newOderItem = await newOrderItem.save();
        return newOrderItem._id;
    }))

    const orderItemsIdsResolved = await orderItemsIds;
    console.log(orderItemsIdsResolved)

    //creo el objeto para guardar
    let order = Order({
        orderItems: orderItemsIdsResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        country: req.body.country,
        phone: req.body.phone,
        status: req.body.status,
        totalPrice: req.body.totalPrice,
        user: req.body.user,
    })

    //guardo el objeto order
    order = await order.save();


    if (!order)
        return res.status(400).send('the order cannot be created!')

    res.send(order);
})

module.exports = router;


/**
 //ORDER EXAMPLE

 {
    "oderItems" : [
    {
        "quantity": 3,
        "product": "5fcfc406ae79b0a6a90d2585"
    }
     {
        "quantity": 2,
        "product": "5fd293c7d3abe7295b1403c4"
    }
    ],
    "shippingAddress1" : "Flowers Street, 45",
    "shippingAddress2" : "1-B",
    "city": "Prague",
    "zip": "00000",
    "country": "Czech Republic"
    "phone": "+42070224133",
    "user": "5fd51bc7e39ba856244a3b44"
}
 **/
