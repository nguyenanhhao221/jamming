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
app.get('/api',(request, response) => {
    const client_secret =  process.env.CLIENT_SECRET;
    const client_id = process.env.CLIENT_ID;

    response.json({
        client_secret: client_secret,
        client_id: client_id
    });
})
