const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
    const items = await Item.find({});
    res.render('index', {items});
});

router.get('/items/create', async (req, res, next) => {
    res.render('create');
});

router.get('/items/:id', async (req, res, next) => {
    const item = await Item.findById(req.params.id);
    res.render('item', {item});
});

router.post('/items/:id/delete', async (req, res, next) => {
    const item = await Item.findByIdAndRemove(req.params.id);

    if (!item) return res.status(400);
    res.redirect('/');
});

router.get('/items/:id/update', async (req, res, next) => {
    const item = await Item.findById(req.params.id);
    res.render('update', {item});
});

router.post('/items/:id/update', async (req, res, next) => {
    const item = await Item.findById(req.params.id);
    const updatedItem = Object.assign(item, req.body);

    updatedItem.validateSync();

    if (updatedItem.errors) {
        return res.status(400).render('update', {item});
    }

    await updatedItem.save();
    res.redirect(`/items/${req.params.id}`);
});

router.post('/items/create', async (req, res, next) => {
    const {title, description, imageUrl} = req.body;
    const newItem = new Item({title, description, imageUrl});

    newItem.validateSync();

    if (newItem.errors) {
        return res.status(400).render('create', {newItem});
    }

    await newItem.save();
    res.redirect('/');

});

module.exports = router;
