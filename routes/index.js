const express = require('express');
const router = express.Router();
const axios = require('axios').default; // axios.<method> will now provide autocomplete and parameter typings

require('dotenv').config();

//Store important info
const client_secret = process.env.CLIENT_SECRET;
const client_id = process.env.CLIENT_ID;

router.get('/', (req, res) => {
    res.json({
        client_id: client_id,
        client_secret: client_secret
    })
})



module.exports = router;
