//import package mongoose
const mongoose = require('mongoose');
//kita import konfigurasi terkait mongoDB dari app/config.js
const { dbHost, dbName, dbPort, dbUser, dbPass } = require('../app/config');
//connect ke mongodb menggunakan konfigurasi yang telah kita import
mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}:${dbPort}/${dbName}`,
    {
        useNewUrlParser: true,
        useUnifiedTopology:true,
        // useFindAndModify: false, 
        // useCreateIndex: true
    }
);

//simpan koneksi dalam constant db
const db = mongoose.connection;
//export db supaya bisa digunakan oleh file lain
module.exports = db;