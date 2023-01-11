const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const port = process.env.PORT || 3000;

function nodejs() {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
}

app.use(express.static("public"));

app.get('/', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    res.sendFile(__dirname + '/home.html');
});

//read
app.get('/products', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    fs.readFile('./data/products.json', (err, file) => {
        res.send(JSON.parse(file));
    })
})

//read by id
app.get('/products/:egyediAzonosito', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    const id = req.params.egyediAzonosito;
    
    fs.readFile('./data/products.json', (err, file) => {
        const products = JSON.parse(file);
        const productById = products.find((product) => product.id === id);
        if(!productById) {
            res.status(404);
            res.send({error: `id:${id} not found`});
            return;
        }
        res.send(productById);

    })    

})

//create
app.post('/products', bodyParser.json(), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    let newProduct = {
        id: uid(),
        name: req.body.name,
        price: Number(req.body.price),
        isInStock: Boolean(req.body.isInStock)
    }

    fs.readFile('./data/products.json', (err, file) => {
        let products = JSON.parse(file);
        products.push(newProduct);
        fs.writeFile('./data/products.json', JSON.stringify(products), () => {
            res.send(newProduct);
        });
    })
})

//update
app.put('/products/:egyediAzonosito', bodyParser.json(), (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    const id = req.params.egyediAzonosito;

    fs.readFile('./data/products.json', (err, file) => {

        const products = JSON.parse(file);
        const productIndexById = products.findIndex(product => product.id===id);

        if(productIndexById===-1) {
            res.status('404');
            res.send('Hiba történt, ilyen ID nem létezik');
            return;
        }

        let updatedProduct = {
            id: id,
            name: req.body.name,
            price: Number(req.body.price),
            isInStock: Boolean(req.body.isInStock)
        }
        products[productIndexById] = updatedProduct;

        fs.writeFile('./data/products.json', JSON.stringify(products), () => {
            res.send(updatedProduct);
        });
        
    })

})

//delete
app.delete('/products/:egyediAzonosito', (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed
    
    const id = req.params.egyediAzonosito;

    fs.readFile('./data/products.json', (err, file) => {

        const products = JSON.parse(file);
        const deleteIndexById = products.findIndex(product => product.id===id);
        
        if(deleteIndexById===-1) {
            res.status(404);
            res.send('Hiba! Ilyen ID nem létezik!');
            return;
        }

        products.splice(deleteIndexById, 1);

        fs.writeFile('./data/products.json', JSON.stringify(products), () => {
            res.send(`id: ${id}, sikeresen törölve`);
        });

    })

})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})

const uid = function(){
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}