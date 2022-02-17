 //generateRandomString will be used in the "state" which needed to be sent to get user access token.
const generateRandomString = function (length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

const Spotify = {
    accessInfo: {
        client_id: 'bb4fd4f43c4f4708842f10c07c853722', // Your client id
        state: generateRandomString(16), // state is not required but strongly recommend.It generates a random string to be sent together to spotify and spotify will included this string in its response so we can compare to avoid fake response. This provides protection against attacks such as cross-site request forgery
        redirect_uri: 'http://localhost:3000/', // Your redirect uri
        response_type: 'code',
        scope: 'playlist-modify-private user-read-private user-read-email'
    },
    client_secret: '51ef560eef1f4389ba4d3f8609cc0a0d',
    access_token: '', //Access token for Spotify which will be returned by Spotify after the user put in Spotify account correctly
    authorizeAPI: 'https://accounts.spotify.com/authorize?',

    getAuthorizeEndpoint() {
        const authorizeEndpoint = `${this.authorizeAPI}${new URLSearchParams(this.accessInfo)}`;
        return authorizeEndpoint;
    }
  
};

export default Spotify;