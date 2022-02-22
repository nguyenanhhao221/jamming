const express = require('express');
const cors = require('cors');
// const axios = require('axios');
const Router = express.Router();
require('dotenv').config();


//Express
const app = express();
//Use CORS policy
app.use(cors());

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Listening for PORT: ${PORT}`));

//Routes
//When ever make call to localhost/api it will call the index.js in routes folder 
app.use('/api', require('./routes'));
