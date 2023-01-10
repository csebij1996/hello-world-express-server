const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var cors = require('cors');

app.use(
    cors({origin: ['http://localhost:3000', 'http://127.0.0.1:3000']})
);

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/', (req, res) => {
    res.send('Helló világ!');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
