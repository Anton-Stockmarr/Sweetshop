const express = require('express');
const app = express();
const db = require('./database/connection');
const port = 3000;

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
    let email = req.query.email;
    console.log(`req: /api/users?email=${email}`)
    db('Users').where('email',email).select('id').then( data => {
        if (data.length === 0) {
            error = new Error(`User does not exist`);
            error.statusCode = 404;
            return next(error);    
        }
        console.log(data);
        console.log(data[0]);
        res.send(data[0]);
    });
})

app.listen(port, () => {
    console.log(`database connection listening at http://localhost:${port}`);
    });

