//generateRandomString will be used in the "state" which needed to be sent to get user access token.
const generateRandomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
const urlToBackend = 'http://localhost:8000';
const SpotifyBackend = {
    authorizationCode: '',// which will later be exchanged for accessToken
    accessToken: '', //required for making request to retrieve data from Spotify
    refreshToken: '', //required when the authorization code expires
    //Get the authorization code when we start to login in
    async handleLogin() {
        if (this.accessToken) {
            return this.accessToken;
        }
        const url = `${urlToBackend}/api?`;
        const options = {
            method: 'GET',
        }
        const params = {
            state: generateRandomString(16), // state is not required but strongly recommend.It generates a random string to be sent together to spotify and spotify will included this string in its response so we can compare to avoid fake response. This provides protection against attacks such as cross-site request forgery
            redirect_uri: `${urlToBackend}/api/callback`, // Your redirect uri
            response_type: 'code',
            //Which scope info that we need to see in user Spotify data
            scope: 'playlist-modify-private playlist-read-collaborative playlist-read-private playlist-modify-public user-read-private user-read-email'
        }
        const endpoint = `${url}${new URLSearchParams(params)}`;
        // this.fetchAPI(endpoint,options)
        let response = await fetch(endpoint, options);
        if (response.ok) {
            const jsonResponse = await response.json();
            window.location.href = jsonResponse.result;
        }
        return this.accessToken = await this.getAccessToken()
    },
    async getAccessToken() {
        if (this.accessToken) {
            return this.accessToken
        }
        fetch(`${urlToBackend}/api/token`)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Request failed');
            }, networkError => {
                console.log(networkError.message);
            }).then(jsonResponse => {
                this.accessToken = jsonResponse.access_token;
                this.refreshToken = jsonResponse.refresh_token
                return this.accessToken;
            })
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

    async searchUsingBackend(term) {
        if (!this.accessToken) {
            this.handleLogin();
            this.getAccessToken();
        }

        return this.getTracks(term)
    }
};

export default SpotifyBackend;