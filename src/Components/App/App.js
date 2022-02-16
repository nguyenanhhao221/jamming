import React from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

export class App extends React.Component {
    constructor(props) {
        super(props);
        // set initial state for searchResult as an object
        //We use hard code at first.
        //Later this will be update with API from Spotify
        this.state = {
            searchResults: [
                {
                    name: 'Castle on the hill',
                    artist: 'Ed Sheeran',
                    id: 1,
                    album: '+'
                },
                {
                    name: 'Castle on the hill',
                    artist: 'Sheeran',
                    id: 2,
                    album: '+'
                },
                {
                    name: 'Castle on the hill',
                    artist: 'Justin Sheeran',
                    id: 3,
                    album: '-'
                },
            ],

            playlistName: 'play list name',

            playlistTracks: [
                {
                    name: 'playlistName1',
                    artist: 'playlistArtist1',
                    id: 4,
                    album: 'playlistAlbum1'
                },
                {
                    name: 'playlistName2',
                    artist: 'playlistArtist2',
                    id: 5,
                    album: 'playlistAlbum2'
                },
                {
                    name: 'playlistName3',
                    artist: 'playlistArtist3',
                    id: 6,
                    album: 'playlistAlbum3'
                }
            ]
        };
        //bind addTrack method to make sure this.setState used in addTrack refer to correct instance
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePLaylist = this.savePLaylist.bind(this);
        this.search = this.search.bind(this);
    }
    // addTrack method
    // adds a song to the playlist state. The application passes the method through a series of components to Track. The user can trigger the .addTrack() method by clicking the + sign from the search results list.
    // Use the track’s id property to check if the current song is in the playlistTracks state.
    // If the id is new, add the song to the end of the playlist.
    // Set the new state of the playlist
    addTrack(track) {
        let tempPlaylistTracks = this.state.playlistTracks;
        if (tempPlaylistTracks.map(eachTrack => eachTrack.id).includes(track.id)) {
            return;
        }
        // Can also use .find method to check if id already exist
        /*
        if (tempPlaylistTracks.find(savedTrack => savedTrack.id === track.id)) {
            return;
        }
        */
        tempPlaylistTracks.push(track); //use push here because the playListTracks is an ARRAY contain several objects. This way when we setState, it will merge 2 array contain object together
        this.setState({ playlistTracks: tempPlaylistTracks })
        //remember to bind addTrack because we use this.setState.Need to bind to make sure "this" refer to correct instance
    }
    // removeTrack method which allow user to remove a song in the Playlist by click the "-" button
    removeTrack(track) {
        let newTracksList = this.state.playlistTracks.filter(eachTrack => eachTrack.id !== track.id);
        this.setState({playlistTracks: newTracksList})
    }

    //updatePlaylistName method which allow user to change the name of the current Playlist and we update its name to the current state
    updatePlaylistName(name) {
        this.setState({playlistName: name});
    }


    //savePlaylist method
    //Create an array of "uri" which will be contained in the playlistTrack
    //Using this "uri" to refer to the track in Spotify's library
    savePLaylist() {
        let trackURIs = this.state.playlistTracks.map(track => track.uri);
        return trackURIs;
    }
    //search method
    //accept the search's value entered by user and later will be send to Spotify API
    search(searchTerm) {
        console.log(searchTerm);
    }
    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    {/* <!-- Add a SearchBar component --> */}
                    
                    <SearchBar 
                        //Pass attribute onSearch with the search method
                        onSearch={this.search} />
                        
                    <div className="App-playlist">
                        {/* <!-- Add a SearchResults component --> */}
                        {/* Pass the searchResults state of App into SearchResults component with prop name "searchResults" */}
                        <SearchResults
                            searchResults={this.state.searchResults}
                            onAdd={this.addTrack} />
                        {/* <!-- Add a Playlist component --> */}
                        <Playlist
                            playlistName={this.state.playlistName}
                            playlistTracks={this.state.playlistTracks} 
                            // Pass onRemove with removeTrack method
                            onRemove={this.removeTrack}
                            // Pass attribute onNameChange with the updatePlaylistName method
                            onNameChange={this.updatePlaylistName}
                            //Pass attribute onSave with the savePlaylist method
                            onSave={this.savePLaylist}
                            />
                    </div>
                </div>
            </div>
        )
    }
};