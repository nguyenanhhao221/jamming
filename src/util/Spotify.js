//generateRandomString will be used in the "state" which needed to be sent to get user access token.
const generateRandomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
//Access token for Spotify which will be returned by Spotify after the user put in Spotify account correctly
const authorizeAPI = 'https://accounts.spotify.com/authorize?';
const accessInfo= {
    client_id: 'bb4fd4f43c4f4708842f10c07c853722', // Your client id
    state: generateRandomString(16), // state is not required but strongly recommend.It generates a random string to be sent together to spotify and spotify will included this string in its response so we can compare to avoid fake response. This provides protection against attacks such as cross-site request forgery
    redirect_uri: 'http://localhost:3000/callback', // Your redirect uri
    response_type: 'code',
    scope: 'playlist-modify-private user-read-private user-read-email'
};
const client_secret = '51ef560eef1f4389ba4d3f8609cc0a0d';

const Spotify = {
    accessToken: '',
    //Get the access token when we start to login in
    //If it's the first time 
    getAccessToken() {
        //Check if the access_token is already have value. If yes, keep the value of it
        if (this.accessToken) {
            return this.accessToken;
        }
        //Check if the access_token is already in the URL (just logged in successfully)
        //Spotify will give the access token in the URL after the "code" so need to check if the URL match and code have value or not
        //Save this value to this.access_token
        const accessTokenMatch = window.location.href.match(/code=([^&]*)/);
        if (accessTokenMatch) {
            return this.accessToken = accessTokenMatch[1];
        }
        //If the access token is not set AND the URL is not contain any access token, need to ask the user to login by directing to spotify login 
        else {
            const authorizeEndpoint = `${authorizeAPI}${new URLSearchParams(accessInfo)}`;
            // @ts-ignore
            return window.location = authorizeEndpoint;
        }
    }
};

export default Spotify;