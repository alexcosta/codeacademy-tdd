const mongoose = require('mongoose');

module.exports = mongoose.model(
    'Item',
    // Define your model schema below:
    mongoose.Schema({
        title: {
            required: [true, 'title is required'],
            type: String
        },
        description: {
            required: [true, 'description is required'],
            type: String
        },
        imageUrl: {
            required: [true, 'imageUrl is required'],
            type: String
        },
    })
);
