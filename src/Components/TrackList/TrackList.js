import React from "react";
import './TrackList.css';
import { Track } from "../Track/Track";

export class TrackList extends React.Component {
    render() {
        return (
            <div className="TrackList">
                {/* <!-- You will add a map method that renders a set of Track components  --> */}
                {/* For now, you will hard code three tracks. In a later assessment, we will replace the hard-coded values with tracks from Spotify. */}
                {/* For each track obj in the array we return each Track component */}
                {/* For each Track component we will pass in props name track which contain 1 track from the array */}
                {
                    this.props.tracks.map(track => {
                        return <Track
                                track={track}
                                // save track.id to attribute key and pass to Track
                                key={track.id} 
                                //Pass onAdd attribute with value of onAdd from TrackList to Track component
                                onAdd={this.props.onAdd}
                                />
                    })
                }
            </div>
        );
    }
};