const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const { query } = require('express');

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sovrt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db('blood-buddies');
        const bloodPostReqCollection = database.collection('bloodPostReq');
        const usersCollection = database.collection('userInfo');
        const reviewCollection = database.collection('review');


        //Blood Get Api
        app.get('/bloodPostReq', async (req, res) => {
            const cursor = bloodPostReqCollection.find({});
            const bloodPostReq = await cursor.toArray();
            res.send(bloodPostReq);
        })


        //Blood POST Api
        app.post('/bloodPostReq', async (req, res) => {
            const bloodPostReq = req.body;
            const result = await bloodPostReqCollection.insertOne(bloodPostReq);
            res.json(result)
        })

        //Blood Get Api email search
        app.get('/bloodPostReqDashboard', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const cursor = bloodPostReqCollection.find(query);
            const bloodPostReq = await cursor.toArray();
            res.send(bloodPostReq);
        })

        //User Sign up POST Api
        app.post('/userInfo', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.json(result);
        })

        //User google sign in  PUT/Upsert Api
        app.put('/userInfo', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email }
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        //Post add Reviews
        app.post("/addReviews", (req, res) => {

            reviewCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        //Post add Reviews
        app.post("/addReviews", (req, res) => {

            reviewCollection.insertOne(req.body).then((documents) => {
                res.send(documents.insertedId);
            });
        });

        //GET  Reviews API
        app.get('/addReviews', async (req, res) => {
            const cursor = reviewCollection.find({});
            const events = await cursor.toArray();

            res.send(events);
        })


    } finally {
        //await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Hello Blood Buddies!')
})

app.listen(port, () => {
    console.log(`listening at ${port}`)
})