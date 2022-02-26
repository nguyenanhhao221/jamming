const express = require('express');
const router = express.Router();
const cors = require('cors');
const axios = require('axios').default; // axios.<method> will now provide autocomplete and parameter typings
require('dotenv').config();
const cookieParser = require('cookie-parser'); // use cookie to store the state key
const request = require('request');
const url = require('url');
//Store important info
const client_secret = process.env.CLIENT_SECRET;
const client_id = process.env.CLIENT_ID;
const redirect_uri = 'http://localhost:8000/api/callback'

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
router.get('/', async (req, res) => {
    const requestQuery = await req.query;
    requestQuery.client_id = client_id; // Add the client_id which saved in env to the params

    const newParams = new URLSearchParams(requestQuery);
    const endpoint = `${authorizeAPI}${new URLSearchParams(newParams)}`;

    let stateSent = requestQuery.state;
    var stateKey = 'spotify_auth_state';
    res.cookie(stateKey, stateSent);

    res.json({ result: endpoint });
})

router.get('/callback', (req, res) => {
    let authorizeCode = req.query.code || null;
    let stateSentBack = req.query.state || null;
    const url = 'https://accounts.spotify.com/api/token';

    let body = {
        code: authorizeCode,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
    };
    let params = new URLSearchParams(body);
    let authOptions = {
        headers: {
            'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    };
   

    console.log(authorizeCode);
    axios.post(url, params.toString(),authOptions).then(response => {
        if(response.status === 200) {
            console.log(response);
        }
    })
    
    res.redirect('http://localhost:3000/callback');
})


module.exports = router;
