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
    }
    // addTrack method
    // adds a song to the playlist state. The application passes the method through a series of components to Track. The user can trigger the .addTrack() method by clicking the + sign from the search results list.
    // Use the track’s id property to check if the current song is in the playlistTracks state.
    // If the id is new, add the song to the end of the playlist.
    // Set the new state of the playlist
    addTrack(track) {
        // if(!(this.state.playlistTracks.map(playlistTrack => playlistTrack.id).includes(track.id))) {
        //     //remember to bind addTrack because we use this.setState
        //     //Need to bind to make sure "this" refer to correct instance
        //     this.setState({playlistTracks: track})
        // }
        // const tracks = this.state.playlistTracks;
        let tempPlaylistTracks = this.state.playlistTracks;
        // if (tempPlaylistTracks.find(savedTrack => savedTrack.id === track.id)) {
        //     return;
        // }
        if(tempPlaylistTracks.map(eachTrack => eachTrack.id).includes(track.id)) {
            return;
        }
        
        tempPlaylistTracks.push(track); //use push here because the playListTracks is an ARRAY contain several objects. This way when we setState, it will merge 2 array contain object together
        this.setState({playlistTracks: tempPlaylistTracks})
    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    {/* <!-- Add a SearchBar component --> */}
                    <SearchBar />
                    <div className="App-playlist">
                        {/* <!-- Add a SearchResults component --> */}
                        {/* Pass the searchResults state of App into SearchResults component with prop name "searchResults" */}
                        <SearchResults
                            searchResults={this.state.searchResults}
                            onAdd={this.addTrack} />
                        {/* <!-- Add a Playlist component --> */}
                        <Playlist
                            playlistName={this.state.playlistName}
                            playlistTracks={this.state.playlistTracks} />
                    </div>
                </div>
            </div>
        )
    }
};