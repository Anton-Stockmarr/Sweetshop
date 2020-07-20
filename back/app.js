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

app.listen(port, () => {
    console.log(`database connection listening at http://localhost:${port}`);
    });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "get, post");
    next();
  });


app.get('/api/items', (req,res) => {
    db.select().from('Items').then( data => {
        res.send(data);
    });
})


app.get('/api/users', (req,res,next) => {
    const email = req.query.email;
    console.log(`req: GET ${req.url}`);
    if (!email) {
        res.status(400).send('Empty email input');
        return;
    }
    db('Users').where('email',email).select('id')
        .then( data => {
            if (data.length === 0) {
                res.status(404).send('User does not exist');
            } else {
                res.send(data[0]);
            }
        })
        .catch(err => {
            console.log(err.message);
            res.status(500).send("An error occured");
            return;
        });
})

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
            console.log(data);
            res.status(200).send(data);
            return next();
        })
        .catch(err => {
            console.log(err.message);
            if (isUniqueConstraintError(err)){
                res.status(400).send("User already exists");    
            } else {
                res.status(500).send("An error occured");
            }
            return next();   
        });
});


app.get('/api/orders', (req,res,next) => {
    const user = req.query.user;

    if (!user){
        res.status(400).send('Empty input');
        return next();
    }

    

    res.status(500).send('not really implemented yet');
    return next();
});

app.post('/api/orders', (req,res,next) => {
    console.log(`req: POST ${req.url}`);
    console.log(`body: ${JSON.stringify(req.body.data)}`);
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
        .catch( err => {
            console.log(err.message);
            res.status(500).send("An error occured");     
            return next();
        });
});