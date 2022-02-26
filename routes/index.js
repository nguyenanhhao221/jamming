const express = require('express');
const router = express.Router();
const cors = require('cors');
const axios = require('axios').default; // axios.<method> will now provide autocomplete and parameter typings
require('dotenv').config();
const cookieParser = require('cookie-parser'); // use cookie to store the state key


//Store important info
const client_secret = process.env.CLIENT_SECRET;
const client_id = process.env.CLIENT_ID;
const redirect_uri = 'http://localhost:8000/api/callback';
const authorizeAPI = 'https://accounts.spotify.com/authorize?';
let authorizeCode, accessToken, refreshToken;

//Authorize to login with Spotify and allow our app with user's permission.
router.use(express.json())
router.use(cors());

router.get('/', async (req, res) => {
    if (authorizeCode) {
        return;
    }
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
    if (accessToken) {
        return;
    }
    authorizeCode = req.query.code || null;
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

    axios.post(url, params.toString(), authOptions)
        .then(response => {
            if (response.status === 200) {
                accessToken = response.data.access_token;
                refreshToken = response.data.refresh_token;
                console.log(accessToken);
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
    res.redirect('http://localhost:3000/callback');
})

router.get('/refresh_token', (req, res) => {
    let body = {
        refresh_token: refreshToken,
        grant_type: 'refresh_token'
    };
    let params = new URLSearchParams(body);
    let authOptions = {
        headers: {
            'Authorization': 'Basic ' + btoa(client_id + ":" + client_secret),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    };
    const url = 'https://accounts.spotify.com/api/token';

    axios.post(url, params.toString(), authOptions)
        .then(response => {
            if (response.status === 200) {
                accessToken = response.data.access_token;
                return;
            }
        })
        .catch(error => {
            console.log(error);
        })
})

module.exports = router;
