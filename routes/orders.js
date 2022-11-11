const express = require("express");
const {Order} = require("../models/order");
const router = express.Router();

router.get(`/`, async (req, res) => {
    const oderList = await Order.find();

    if(!orderList){
        res.status(500).json({sucess: false})
    }
    res.send(userOrder);
})

router.post(`/`, (req, res) => {
    const order = new Order({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    Order.save().then((createdOrder => {
        res.status(201).json(createdOrder)
    })).catch((error) => {
        res.status(500).json({
            error: err,
            success: false
        })
    })

})

module.exports =router;