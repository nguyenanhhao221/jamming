import React from "react";
import './Playlist.css';
import { TrackList } from "../TrackList/TrackList";
export class Playlist extends React.Component {
    constructor(props) {
        super(props);
        //bind handleNameChange because it used this.props.onNameChange so need to make sure it refer to the correct instance
        this.handleNameChange = this.handleNameChange.bind(this);
    }

    //handleNameChange method 
    handleNameChange(e) {
        //Access the onNameChange attribute which is the updatePlaylistName method of App component. 
        // Then pass the value of the input we get into updatePlaylistName method
        // if the user change the name of the Playlist, it will update to the App's playlistname state
        this.props.onNameChange(e.target.value);
    }

    render() {
        return (
            <div className="Playlist">
                {/* use defaultValue because we might want to update the value later */}
                <input 
                    defaultValue="New Playlist" 
                    // onChange event listener will trigger handleChange method
                    onChange={this.handleNameChange}/>
                {/* <!-- Add a TrackList component --> */}
                {/*  */}
                <TrackList 
                    tracks={this.props.playlistTracks}
                    // Set isRemoval to true so that in Track component, we can render the "-" button
                    isRemoval={true}
                    //pass onRemove with props onRemove so later can be used in Track component
                    onRemove={this.props.onRemove}/>
                <button className="Playlist-save">SAVE TO SPOTIFY</button>
            </div>);
    }
};