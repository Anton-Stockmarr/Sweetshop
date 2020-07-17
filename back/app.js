const express = require('express');
const app = express();
const db = require('./database/connection');
const port = 3000;

function isUniqueConstraintError(err){
    if (!err) return false;
    let uniqueError = `duplicate key value violates unique constraint`;
    return err.message.indexOf(uniqueError) !== -1;
}

app.listen(port, () => {
    console.log(`database connection listening at http://localhost:${port}`);
    });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "get");
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
        return;
    }
    let regex = /^[^@]+@[^\.]+\..+$/;
    if (!regex.test(email)){
        res.status(400).send('Invalid mail');
        return;
    }

    db('Users').returning('id').insert({ 'name': name, 'email': email})
        .then( data => {
            console.log(data);
            res.status(200).send(data);
            return;
        })
        .catch(err => {
            console.log(err.message);
            if (isUniqueConstraintError(err)){
                res.status(400).send("User already exists");    
            } else {
                res.status(500).send("An error occured");
            }
            return;   
        });
})