import React from "react";
import Spotify from "../../util/Spotify";
import './SearchBar.css';

export class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        //set initial state is term with empty value
        //we will store and setState for term here as the user input in the search bar
        this.state = {
            term: "",
            token: Spotify.access_token
        };

        this.handleTermChange = this.handleTermChange.bind(this);
        this.search = this.search.bind(this);
        // this.handleSearch = this.handleSearch.bind(this);
    }
    //search method 
    //call the search method of App component and pass in the value of this SearchBar's state.term
    //The value of this SearchBar's state.term will be handle by handleTermChange method below
    search() {
        this.props.onSearch(this.state.term)
    }

    //handleTermChange method
    //Accept an event object as argument
    //Set the state of this SearchBar's term to the current value of the event target (input)

    handleTermChange(e) {
        this.setState({ term: e.target.value })
    }
    //handleSearch method. Run the getAccessToken method in Spotify. This method will check if the user is logged in or not, and if they do it will save the access token to Spotify.accessToken
    //Then handleSearch will setState to save that accessToken to SearchBar's state
    // handleSearch() {
    //     Spotify.getAccessToken();
    //     this.setState({ token: Spotify.accessToken })
    // }
    render() {
        return (
            <div className="SearchBar">
                <input
                    placeholder="Enter A Song, Album, or Artist"
                    onChange={this.handleTermChange} />
                <button
                    className="SearchButton"
                    onClick={this.search}
                >SEARCH</button>
            </div>
        )
    };
}