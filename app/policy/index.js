const { AbilityBuilder, Ability } = require('@casl/ability');

const policies = {
    guest(user, {can}) {
        can('read', 'Product');
    },
    user(user, {can}){
        //membaca daftar order
        can('view', 'Order');
        //membuat order
        can('create', 'Order');
        //membaca order miliknya
        can('read', 'Order', {_id: user._id});
        //mengupdate dirinya sendiri
        can('update', 'User', {_id: user._id});
        //membaca cart miliknya
        can('read', 'Cart', {_id: user._id});
        //mengupdate cart miliknya
        can('update', 'Cart', {_id: user._id});
        //melihat daftar delivery address
        can('view', 'DeliveryAddress');
        //membuat delivery address
        can('create', 'DeliveryAddress', {_id: user._id});
        //membaca delivery address miliknya
        can('read', 'DeliveryAddress', {_id: user._id});
        //mengupdate delivery address miliknya sendiri
        can('update', 'DeliveryAddress', {_id: user._id});
        //menghapus delivery address miliknya
        can('delete', 'DeliveryAddress', {_id: user._id});
        //membaca invoice miliknya
        can('read', 'Invoice', {_id: user._id});
    },
    admin(user, {can}){
        can('manage', 'all');
    }
}

function policyFor(user){
    let builder = new AbilityBuilder();
    
    if(user && typeof policies[user.role] === 'function'){
        policies[user.role](user, builder);
    }else{
        policies['guest'](user, builder);
    }

    return new Ability(builder.rules);
}

module.exports = {
    policyFor
}