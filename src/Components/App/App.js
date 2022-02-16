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
                    id: '001',
                    album: '+'
                },
                {
                    name: 'Castle on the hill',
                    artist: 'Sheeran',
                    id: '002',
                    album: '+'
                },
                {
                    name: 'Castle on the hill',
                    artist: 'Justin Sheeran',
                    id: '003',
                    album: '-'
                },
            ]
        };
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
                        <SearchResults searchResults={this.state.searchResults} />
                        {/* <!-- Add a Playlist component --> */}
                        <Playlist />
                    </div>
                </div>
            </div>
        )
    }
};