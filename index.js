const express = require('express');
const app = express();
const ObjectId = require('mongodb').ObjectID;

function getClient() {
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb+srv://testUserr:ZXgtd5Ya@cluster0.vjsceyf.mongodb.net/?retryWrites=true&w=majority";
    return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
}

function getId(raw) {
    try{
        return new ObjectId(raw);
    }
    catch{
        return '';
    }
}

const path = require('path');
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'home.html'));
})
app.use(express.static('public'));

app.get('/munka', (req, res) => {
    
    const client = getClient();
    client.connect(async (err) => {
      const collection = client.db("work_app").collection("work");
      const result = await collection.find().toArray();
      res.send(result);
      client.close();
    });

});

app.delete('/munka/:id', (req, res) => {
    
    const id = getId(req.params.id);
    if(!id) {
        res.send({error: 'invalid ID'});
        return;
    }

    const client = getClient();
    client.connect(async (err) => {
      const collection = client.db("work_app").collection("work");
      const result = await collection.deleteOne({_id: id});
      if(!result.deletedCount) {
        res.send({error: 'not found'});
        return;
      }
      res.send({id: req.params.id});
      client.close();
    });

})

const bodyParser = require('body-parser');
app.post('/munka', bodyParser.json(), (req, res) => {
        
    const newWork = {
        month: req.body.month,
        day: req.body.day,
        hour: req.body.hour,
        type: req.body.type
    };

    const client = getClient();
    client.connect(async (err) => {
      const collection = client.db("work_app").collection("work");
      const result = await collection.insertOne(newWork);
      if(!result.insertedId) {
        res.send({error: 'insert error'});
        return;
      }
      res.send(newWork);
      client.close();
    });

})

app.listen(3000);