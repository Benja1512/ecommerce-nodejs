const express = require("express");
const {Product} = require("../models/product");
const {Category} = require("../models/category");
const router = express.Router();
const mongoose = require('mongoose');

//Get a product and list of a products REST API

  // router.get('/', async (req, res) => {
  //         const productList = await Product.find(); //.select('name image -_id');
  //        if(!productList){
  //              res.status(500).json({success: false})
  //        }
  //         res.send(productList);
  //    })



// Filtering and getting producs by category


    router.get('/', async (req, res) => {
        //localhost:3000/api/v1/products?categories=2342342,232234
        let filter = {};
        if(req.query.categories)
        {
            filter = {category:req.query.categories.split(',')}
        }

        const productList = await Product.find(filter).populate('category');

        if(!productList){
            res.status(500).json({success: false})
        }
        res.send(productList);
    })


//show category details in the product - populate

    router.get('/:id', async (req, res) => {
        const product = await Product.findById([req.params.id]).populate('category');

        if(!product){
            res.status(500).json({success: false})
        }
        res.send(product);
    })

//Update a products REST API

    router.post('/', async(req, res) => {
        const category = await Category.findById(req.body.category);
        if(!category) return res.status(400).send('invalid Category')

        let product = new Product({
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,

             })

        product = await product.save();

        if(!product)
            return res.status(500).send('the product cannot be created')
            res.send(product);

    })

//Validate a product REST API

    router.put('/:id',async (req, res) => {
        if(!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send('invalid Product Id')
        }
        const category = await Category.findById(req.body.category);
        if(!category) return res.status(400).send('invalid Category')

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                description: req.body.description,
                richDescription: req.body.richDescription,
                image: req.body.image,
                brand: req.body.brand,
                price: req.body.price,
                category: req.body.category,
                countInStock: req.body.countInStock,
                rating: req.body.rating,
                numReviews: req.body.numReviews,
                isFeatured: req.body.isFeatured,
            },
            {new: true}
        )

        if (!product)
            return res.status(500).send('the product cannot be updated!')

        res.send(product);
    })

//delete  a product with REST API

    router.delete('/:id',(req, res) => {
        Product.findByIdAndRemove(req.params.id).then(product => {
            if(product){
                return res.status(200).json({success: true, message: 'the product is delete!'})
            } else {
                return res.status(404).json({success: false , message: "product not found!"})
            }
        }).catch(err => {
            return res.status(400).json({success:false, error: err})
        })
    })

//get products count for statistics purposes

    router.get('/get/count', async (req, res) => {
        const productCount = await Product.countDocuments();
        if(!productCount){
            res.status(500).json({success: false})
        }
        res.send({
            productCount: productCount
        });
    })


// Get feature products API REST

    router.get('/get/featured/:count', async (req, res) => {
        const  count = req.params.count ? req.params.count : 0
        const products = await Product.find({isFeatured: true}).limit(+count);

        if(!products){
            res.status(500).json({success: false})
        }
        res.send(products);
    })



module.exports = router;

