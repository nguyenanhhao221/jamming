import React from "react";
import './Playlist.css';
import { TrackList } from "../TrackList/TrackList";
export class Playlist extends React.Component {
    render() {
        return (
            <div className="Playlist">
                {/* use defaultValue because we might want to update the value later */}
                <input defaultValue="New Playlist" />
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