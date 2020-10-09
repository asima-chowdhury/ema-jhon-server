const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h85k4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
const port = 5000

app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("emaJhonStore").collection("products");
    const ordersCollection = client.db("emaJhonStore").collection("orders");
    console.log('db connected')

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        // console.log(product)
        productsCollection.insertMany(product)
            .then(result => {
                res.send(insertedCount)
            })
    })
    app.get('/products', (req, res) => {
        const search = req.query.search;
        productsCollection.find({name :{$regex: search}})
            .toArray((err, documents) => {
                res.send(documents)
            })
    })
    app.get('/products/:key', (req, res) => {
        productsCollection.find({ key: req.params.key })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })
    app.post('/productsByKeys',(req, res) => {
        const productKeys = req.body;
        productsCollection.find({key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })
    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0)
        })
    })
    app.get('/', (req, res)=>{
        res.send('DB is working')
    })
});

app.listen(port)