import React from "react";
import './SearchResults.css';
import { TrackList } from "../TrackList/TrackList";

export class SearchResults extends React.Component {
    render() {
        return (
            <div className="SearchResults">
                <h2>Results</h2>
                {/* <!-- Add a TrackList component --> */}
                {/* Pass into TrackList component a props name tracks with the value of props searchResults from SearchResults component (that were passed in App component) */}
                {/* We will use .map to render each object in result array in TrackList component */}
                <TrackList 
                    tracks={this.props.searchResults}  
                />
            </div>);
    }

};
