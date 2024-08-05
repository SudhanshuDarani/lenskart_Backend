const { Router } = require('express');
const EyeglassesModel = require('../model/Eyeglasses.model');

const eyeglassRoutes = Router();

// get request with functionalities
eyeglassRoutes.get('/', async (req, res) => {
    const { brand, size, shape, color, orderBy } = req.query;

    const query = {};
    if (brand) {
        query.title = { $in: brand };
    }
    if (size) {
        query.size = { $in: size }
    }
    if (shape) {
        query.shape = { $in: shape }
    }
    if (color) {
        query.color = { $in: color }
    }
    let sortObj = {};
    if (orderBy == "asc") {
        sortObj.price = 1
    } else if (orderBy == "desc") {
        sortObj.price = -1
    }
    try {
        const glasses = await EyeglassesModel.find(query).sort(sortObj);
        res.send(glasses);
    } catch (error) {
        res.send({ "msg": error.message });
    }
});

// for getting single product
eyeglassRoutes.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await EyeglassesModel.find({ _id: id });
        res.send(product);
    } catch (error) {
        res.send({ "msg": error.message });
    }
})

// adding products for admin only
eyeglassRoutes.post('/add', async (req, res) => {
    try {
        const glasses = new EyeglassesModel(req.body)
        await glasses.save();
        res.status(200).send({ "msg": "New eyeglasses added!!" ,glasses});
    } catch (error) {
        res.send({ "msg": error.message });
    }
});

// updating products for admin only
eyeglassRoutes.put('/updae/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const product = await EyeglassesModel.findById({ _id: id })
        if (!product) {
            return res.status(404).send({ "msg": `Product with ID: ${id} not found!` });
        }
        const updateBody = await EyeglassesModel.findByIdAndUpdate(id, updateData, { new: "true" })
        res.status(200).send({ "msg": `Product with ${id} has been updated!!`, updateBody })
        // await EyeglassesModel.findByIdAndUpdate({ _id: id })
    } catch (error) {
        res.send({ "msg": error.message });
    }
});

// deleting product for admin only 
eyeglassRoutes.delete('/delete/:id', async (req, res) => {
    const { id } = req.params
    try {
        await EyeglassesModel.findByIdAndDelete({ _id: id })
        res.send({ "msg": `Product with ${id} has been deleted!!` })
    } catch (error) {
        res.send({ "msg": error.message });
    }
});

module.exports = eyeglassRoutes;