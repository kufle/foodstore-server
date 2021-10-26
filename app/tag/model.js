const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const tagSchema = Schema({
    name: {
        type: String,
        minlength: [3, 'Minimum 3 character length'],
        maxlength: [100, 'Maxmimum 100 character length'],
        required: [true, 'Tag name required']
    }
});

module.exports = model('tag', tagSchema);