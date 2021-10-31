const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');

const User = require('../user/model');
const { getToken } = require('../utils/get-token');

async function register(req, res, next){
    try {
        const payload = req.body;

        let user = new User(payload);

        await user.save();

        res.json(user);
    } catch (err) {
        if(err && err.name === 'ValidationError'){
            return res.json({
                error: 1,
                message: err.message,
                fields: err.errors
            });
        }

        next(err);
    }
}

async function localStrategy(email, password, done){
    try {
        let user = await User
                        .findOne({email})
                        .select('-__v -createdAt -cart_items -token');
        //jika user tidak ditemukan , akhiri proses login
        if(!user) return done();

        //jika user ditemukan, cek password apakah sesuai atau tidak
        if(bcrypt.compareSync(password, user.password)){
            ({password, ...userWithoutPassword} = user.toJSON());
            //akhiri pengecekan , user berhasil login, berikan data user tanpa password
            return done(null, userWithoutPassword);
        }
    } catch (err) {
        done(err, null);
    }
    done();
}

async function login(req, res, next){
    //memanggi fungsi dari localStrategy
    passport.authenticate('local', async function(err, user){
        //jika ada error
        if(err) return next(err);
        //jika user tidak ditemukan
        if(!user) return res.json({error: 1, message: 'email or password incorrect'});
        //buat json web token
        let signed = jwt.sign(user, config.secretKey);
        //simpan token tersebut ke user terkait
        await User.findOneAndUpdate({_id: user._id}, {$push: {token: signed}}, {new: true});
        //response ke client
        return res.json({
            message: 'logged in successfully',
            user: user,
            token: signed
        });
    })(req, res, next);
}

function me(req, res, next){
    if(!req.user){
        return res.json({
            error: 1,
            message: `You're not login or token expired`
        });
    }
    
    return res.json(req.user);
}

async function logout(req, res, next){
    //dapatkan token dari request
    let token = getToken(req);
    //hapus token dari user
    let user = await User.findOneAndUpdate({token: {$in: [token]}}, {$pull: {token}}, {useFindAndModify: false});

    //jika user tidak ada atau token tidak ada
    if(!user || !token){
        return res.json({
            error: 1,
            message: 'User not found'
        });
    }

    // Logout
    return res.json({
        error: 0,
        message: 'Logout successfully'
    });
}

module.exports = {
    register,
    localStrategy,
    login,
    me,
    logout
}