const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {env} = require('process');
const cors = require('cors');
dotenv.config();
const { getRoutes } = require('./routes');
const app = express();

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
});
app.use(express.json());
app.use(cors());

app.use('/',getRoutes());

app.listen(process.env.PORT,()=>{
    console.log(`App running on port ${process.env.PORT}.`)
})

exports.app = app;