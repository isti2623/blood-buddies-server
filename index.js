const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');

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
            console.log(bloodPostReq);
            res.json(result)
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