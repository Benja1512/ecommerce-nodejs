const express = require('express')
const bodyParser = require("body-parser");
const {json} = require('express');
const cors = require('cors');
const app = express();
const port = 4000

const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv/config');


    // Initialization CORS
        app.use(cors());
        app.options('*', cors)


        //middleware
        app.use(bodyParser.json());
        app.use(morgan('tiny'))


    //routes
        const categoriesRoutes =require('./routes/categories');
        const productsRoutes =require('./routes/products');
        const usersRoutes =require('./routes/users');
        const ordersRoutes =require('./routes/orders');

        const api = process.env.API_URL;

        app.use(`${api}/categories`, categoriesRoutes);
        app.use(`${api}/products`, productsRoutes);
        app.use(`${api}/users`, usersRoutes);
        app.use(`${api}/orders`, ordersRoutes);


    //Database
        mongoose.connect(process.env.CONNECTION_STRING, {
            useNewUrlParser: true,
            dbName: 'eshop-database1'
            })
            .then(() => {
                console.log('Database Connection is ready...')
            })
            .catch((err) => {
                console.log(err);
            })


            app.listen(port, () => {

                console.log(`Example app listening on port ${port}`)
                console.log(api)
            })
