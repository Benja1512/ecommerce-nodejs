const express = require("express");
const {User} = require("../models/user");
const {Category} = require("../models/category");
const router = express.Router();
const bcrypt = require("bcryptjs");


// LIST OF USER
router.get(`/`, async (req, res) => {
    const userList = await User.find().select("-passwordHash");

    if (!userList) {
        res.status(500).json({sucess: false})
    }
    res.send(userList);
})


//SINGLE USERS
router.get('/:id', async (req, res) => {
    const users = await User.findById(req.params.id).select("-passwordHash");

    if (!users) {
        res.status(500).json({message: 'the users with the given ID was not found'})
    }
    res.status(200).send(users);

})


//post and register a new users
router.post('/',
    async (req, res) => {

        let user = new User({

            name: req.body.name,
            email: req.body.email,
            color: req.body.color,
            passwordHash: bcrypt.hashSync(req.body.password, 10),
            phone: req.body.isAdmin,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        })

        user = await user.save();

        if (!user)
            return res.status(400).send('the user cannot be created!')

        res.send(user);
    })


//Update user data with / without password
router.put('/:id',async (req, res) => {
    
    const userExist = await User.findById(req.params.id);
        let newPassword
        if(req.body.password){
            newPassword = bcrypt.hashSync(req.body.password, 10)
            } else {
            newPassword = userExist.passwordHash;
            }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            color: req.body.color,
            passwordHash: newPassword,
            phone: req.body.isAdmin,
            isAdmin: req.body.isAdmin,
            apartment: req.body.apartment,
            zip: req.body.zip,
            city: req.body.city,
            country: req.body.country,
        },
        {new: true}
    )

    if (!user)
        return res.status(400).send('the user cannot be created!')

    res.send(user);
})


//Login a User REST API & creating a token
router.post('/login', async (req,res) => {
    const user = await User.findOne({email: req.body.email})

    if(!user) {
        return res.status(400).send('the user not found');
    }

    if(user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
        res.status(200).send('user Authenticated')
    } else {
        res.status(400).send('password is wrong!');
    }

    return res.status(200).send(user);



})



module.exports = router;