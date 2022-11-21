const express = require("express");
const {Order} = require("../models/order");
const {Category} = require("../models/category");
const {OrderItem} = require("../models/order-item");
const {Product} = require("../models/product");

const router = express.Router();


router.get(`/`, async (req, res) => {

    const oderList = await Order.find()
        .populate('user', 'name').sort({'dateOrdered':-1})
        .populate({
            path: 'orderItems', populate: {
                path: 'product', populate: 'category'}
        });

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

    const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
    const orderItem = await OrderItem.findById(orderItemId).populate('product', 'price');
    const totalPrice = orderItem.product.price * orderItem.quantity;
    return totalPrice
    }))
   const totalPrice = totalPrice.reduce((a,b) =>  a + b, 0)
    console.log(totalPrices)

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
        totalPrice: totalPrice,
        user: req.body.user,
    })

    //Guardo el objeto order

    order = await order.save();


    if (!order)
        return res.status(400).send('the order cannot be created!')

    res.send(order);
})


router.put('/:id',async (req, res) => {
    const order = await Order.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        {new: true}
    )
    if (!order)
        return res.status(400).send('the order cannot be created!')

    res.send(order);
})


// Add and delete categories

router.delete('/:id',(req, res) => {
    Order.findByIdAndRemove(req.params.id).then(order => {
        if(order){
            return res.status(200).json({success: true, message: 'the Order is delete!'})
        } else {
            return res.status(404).json({success: false , message: "Order not found!"})
        }
    }).catch(err => {
        return res.status(500).json({success:false, error: err})
    })
})

router.get('/get/totalsales', async (req, res) => {
    const totalSales = await Order.aggregate([
        { $group: { _id: null, totalsales : { $sum : '$totalPrice'}}}
    ])

    if (!totalSales) {
        return res.status(400).send('the order sales cannot be generated')
    }

    res.send({totalsales: totalSales.pop().totalsales})
    })

router.get('/get/count', async (req, res) => {
   const orderCount = await Order.countDocuments();


    if (!orderCount) {
        res.status(500).json({success: false})
    }

    res.send({
        orderCount: orderCount
    });
})




router.get(`/get/userorders/:userid`, async (req, res) => {
    const userOrderList = await Order.find({user: req.params.userid}).populate({
        path: 'orderItems', populate: {
            path: 'product', populate: 'category'}
    }).sort({'dateOrdered': -1});
    
    if (!userOrderList) {
        res.status(500).json({success: false})
    }
    res.send(userOrderList);
})

module.exports = router


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
