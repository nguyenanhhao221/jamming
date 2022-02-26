const express = require('express');
const router = express.Router();
const cors = require('cors');
const axios = require('axios').default; // axios.<method> will now provide autocomplete and parameter typings
require('dotenv').config();

//Store important info
const client_secret = process.env.CLIENT_SECRET;
const client_id = process.env.CLIENT_ID;
const redirect_uri = 'http://localhost:3000/callback'

const generateRandomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
//Authorize to login with Spotify and allow our app with user's permission.
const authorizeAPI = 'https://accounts.spotify.com/authorize?';



router.use(express.json())
router.use(cors());
router.get('/', (req, res) => {
    const requestQuery = req.query;
    requestQuery.client_id = client_id;
    const params = new URLSearchParams()
    // const authorizeEndpoint = `${authorizeAPI}${new URLSearchParams(params)}`;
    // res.json(
    //     {
    //         authorizeEndpoint: authorizeEndpoint,
    //     });
    res.json({
        result: req.query
    })
})



module.exports = router;
