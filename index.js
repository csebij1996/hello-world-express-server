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
  } catch(err){
    return '';
  }
}

const path = require('path');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'home.html'));
})

app.use(express.static('public'));

app.get('/cars', (req, res) => {

    const client = getClient();
    client.connect(async err => {
      const collection = client.db("taxi_app").collection("cars");
      // perform actions on the collection object
      const cars = await collection.find().toArray();
      res.send(cars);
      client.close();
    });

});

app.get('/cars/:id', (req, res) => {
  const id = getId(req.params.id);

  if(!id) {
    res.send({error: 'invalid id'});
    return;
  }

  const client = getClient();
  client.connect(async err => {
    const collection = client.db("taxi_app").collection("cars");
    // perform actions on the collection object
    const car = await collection.findOne( {_id: id} );
    if(!car) {
      res.send({error: 'not found'});
      return;
    }
    res.send(car);
    client.close();
  });

});

app.delete('/cars/:id', (req, res) => {

  const id = getId(req.params.id);
  if(!id) {
    res.send({error: 'invalid id'});
    return;
  }

  const client = getClient();
  client.connect(async err => {
    const collection = client.db("taxi_app").collection("cars");
    // perform actions on the collection object
    const result = await collection.deleteOne( {_id: id} );
    if(!result.deletedCount) {
      res.send({error: 'not found'});
      return;
    }
    res.send({id: id});
    client.close();
  });
});

const bodyParser = require('body-parser');

app.put('/cars/:id', bodyParser.json(), (req, res) => {
  
  const id = getId(req.params.id);
  if(!id) {
    res.send({error: 'invalid id'});
    return;
  }
  
  const editedCar = {
    name: req.body.name,
    licenseNumber: req.body.licenseNumber,
    hourlyRate: req.body.hourlyRate,
  }

  const client = getClient();
  client.connect(async err => {
    const collection = client.db("taxi_app").collection("cars");
    // perform actions on the collection object
    const cars = await collection.updateOne({_id: id}, {$set: editedCar});
    if(!cars.modifiedCount) {
      res.send({ error: 'not found!' });
      return;
    }
    res.send(editedCar);
    client.close();
  });

});


app.post('/cars/', bodyParser.json(), (req, res) => {

    const newCar = {
      name: req.body.name,
      licenseNumber: req.body.licenseNumber,
      hourlyRate: req.body.hourlyRate,
      trips: []
    }
  
    const client = getClient();
    client.connect(async err => {
      const collection = client.db("taxi_app").collection("cars");
      // perform actions on the collection object
      const cars = await collection.insertOne(newCar);
      if(!cars.insertedId) {
        res.send({ error: 'not found!' });
        return;
      }
      res.send(newCar);
      client.close();
    });

});

app.post('/trips', bodyParser.json(), (req, res) => {
  const newTrip = {
    numberOfMinutes: req.body.numberOfMinutes,
    date: Math.floor(Date.now() / 1000)
  }


  const id = getId(req.body.carId);
  if(!id) {
    res.send({error: 'invalid id'});
    return;
  }

  const client = getClient();
  client.connect(async err => {
    const collection = client.db("taxi_app").collection("cars");
    // perform actions on the collection object
    const cars = await collection.findOneAndUpdate
    (
      {_id: id}, 
      { $push: {trips: newTrip} }, 
      { returnDocument: 'after' } 
    );
    if(!cars.ok) {
      res.send({ error: 'not found!' });
      return;
    }
    res.send(cars.value);
    client.close();
  });

});





app.listen(3000);