const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.get('/', (req, res) => {
    res.send('Na végre kész!');
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
