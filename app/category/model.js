const mongoose = require('mongoose');
const { model, Schema } = mongoose;

let categorySchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Category name minimum 3 character length'],
        maxlength: [50, 'Category name maximum 50 character length'],
        reuqired: [true, 'Category name required']
    }
});

module.exports = model('Category', categorySchema);