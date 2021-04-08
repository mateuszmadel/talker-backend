const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();
const { getRoutes } = require('./routes');



const app = express();
const port = 8080;

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
}).then(()=>console.log("connected to DB"));
app.use(express.json());
app.use(cors());

app.use('/',getRoutes());

app.listen(port,()=>{
    console.log(`App running on port ${port}.`)
})