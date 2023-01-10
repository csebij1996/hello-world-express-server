const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', function(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'); // If needed
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type'); // If needed
    res.setHeader('Access-Control-Allow-Credentials', true); // If needed

    let proba = {
        name: 'Csébi János',
        age: 26
    }

    res.send(JSON.stringify(proba));
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
