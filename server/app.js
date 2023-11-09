const path = require('path');
const v1Api = require('./src/routes/apiVersions/apiV1')

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

// app.use(cors({
//     origin:'http://localhost:3000'
// }));
app.use(morgan('combined'))

app.use(express.json());
app.use('/v1/launch',(req,res)=>{
    res.send({'hello':'world'})
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


module.exports = app;