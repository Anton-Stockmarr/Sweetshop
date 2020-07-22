const express = require('express');
const app = express();
const db = require('./database/connection');
const port = 3000;

app.use(express.json());

function isUniqueConstraintError(err){
    if (!err) return false;
    const uniqueError = `duplicate key value violates unique constraint`;
    return err.message.indexOf(uniqueError) !== -1;
}

function positiveQuantityConstraintError(err){
    if (!err) return false;
    const positiveError = `violates check constraint "Items_quantity_check"`;
    return err.message.indexOf(positiveError) !== -1;
}

function handleInternalError(err, res, next){
    console.log(err.message);
    if (isUniqueConstraintError(err)){
        res.status(409).send('duplicate key value violates unique constraint');
    } else if (positiveQuantityConstraintError(err)){
        res.status(400).send('Cannot order more items than there are available');
    } else {
        res.status(500).send("An error occured");
    }
    return next();
}

app.listen(port, () => {
    console.log(`database connection listening at http://localhost:${port}`);
    });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
    next();
  });


app.get('/api/items', (req,res, next) => {
    console.log(`req: GET ${req.url}`);
    db('Items').where('archived','FALSE').select('id','name','description','price','currency','quantity').then( data => {
        res.send(data);
        return next();
    });
});

app.post('/api/items/add', (req,res, next) => {
    console.log(`req: POST ${req.url}`);
    const item = req.body.data;
    if (!item){
        res.status(400).send('Missing data');
        return next();
    }
    if (!item.name || !item.description || !item.price || !item.currency || !item.quantity){
        res.status(400).send('Some fields were not defined');
        return next();    
    }
    db('Items').returning('id').insert({
        'name': item.name,
        'description': item.description,
        'price': item.price,
        "currency": item.currency,
        'quantity': item.quantity
    })
        .then( data => {
            res.status(200).send(data[0].toString());
            return next();
        })
        .catch(err => handleInternalError(err,res,next));
});


app.put('/api/items/archive', (req,res, next) => {
    console.log(`req: POST ${req.url}`);
    const item = req.query.item;
    if (!item) {
        res.status(400).send('No item specified');
        return next();
    }
    db('Items').where("id",item).update({'archived': 'TRUE'})
        .then(() => {
            res.status(200).send();
            return next();
        })
        .catch(err => handleInternalError(err,res,next));
});

app.put('/api/items/quantity', (req,res, next) => {
    console.log(`req: POST ${req.url}`);
    const item = req.query.item;
    const quantity = req.query.quantity;

    if (!item || !quantity){
        res.status(400).send('Item or quantity not specified');
        return next();
    }
    if (quantity < 0) {
        res.status(400).send('Quantity must be positive');
        return next();
    }
    db('Items').where('id',item).update({'quantity': quantity})
        .then( rows => {
            if (rows) {
                res.status(200).send('Update successful');
            } else {
                res.status(404).send('Item does not exist');
            }
            return next();
        })
        .catch( err => handleInternalError(err,res,next));
});


app.get('/api/users', (req,res,next) => {
    console.log(`req: GET ${req.url}`);
    const email = req.query.email;
    if (!email) {
        res.status(400).send('Empty email input');
        return next();
    }
    db('Users').where('email',email).select('id')
        .then( data => {
            if (data.length === 0) {
                res.status(404).send('User does not exist');
            } else {
                res.send(data[0]);
            }
            return next();
        })
        .catch(err => handleInternalError(err,res,next));
});

app.post('/api/users', (req,res,next) => {
    console.log(`req: POST ${req.url}`);
    const email = req.query.email;
    const name = req.query.name;
    if (!email || !name){
        res.status(400).send('Empty input');
        return next();
    }
    const regex = /^[^@]+@[^\.]+\..+$/;
    if (!regex.test(email)){
        res.status(400).send('Invalid mail');
        return next();
    }
    db('Users').returning('id').insert({ 'name': name, 'email': email})
        .then( data => {
            res.status(200).send({id: data[0]});
            return next();
        })
        .catch(err => handleInternalError(err,res,next));
});


app.get('/api/orders', (req,res,next) => {
    console.log(`req: GET ${req.url}`);
    const user = req.query.user;
    if (!user){
        res.status(400).send('Empty input');
        return next();
    }
    db('User_Orders').where('userid',user).select('orderid','order_time','items','amounts','total_price')
        .then( data => {
            if (data.length === 0) {
                res.status(200).send(data);
                return next();
            } else {
                data = data.map(order => {
                    let newObject = {
                        orderid: '',
                        order_time: '',
                        total_price: '',
                        items: []
                    };
                    newObject.orderid = order.orderid;
                    newObject.total_price = order.total_price;
                    let time = order.order_time.toString();
                    let date = time.split(' 2020',1)[0];
                    newObject.order_time = date;
                    const items = order.items.split(',');
                    const amounts = order.amounts.split(',');
                    newObject.items =[];
                    for (let i=0; i<items.length; i++){
                        newObject.items = [...newObject.items, {name: items[i], amount: amounts[i]}];
                    }
                    return newObject;
                })
                res.status(200).send(data);
                return next();
            }
        })
        .catch(err => handleInternalError(err,res,next));
});

app.post('/api/orders', (req,res,next) => {
    console.log(`req: POST ${req.url}`);
    const user = req.body.data.user;
    const items = req.body.data.items;

    if (!user || !items){
        res.status(400).send('user and items must be defined to place an order');
        return next();
    }
    if (items.length === 0) {
        res.status(400).send('Cannot place an empty order');
        return next();
    }
    db('Temporary_Order').truncate()
        .then(() => db('Temporary_Order').insert(items))
        .then(() => db.raw(`CALL addOrder(${user}, 0)`))
        .then((result) => {
            res.status(200).send(result.rows[0].orderid.toString());
            return next();
            })
        .catch(err => handleInternalError(err,res,next));
});