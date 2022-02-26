//generateRandomString will be used in the "state" which needed to be sent to get user access token.
const generateRandomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const authorizeAPI = 'https://accounts.spotify.com/authorize?';
const accessInfo = {
    redirect_uri: 'http://localhost:3000/callback', // Your redirect uri
    client_id: 'bb4fd4f43c4f4708842f10c07c853722'
};
const client_secret = '51ef560eef1f4389ba4d3f8609cc0a0d';

const Spotify = {
    authorizationCode: '',// which will later be exchanged for accessToken
    accessToken: '', //required for making request to retrieve data from Spotify
    refreshToken: '', //required when the authorization code expires
    //Get the authorization code when we start to login in
    isLoggedIn: false,
    getAuthorizationCode() {
        //Check if the access_token is already have value. If yes, keep the value of it
        if (this.authorizationCode || this.accessToken) {
            return this.authorizationCode;
        }
        //Check if the access_token is already in the URL (just logged in successfully)
        //Spotify will give the access token in the URL after the "code" so need to check if the URL match and code have value or not
        //Save this value to authorizationCode
        let authorizationCodeMatch = null;
        let stateMatch = null;
        const queryString = window.location.search; //search will return the string after "?" in url
        if (queryString.length > 0) {
            const urlParams = new URLSearchParams(queryString);
            authorizationCodeMatch = urlParams.get('code');
            stateMatch = urlParams.get('state');
            if (stateMatch === sessionStorage.getItem('state')) {
                window.history.pushState("", "", accessInfo.redirect_uri) // remove params from url
                sessionStorage.clear() // clear storage
                return this.authorizationCode = authorizationCodeMatch;
            } else {
                alert('state mismatch');
            }

        }
        //If the access token is not set AND the URL is not contain any access token, need to ask the user to login by directing to spotify login 
        else {
            const params = {
                client_id: 'bb4fd4f43c4f4708842f10c07c853722', // Your client id
                state: generateRandomString(16), // state is not required but strongly recommend.It generates a random string to be sent together to spotify and spotify will included this string in its response so we can compare to avoid fake response. This provides protection against attacks such as cross-site request forgery
                redirect_uri: 'http://localhost:3000/callback', // Your redirect uri
                response_type: 'code',
                //Which scope info that we need to see in user Spotify data
                scope: 'playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public user-read-private user-read-email'
            }
            const authorizeEndpoint = `${authorizeAPI}${new URLSearchParams(params)}`;
            const queryString = new URLSearchParams(params);
            const stateKey = queryString.get('state');
            sessionStorage.setItem('state', stateKey); //save the state we first sent to Spotify into sessionStorage to later be compared with state returned from Spotify
            // @ts-ignore
            return window.location = authorizeEndpoint;
        }
    },

    //getAccessToken method. Send request to Spotify API with the authorization code from getAuthorizationCode() and get access Token
    getAccessToken() {
        const apiToken = 'https://accounts.spotify.com/api/token';
        //Data which will be sent together with the request
        const data = {
            grant_type: "authorization_code",
            code: this.authorizationCode,
            redirect_uri: accessInfo.redirect_uri
        }
        //btoa use to encoded with base64 
        const base64EncodedStr = btoa(accessInfo.client_id + ":" + client_secret)
        const options = {
            headers: {
                'Authorization': `Basic ${base64EncodedStr}`,
                //Spotify required Content-type so the body below need to be using with URLSearchParams
                'Content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            //Need to use URLSearchParams to convert data to correct format
            body: new URLSearchParams(data)
        }

        if (this.accessToken) {
            return this.accessToken;
        }
        //save access_token acquire from API to Spotify object. accessToken
        this.fetchAPI(apiToken, options)
            .then(jsonResponse => {
                //if status of response is 401
                //The accessToken might expire because it only last 3600s (1h)
                //So need to send request for new accessToken with refreshToken
                if (jsonResponse.status === 401) {
                    this.refreshAccessToken(apiToken, data, options)
                }
                this.accessToken = jsonResponse.access_token;
                //also quire the refreshToken from this API call
                this.refreshToken = jsonResponse.refresh_token;
            });
        return;
    },
    //This method will access the data send in the request and update key/value to meet Spotify requirement for resend access token with refresh token
    refreshAccessToken(apiToken, newData, options) {
        newData.grant_type = "refresh_token";
        newData.refresh_token = this.refreshToken;
        delete newData.code;
        return this.fetchAPI(apiToken, options).then(jsonResponse => {
            this.accessToken = jsonResponse.access_token;
            this.refreshToken = jsonResponse.refresh_token;
        })
    },
    //handleLoginSpotify
    //Will be called to check if the user is logged in yet
    handleLoginSpotify() {
        this.getAuthorizationCode();
        this.getAccessToken();
    },

    //fetchAPI method
    async fetchAPI(apiEndpoint, options) {
        try {
            const response = await fetch(apiEndpoint, options);
            if (response.ok) {
                const jsonResponse = await response.json();
                return jsonResponse;
            }
            throw new Error('Request failed')
        } catch (error) {
            console.log(error)
        }
    },
    // getTracks from Spotify using API
    async getTracks(term) {
        const apiToFetch = 'https://api.spotify.com/v1/search?'
        const query = {
            q: term,
            type: 'track'
        }

        const apiEndpoint = apiToFetch + new URLSearchParams(query);

        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
            },
            method: 'GET',
        }
        const tracks = await this.fetchAPI(apiEndpoint, options);
        return tracks;
    },
    //savePlaylistToSpotify. In order to savePlaylist to Spotify of the user we will need to
    // 1. Get the current user's Spotify ID
    // 2. Create an empty playlist 
    // 3. Add items to that empty playlist
    savePlaylistToSpotify(playlistName, playlistTracks) {
        this.handleLoginSpotify();
        // this.getCurrentUserProfile();
        // return this.createEmptyPlaylist(playlistName);
        this.addItemsToPlaylist(playlistName, playlistTracks);
    },
    async getCurrentUserProfile() {
        const apiEndpoint = 'https://api.spotify.com/v1/me';
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
            },
            method: 'GET',
        };
        let currentUserInfo = await this.fetchAPI(apiEndpoint, options);
        return currentUserInfo.id;
    },
    //createPlaylist method
    //Create an Empty playlist and get that playlist id from Spotify API
    //Later will add tracks to this empty playlist
    async createEmptyPlaylist(playlistName) {
        const userID = await this.getCurrentUserProfile();
        const apiEndpoint = `https://api.spotify.com/v1/users/${userID}/playlists`;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
            },
            method: 'POST',
            body: JSON.stringify({
                name: playlistName,
                description: "Playlist created by Jammming clone of Hao Nguyen",
                public: false
            })
        };
        const playlist = await this.fetchAPI(apiEndpoint, options);
        return playlist.id;
    },


    //Add tracks from App component. Current playlist (state.playlistTracks) to the current user Spotify Account's playlist 
    //Using playlistID of the empty playlist create with createEmptyPlaylist()
    //Make request to Spotify API with body of the track URIs
    async addItemsToPlaylist(playlistName, playlistTrackURIs) {
        const playlistID = await this.createEmptyPlaylist(playlistName);
        const apiEndpoint = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
            },
            method: 'POST',
            body: JSON.stringify({
                uris: playlistTrackURIs
            })
        };

        const playlistCreated = await this.fetchAPI(apiEndpoint, options);
        return playlistCreated;
    },

    // returns a promise that will eventually resolve to the list of tracks from the search.
    search(term) {
        this.handleLoginSpotify();
        return this.getTracks(term);
    },

    async handleLogin() {
        const url = 'http://localhost:8000/api?';
        const options = {
            method: 'GET',
        }
        const params = {
            state: generateRandomString(16), // state is not required but strongly recommend.It generates a random string to be sent together to spotify and spotify will included this string in its response so we can compare to avoid fake response. This provides protection against attacks such as cross-site request forgery
            redirect_uri: 'http://localhost:8000/api/callback', // Your redirect uri
            response_type: 'code',
            //Which scope info that we need to see in user Spotify data
            scope: 'playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public user-read-private user-read-email'
        }
        const endpoint = `${url}${new URLSearchParams(params)}`;
        // this.fetchAPI(endpoint,options)
        let response = await fetch(endpoint, options);
        if (response.ok) {
            const jsonResponse = await response.json();
            console.log(jsonResponse);
            window.location.href = jsonResponse.result;
            return this.isLoggedIn = true;
        }
    }
};

export default Spotify;