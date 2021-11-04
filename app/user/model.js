const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const bcrypt = require('bcrypt');
const HASH_ROUND = 10;

const AutoIncrement = require('mongoose-sequence')(mongoose);

const userSchema = Schema({
    full_name: {
        type: String,
        required: [true, 'Name required'],
        maxlength: [255, 'Name maximum 255 character length'],
        minlength: [3, 'Name minimum 3 character length']
    },
    customer_id: {
        type: Number
    },
    email: {
        type: String,
        required: [true, 'Email required'],
        maxlength: [255, 'Email maximum 255 character length'],
        minlength: [3, 'Email minimum 3 character length']
    },
    password: {
        type: String,
        required: [true, 'Password required'],
        maxlength: [255, 'Password maximum 255 character length'],
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    token: [String]
}, {timestamps: true});

userSchema.pre('save', function(next){
    this.password = bcrypt.hashSync(this.password, HASH_ROUND);
    next();
})

//cek validasi email
userSchema.path('email').validate(function(value){
    //Regex email
    const EMAIL_RE = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    //test email, hasilnya adalah true atau false
    //jika ternyata true maka validasi berhasil
    //jika ternyata false maka validasi gagal
    return EMAIL_RE.test(value);
}, attr => `${attr.value} email must valid`);

//cek apakah email sudah terdaftar
userSchema.path('email').validate(async function(value){
    try {
        //lakukan pencarian ke _collection_ User bedasarkan email
        const count = await this.model('User').count({email: value});
        //kode ini mengindikasikan bahwa jika user ditemukan akan mengembalikan 'false' jika tidak ditemukan mengembalikan 'true'
        //jika false maka validasi gagal
        //jika true maka validasi berhasil
        return !count;
    } catch (err) {
        throw err
    }
}, attr => `${attr.value} already registered`);

userSchema.plugin(AutoIncrement, {inc_field: 'customer_id'});

module.exports = model('User', userSchema);

