const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

// use middleware
app.use(cors());
app.use(express.json());

// name: dbuser1
// password: rDidOWrBwTmisEb0



const uri = "mongodb+srv://dbuser1:rDidOWrBwTmisEb0@cluster0.mdan8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const userCollection = client.db("foodExpress").collection("user");


        // DATA SHOW: Show on the server side 
        app.get('/user', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const user = await cursor.toArray();
            res.send(user);
        })

        // POST USER: add a new user
        app.post('/user', async (req, res) => {
            const newUser = req.body;
            console.log('data has passed', newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);
        })

        //DELETE the users
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        })

        // UPDATE: the user
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updatedUser.name,
                    email: updatedUser.email
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc, option);
            res.send(result);
        })

        // 
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })


    }
    finally {

    }
}
// async function run() {
//     try {
//         await client.connect();
//         const userCollection = client.db("foodExpress").collection("user");
//         const user = { name: "Sabreena Begum", email: "sabreena@gmail.com" };
//         const result = await userCollection.insertOne(user);
//         console.log(`User inserted with id ${result.insertedId}`);
//     }
//     finally {

//     }
// }

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running my node CRUD Server');
});


app.listen(port, () => {
    console.log('CRUD Server is Running');
})