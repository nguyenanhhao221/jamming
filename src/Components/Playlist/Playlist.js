import React from "react";
import './Playlist.css';

export class Playlist extends React.Component {
    render() {
        return (
            <div className="Playlist">
                {/* use defaultValue because we might want to update the value later */}
                <input defaultValue="New Playlist" />
                {/* <!-- Add a TrackList component --> */}
                <button className="Playlist-save">SAVE TO SPOTIFY</button>
            </div>);
    }
};